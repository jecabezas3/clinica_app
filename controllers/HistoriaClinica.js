const Paciente = require("../models/PacienteModel");
const Historia = require("../models/HistoriaClinicaModel");
const User = require("../models/UserModel");
const { Op } = require("sequelize");

exports.getHistorias = async (req, res) => {
    try {
        let response;
        response = await Historia.findAll({
            attributes: [
                'uuid', 'pacienteId', 'fechaConsulta', 'codigoConsulta', 
                'motivoConsulta', 'diagnosticoPrincipal', 'diagnosticoSecundario', 'procedimiento'
            ],
            include: [{
                model: Paciente,
                attributes: [
                    'name', 'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                    'fechaNacimiento', 'codSexo', 'codPaisResidencia', 'codMunicipioResidencia'
                ]
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getHistoriaById = async (req, res) => {
    try {
        const historia = await Historia.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!historia) return res.status(404).json({ msg: "No se encontró la historia" });
        let response;
        if (req.role === "doctor" || req.role === "admin") {
            response = await Historia.findOne({
                attributes: [
                    'uuid', 'pacienteId', 'fechaConsulta', 'codigoConsulta',
                    'motivoConsulta', 'diagnosticoPrincipal', 'diagnosticoSecundario', 'procedimiento'
                ],
                where: {
                    id: historia.id
                },
                include: [{
                    model: Paciente,
                    attributes: [
                        'name', 'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                        'fechaNacimiento', 'codSexo', 'codPaisResidencia', 'codMunicipioResidencia'
                    ]
                }]
            });
        } else {
            response = await Historia.findOne({
                attributes: [
                    'uuid', 'pacienteId', 'fechaConsulta', 'codigoConsulta',
                    'motivoConsulta', 'diagnosticoPrincipal', 'diagnosticoSecundario', 'procedimiento'
                ],
                where: {
                    [Op.and]: [{ id: historia.id }, { userId: req.userId }, { pacienteId: req.pacienteId }]
                },
                include: [{
                    model: Paciente,
                    attributes: [
                        'name', 'tipoDocumentoIdentificacion', 'numDocumentoIdentificacion',
                        'fechaNacimiento', 'codSexo', 'codPaisResidencia', 'codMunicipioResidencia'
                    ]
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.createHistoria = async (req, res) => {
    const { pacienteUuid, fechaConsulta, codigoConsulta, motivoConsulta, diagnosticoPrincipal, diagnosticoSecundario, procedimiento } = req.body;

    try {
        const paciente = await Paciente.findOne({
            where: { uuid: pacienteUuid }
        });

        if (!paciente) {
            return res.status(404).json({ msg: "Paciente no encontrado" });
        }

        await Historia.create({
            pacienteId: paciente.id,
            fechaConsulta,
            codigoConsulta,
            motivoConsulta,
            diagnosticoPrincipal,
            diagnosticoSecundario,
            procedimiento,
        });

        res.status(201).json({ msg: "Historia creada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.updateHistoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaConsulta, codigoConsulta, motivoConsulta, diagnosticoPrincipal, diagnosticoSecundario, procedimiento } = req.body;

        const historia = await Historia.findOne({
            where: {
                uuid: id
            }
        });

        if (!historia) return res.status(404).json({ msg: "No se encontró la historia" });

        if (req.role !== "doctor" && req.role !== "admin") {
            if (req.userId !== historia.userId) {
                return res.status(403).json({ msg: "Acceso denegado" });
            }
        }

        await Historia.update(
            {
                fechaConsulta,
                codigoConsulta,
                motivoConsulta,
                diagnosticoPrincipal,
                diagnosticoSecundario,
                procedimiento,
            },
            {
                where: {
                    id: historia.id
                }
            }
        );

        res.status(200).json({ msg: "La historia clínica se actualizó correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.deleteHistoria = async (req, res) => {
    try {
        const historia = await Historia.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!historia) return res.status(404).json({ msg: "No se encontró la historia clínica" });

        if (req.role === "doctor" || req.role === "admin") {
            await Historia.destroy({
                where: {
                    uuid: req.params.id
                }
            });
        } else {
            if (req.userId !== historia.userId) return res.status(403).json({ msg: "Acceso denegado" });

            await Historia.destroy({
                where: {
                    [Op.and]: [{ uuid: req.params.id }, { userId: req.userId }]
                }
            });
        }

        res.status(200).json({ msg: "Historia clínica eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
