const { db } = require('../../models')
const User = db.user
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    // get data from body request
    const { name, phoneNumber, email, password, passwordConfirmation } = req.body

    // validation password confirmation
    if (passwordConfirmation !== password)
        return res
        .status(400)
            .json({ error: 'Password confirmation does not match' })
    
    // find existed user
    const existUser = await User.findOne({ where: { email: email } })
    if (existUser)
        return res.status(400).json({ message: 'email already registered' })

    // hashing password
    const genSalt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, genSalt)

    // create new user
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