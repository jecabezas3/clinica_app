const express = require('express');
const { Login, logOut, Me } = require('../controllers/Auth');
const { verifyUser, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener los datos del usuario autenticado
// Usa el middleware verifyUser para asegurarse de que el usuario está autenticado
router.get('/me', verifyUser, Me);

// Ruta para iniciar sesión
router.post('/login', Login);

// Ruta para cerrar sesión
// Opcionalmente puedes usar verifyUser para asegurarte de que el usuario esté autenticado antes de cerrar sesión
router.delete('/logout', verifyUser, logOut);

module.exports = router;
