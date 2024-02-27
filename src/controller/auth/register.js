const { db } = require('../../models')
const User = db.user
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeCache = require('node-cache')

const register = async (req, res) => {
    const { name, phoneNumber, email, password, passwordConfirmation } = req.body
    if (passwordConfirmation !== password)
        return res
        .status(400)
        .json({ error: 'Password confirmation does not match' })
    const existUser = await User.findOne({ where: { email: email } })
    if (existUser)
        return res.status(400).json({ message: 'email already registered' })
    const genSalt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, genSalt)
    try {
        await User.create({
        name: name,
        phoneNumber: phoneNumber || null,
        email: email,
        password: hashedPass,
        })
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.log(`error: ${error}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = register