const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findMany({ select: { username: true, email: true } });
        res.status(200).json({ message: 'success', data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        });
        res.status(201).json({ message: 'success create new user' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}

module.exports = { getUser, createUser };
