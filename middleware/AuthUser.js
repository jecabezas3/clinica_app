const User = require("../models/UserModel");
const sessionStore = require("../index");

// Importa la variable global desde el archivo donde está definida
const { globalSession } = require('../controllers/Auth'); // Asegúrate de ajustar el nombre de archivo

exports.verifyUser = async (req, res, next) => {
    try {
        console.log(globalSession);
        // Verifica si la sesión global está definida
        if (!globalSession || !globalSession.userId) {
            return res.status(401).json({ msg: "Primero inicia sesión" });
        }

        // Busca al usuario usando el userId de la sesión global
        const user = await User.findOne({
            where: {
                uuid: globalSession.userId
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
    try {
        // Verifica si la sesión global está definida
        if (!globalSession || !globalSession.userId) {
            return res.status(401).json({ msg: "Primero inicia sesión" });
        }

        // Busca al usuario usando el userId de la sesión global
        const user = await User.findOne({
            where: {
                uuid: globalSession.userId
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
