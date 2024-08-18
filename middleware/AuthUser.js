const User = require("../models/UserModel");
const sessionStore = require("../index");

exports.verifyUser = async (req, res, next) => {
    console.log('Entering verifyUser middleware');
    console.log('Session ID (sid) at verifyUser:', req.sessionID);
    console.log('Session at verifyUser:', req.session);

    if (!req.session.userId) {
        return res.status(401).json({ msg: "Primero inicia sesión" });
    }

    try {
        // Verifica los datos de la sesión
        const sessionData = await sessionStore.get(req.sessionID);
        console.log('Session Data from Store:', sessionData);

        if (!sessionData) {
            return res.status(401).json({ msg: "Sesión no válida o expirada" });
        }

        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "No existe ese usuario" });
        }

        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.adminOnly = async (req, res, next) => {
    console.log('Session at adminOnly:', req.session); // Muestra toda la sesión
    console.log('Session ID (sid) at adminOnly:', req.sessionID); // Muestra el SID de la sesión

    try {
        const sessionData = await sessionStore.get(req.sessionID); // Verifica los datos de la sesión
        console.log('Session Data from Store:', sessionData);

        if (!sessionData) {
            return res.status(401).json({ msg: "Sesión no válida o expirada" });
        }

        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "No existe ese usuario" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ msg: "Acceso Prohibido" });
        }

        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
