const { db } = require('../../models');
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => { 
    const { name, email, password, passwordConfirmation, refreshToken } = req.body;
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
        
        const accessToken = jwt.sign({ userId, userEmail, userPassword }, process.env.ACCESS_TOKEN, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ userId, userEmail, userPassword }, process.env.REFRESH_TOKEN, { expiresIn: '1d' });
        await user.update({ refreshToken: refreshToken });
        
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: `Selamat datang ${user.name}`, accessToken });
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).json({error: 'internal server error'});
    }
}

module.exports = { register, login };