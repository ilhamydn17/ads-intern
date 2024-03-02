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

const getUserProfile = async (req, res) => {
    try {
        const userProfile = await prisma.user.findFirst({
            where: { refresh_token: req.cookies.refreshToken },
            select: {
                username: true,
                email: true,
                address: true,
                latitude: true,
                longitude: true
            }
        });
        console.log(userProfile);
        res.status(200).json({ message: 'success', data: userProfile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' });
    }
}

const storeImage = async (req, res) => {
    try {
        console.log(req.file);
        const fileName = req.file.filename;
        await prisma.image.create({
            data: {
                file_name: fileName
            }
        });

        res.status(200).json({ message: 'success', data: fileName });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
    }
}

module.exports = { getListUser, getUserProfile, storeImage };