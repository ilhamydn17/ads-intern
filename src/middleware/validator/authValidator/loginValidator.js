const { body } = require('express-validator');
const { validating } = require('../indexValidator');

const loginValidator = validating([
    // body('email')
    //     .isEmail().withMessage('Email must be a valid email')
    //     .isString().withMessage('Email must be a string'),
    // body('password')
    //     .notEmpty().withMessage('Password is required')
    //     .isString().withMessage('Password must be a string')
    //     .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]);

module.exports = { loginValidator };