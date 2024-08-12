const Paciente = require("../models/PacienteModel");
const User = require("../models/UserModel");
const { Op } = require("sequelize");

exports.getPacientes = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Paciente.findAll({
                attributes: [
                    'uuid', 'name', 'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                    'fechaNacimiento', 'codSexo', 'codPaisResidencia', 'codMunicipioResidencia'
                ],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Paciente.findAll({
                attributes: [
                    'uuid', 'name', 'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                    'fechaNacimiento', 'codSexo', 'codPaisResidencia', 'codMunicipioResidencia'
                ],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getPacienteById = async (req, res) => {
    try {
        const paciente = await Paciente.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!paciente) return res.status(404).json({ msg: "No se encontró el paciente" });
        let response;
        if (req.role === "admin") {
            response = await Paciente.findOne({
                attributes: [
                    'uuid', 'name', 'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                    'fechaNacimiento', 'codSexo', 'codPaisResidencia', 'codMunicipioResidencia'
                ],
                where: {
                    id: paciente.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Paciente.findOne({
                attributes: [
                    'uuid', 'name', 'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                    'fechaNacimiento', 'codSexo', 'codPaisResidencia', 'codMunicipioResidencia'
                ],
                where: {
                    [Op.and]: [{ id: paciente.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.createPaciente = async (req, res) => {
    const { name, tipoDocumentoIdentificacion, numDocumentoIdentificacion, fechaNacimiento, codSexo, codPaisResidencia, codMunicipioResidencia } = req.body;
    try {
        await Paciente.create({
            name,
            tipoDocumentoIdentificacion,
            numDocumentoIdentificacion,
            fechaNacimiento,
            codSexo,
            codPaisResidencia,
            codMunicipioResidencia,
            userId: req.userId
        });
        res.status(201).json({ msg: "Paciente creado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.updatePaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!paciente) return res.status(404).json({ msg: "No se encontró el paciente" });
        const { name, tipoDocumentoIdentificacion, numDocumentoIdentificacion, fechaNacimiento, codSexo, codPaisResidencia, codMunicipioResidencia } = req.body;

        // Uncomment and adjust the following block if you want to enforce access control
        // if (req.role === "admin") {
            await Paciente.update({
                name,
                tipoDocumentoIdentificacion,
                numDocumentoIdentificacion,
                fechaNacimiento,
                codSexo,
                codPaisResidencia,
                codMunicipioResidencia
            }, {
                where: {
                    id: paciente.id
                }
            });
        // } else {
            // if (req.userId !== paciente.userId) return res.status(403).json({ msg: "Acceso prohibido" });
            // await Paciente.update({
            //     name,
            //     tipoDocumentoIdentificacion,
            //     numDocumentoIdentificacion,
            //     fechaNacimiento,
            //     codSexo,
            //     codPaisResidencia,
            //     codMunicipioResidencia
            // }, {
            //     where: {
            //         [Op.and]: [{ id: paciente.id }, { userId: req.userId }]
            //     }
            // });
        // }
        res.status(200).json({ msg: "El paciente se actualizó correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.deletePaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!paciente) return res.status(404).json({ msg: "No se encontró el paciente" });

        // Uncomment and adjust the following block if you want to enforce access control
        // if (req.role === "admin") {
            await Paciente.destroy({
                where: {
                    id: paciente.id
                }
            });
        // } else {
            // if (req.userId !== paciente.userId) return res.status(403).json({ msg: "Acceso prohibido" });
            // await Paciente.destroy({
            //     where: {
            //         [Op.and]: [{ id: paciente.id }, { userId: req.userId }]
            //     }
            // });
        // }
        res.status(200).json({ msg: "Paciente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
