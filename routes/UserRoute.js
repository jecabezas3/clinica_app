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

router.get('/users', getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

module.exports = router;
