const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
    try {
        const { username, email, address, latitude, longitude } = req.body;
        const newProfileImage = req.file.filename;

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ message: 'unauthorized action' });

        const user = await prisma.user.findFirst({ where: { refresh_token: refreshToken } });
        if (!user) return res.status(400).json({ message: 'unauthorized user' });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                username: username || user.username,
                email: email || user.email,
                address: address || user.address,
                latitude: latitude || user.latitude,
                longitude: longitude || user.longitude,
                profile_image: newProfileImage || user.profile_image
            }
        });

        res.status(200).json({ message: 'success update user profile' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
    }
}

module.exports = updateProfile;