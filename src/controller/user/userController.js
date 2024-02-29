const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getListUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany({ select: { username: true, email: true, phone_number: true } });
        return res.status(200).json({ message: 'success', data: users });
    } catch (error) {
        console.log(`${error}`);
        res.status(500).json({ error: 'internal server error' });
    }
}

module.exports = { getListUser };