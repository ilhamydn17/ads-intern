const express = require('express');
const authController = require('../../controller/auth/authController');
const { registerValidator } = require('../../middleware/validator/authValidator/registerValidator');
const { loginValidator } = require('../../middleware/validator/authValidator/loginValidator');

const route = express.Router();

route.post('/register', registerValidator, authController.register);
route.post('/login', loginValidator, authController.login);

module.exports = route;
