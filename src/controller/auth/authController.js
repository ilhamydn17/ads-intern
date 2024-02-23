const { db } = require('../../models');
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => { 
    const { name, email, password, passwordConfirmation } = req.body;
    if (passwordConfirmation !== password) return res.status(400).json({ error: "Password confirmation does not match" });
    const genSalt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, genSalt);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashedPass,
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }   
}

const login = async (req, res) => { 
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ error: "wrong email or password!" });
        const matchPass = await bcrypt.compare(req.body.password, user.password);
        if (!matchPass) return res.status(401).json({ error: "wrong email or password!" });

        const userId = user.id;
        const userEmail = user.email;
        const userPassword = user.password;
        
        const accessToken = jwt.sign({ userId, userEmail, userPassword }, process.env.ACCESS_TOKEN, { expiresIn: '30s' });
        const refreshToken = jwt.sign({ userId, userEmail, userPassword }, process.env.REFRESH_TOKEN, { expiresIn: '1m' });
        await user.update({ refreshToken: refreshToken });
        
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: `Selamat datang ${user.name}`, accessToken });
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).json({error: 'internal server error'});
    }
}

const logout = async (req, res) => { 
    try {
        const refreshTokenOnCookie = req.cookies.refreshToken;
        if (!refreshTokenOnCookie) return res.status(204);
        const loggedUser = await User.findOne({ where: { refreshToken: refreshTokenOnCookie } });
        if (!loggedUser) return res.status(204);
        await loggedUser.update({ refreshToken: null });
        res.clearCookie('refreshToken');
        res.status(204).json({ message: 'Logout success' });
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).json('message : internal server error');
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ message: 'refresh token not found' });
        const user = await User.findOne({ where: { refreshToken: refreshToken } });
        if (!user) return res.status(400).json({ message: 'user not found' });
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err) return res.status(400).json({ message: 'refresh token not valid' });
            const userId = user.id;
            const userName = user.name;
            const userEmail = user.email;
            const newAccessToken = jwt.sign({ userId, userName, userEmail }, process.env.ACCESS_TOKEN, { expiresIn: '1m' });
            res.status(200).json({ message: 'success refresh token', accessToken: newAccessToken });
        });
    } catch (error) {
        console.log(`${error}`);
        res.status(500).json({ message: 'internal server error' });
    }
    
}

module.exports = { register, login, logout, refreshToken };