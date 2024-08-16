const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

// User Registration Route
router.post('/register', userController.registerUser);

// User Login Route
router.post('/login', userController.loginUser);

// Route to Fetch Users (Public)
router.get('/users', userController.getUsers);

// Route to Fetch Current User's Data (Protected)
router.get('/me', authenticate, userController.getCurrentUser);

// Route to Update User (Protected)
router.put('/users/:id', authenticate, userController.updateUser);

// Route to Delete User (Protected)
router.delete('/users/:id', authenticate, userController.deleteUser);

module.exports = router;
