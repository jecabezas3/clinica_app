const User = require("../models/UserModel");
const sessionStore = require("../index");

const User = require("../models/UserModel");
const sessionStore = require("../index"); // Asegúrate de que esto esté correctamente configurado

exports.verifyUser = async (req, res, next) => {
    console.log('Entering verifyUser middleware');
    console.log('Session ID (sid) at verifyUser:', req.sessionID);
    console.log('Session at verifyUser:', req.session);

    // Verificar si `userId` está presente en la sesión
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Primero inicia sesión" });
    }

    try {
        // Obtener los datos de la sesión desde el store
        const sessionData = await sessionStore.get(req.sessionID);
        console.log('Session Data from Store:', sessionData);

        if (!sessionData) {
            return res.status(401).json({ msg: "Sesión no válida o expirada" });
        }

        // Obtener el usuario basado en `userId` almacenado en la sesión
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "No existe ese usuario" });
        }

        // Almacenar información del usuario en el objeto `req`
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        console.error('Error en verifyUser middleware:', error.message);
        res.status(500).json({ msg: error.message });
    }
};

exports.adminOnly = async (req, res, next) => {
    console.log('Session at adminOnly:', req.session);
    console.log('Session ID (sid) at adminOnly:', req.sessionID);

    try {
        // Obtener los datos de la sesión desde el store
        const sessionData = await sessionStore.get(req.sessionID);
        console.log('Session Data from Store:', sessionData);

        if (!sessionData) {
            return res.status(401).json({ msg: "Sesión no válida o expirada" });
        }

        // Obtener el usuario basado en `userId` almacenado en la sesión
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "No existe ese usuario" });
        }

        // Verificar si el usuario tiene el rol de administrador
        if (user.role !== "admin") {
            return res.status(403).json({ msg: "Acceso Prohibido" });
        }

        // Almacenar información del usuario en el objeto `req`
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        console.error('Error en adminOnly middleware:', error.message);
        res.status(500).json({ msg: error.message });
    }
};
