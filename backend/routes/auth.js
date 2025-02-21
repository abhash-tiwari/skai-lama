const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const path = require('path');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;