const express = require('express');
const {
    getPacientes,
    getPacienteById,
    createPaciente,
    updatePaciente,
    deletePaciente
} = require('../controllers/Pacientes');

const { verifyUser } = require('../middleware/AuthUser');

const router = express.Router();

router.get('/pacientes', verifyUser, getPacientes);
router.get('/pacientes/:id', verifyUser, getPacienteById);
router.post('/pacientes', verifyUser, createPaciente);
router.patch('/pacientes/:id', verifyUser, updatePaciente);
router.delete('/pacientes/:id', verifyUser, deletePaciente);

module.exports = router;
