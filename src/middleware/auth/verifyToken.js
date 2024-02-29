const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        // get token from authorization header
        const authHeader = req.headers['authorization'];

        // get token
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(400).json({ message: 'token not found' });

        // verify access token
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