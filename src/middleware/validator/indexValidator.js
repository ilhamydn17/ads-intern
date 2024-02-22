const { validationResult, body } = require('express-validator');

const validating = (validation) => { 
    return async (req, res, next) => {
        await Promise.all(validation.map((validator) => validator.run(req)));
        const error = validationResult(req);
        if (!error.isEmpty()) { 
            return res.status(400).json({ errors: error.array().map(err => err.msg) });
        }
        next();
    }
}

module.exports = { validating }