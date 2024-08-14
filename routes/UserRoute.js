const express = require('express');
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/Users');

const { verifyUser, adminOnly } = require('../middleware/AuthUser');

const router = express.Router();

router.get('/users', getUsers, verifyUser);
router.get('/users/:id', getUserById, verifyUser);
router.post('/users', createUser, verifyUser);
router.patch('/users/:id', updateUser, verifyUser);
router.delete('/users/:id', deleteUser, verifyUser);

module.exports = router;
