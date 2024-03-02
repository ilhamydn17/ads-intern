const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

module.exports = getUserProfile;