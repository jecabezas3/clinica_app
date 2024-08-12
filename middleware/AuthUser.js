const User = require("../models/UserModel");

exports.verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Primero inicia sesión" });
    }
    try {
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        if (!user) return res.status(404).json({ msg: "No existe ese usuario" });
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

exports.adminOnly = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        if (!user) return res.status(404).json({ msg: "No existe ese usuario" });
        if (user.role !== "admin") return res.status(403).json({ msg: "Acceso Prohibido" });
        next();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
