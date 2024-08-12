const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "El password no coincide" });

    // Hashea la contraseña usando bcrypt
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Registro Exitoso" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "No se encuentra el usuario" });

    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;

    // Si la contraseña está vacía, no actualices el hash
    if (password === "" || password === null) {
        hashPassword = user.password;
    } else {
        if (password !== confPassword) return res.status(400).json({ msg: "El password no coincide" });
        hashPassword = await bcrypt.hash(password, 10);
    }

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "Usuario Actualizado" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "No se encuentra el usuario" });

    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "Usuario Eliminado" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
