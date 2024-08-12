const Pais = require("../models/PaisModel");

exports.getPaises = async (req, res) => {
    try {
        const response = await Pais.findAll({
            attributes: ['idPais', 'nombrePais']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getPaisById = async (req, res) => {
    try {
        const response = await Pais.findOne({
            attributes: ['idPais', 'nombrePais'],
            where: {
                idPais: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.createPais = async (req, res) => {
    const { idPais, nombrePais } = req.body;
    try {
        await Pais.create({
            idPais: idPais,
            nombrePais: nombrePais,
        });
        res.status(201).json({ msg: "Registro Exitoso" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.deletePais = async (req, res) => {
    try {
        const pais = await Pais.findOne({
            where: {
                idPais: req.params.id
            }
        });
        if (!pais) return res.status(404).json({ msg: "No se encuentra el país" });

        await Pais.destroy({
            where: {
                idPais: pais.id
            }
        });
        res.status(200).json({ msg: "País Eliminado" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
