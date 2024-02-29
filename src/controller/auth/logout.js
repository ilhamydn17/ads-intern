const { PrismaClient } = require('@prisma/client');
const refreshToken = require('./refreshToken');

const prisma = new PrismaClient();

const logout = async (req, res) => {
  try {
    // get information refreshToken from cookie
    const refreshTokenOnCookie = req.cookies.refreshToken
    if (!refreshTokenOnCookie) return res.status(204)

    // find user by refreshToken
    const loggedUser = await prisma.user.findFirst({ where: { refresh_token: refreshTokenOnCookie } });
    if (!loggedUser) return res.status(204)

    // update refreshToken and otp user become null
    await prisma.user.update({
      where: {
        id: loggedUser.id
      },
      data: {
        refresh_token: null,
        otp_code: null
      }
    });

    // clear cookie for refreshToken
    res.clearCookie('refreshToken')

    res.status(204).json({ message: 'Logout success' })
  } catch (error) {
    console.log(`error: ${error}`)
    res.status(500).json('message : internal server error')
  }
}

module.exports = logout