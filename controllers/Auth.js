const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

exports.Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) return res.status(404).json({ msg: "No existe ese usuario" });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ msg: "Contraseña incorrecta" });

        // Guarda el userId en la sesión
        req.session.userId = user.uuid;

        req.session.save(err => {
            if (err) {
                return res.status(500).json({ msg: 'Error al guardar la sesión' });
            }
            res.status(200).json({
                msg: 'Inicio de sesión exitoso',
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role
            });
        });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.Me = async (req, res) => {
    try {
        console.log("Session on /me:", req.session);
        if (!req.session.userId) {
            return res.status(401).json({ msg: "Primero inicia sesión" });
        }

        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) return res.status(404).json({ msg: "No existe ese usuario" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};


exports.logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "No se puede cerrar la sesión" });
        res.status(200).json({ msg: "Se ha desconectado con éxito" });
    });
}
