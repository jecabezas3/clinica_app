const express = require('express');
const {
    getPaises,
    getPaisById,
    createPais,
} = require('../controllers/Paises');

const { verifyUser, adminOnly } = require('../middleware/AuthUser');

const router = express.Router();

router.get('/paises', verifyUser, adminOnly, getPaises);
router.get('/paises/:id', verifyUser, adminOnly, getPaisById);
router.post('/paises', verifyUser, adminOnly, createPais);

module.exports = router;
