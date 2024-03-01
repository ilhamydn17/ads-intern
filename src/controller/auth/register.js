const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const register = async (req, res) => {
    // get data from body request
    const { username, phoneNumber, email, password, passwordConfirmation } = req.body

    // validation password confirmation
    if (passwordConfirmation !== password) return res.status(400).json({ error: 'Password confirmation does not match' });

    // find existed user
    const existUser = await prisma.user.findFirst({ where: { OR: [{ email }, { phone_number: phoneNumber }] } });
    if (existUser) return res.status(400).json({ message: 'data already registered' })

    // hashing password
    const genSalt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, genSalt)

    // create new user
    try {
        await prisma.user.create({
            data: {
                username,
                email,
                phone_number: phoneNumber,
                password: hashedPass
            }
        });
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.log(`error: ${error}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = register