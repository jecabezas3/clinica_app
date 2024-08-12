const express = require('express');
const {
    getHistorias,
    getHistoriaById,
    createHistoria,
    updateHistoria,
    deleteHistoria
} = require('../controllers/HistoriaClinica');

const { verifyUser } = require('../middleware/AuthUser');

const router = express.Router();

router.get('/historias', verifyUser, getHistorias);
router.get('/historias/:id', verifyUser, getHistoriaById);
router.post('/historias', verifyUser, createHistoria);
router.patch('/historias/:id', verifyUser, updateHistoria);
router.delete('/historias/:id', verifyUser, deleteHistoria);

module.exports = router;
