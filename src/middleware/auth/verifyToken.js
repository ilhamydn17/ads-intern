const { db } = require('../../models');
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(400).json({ message: 'token not found' });
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) return res.status(400).json({ message: 'token doesn\'t valid' });
            req.email = decoded.email;
            next();
        });
    } catch (error) {
        console.log(`${error}`);
        res.status(500).json({ message: 'internal server error' });
    }
}

module.exports = { verifyToken };