const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient();

const verifyOTP = async (req, res) => {
  const userOTP = req.body.otp;
  if (!userOTP) {
    res.status(404).json({ message: 'invalid OTP' });
    return;
  }

  try {
    // validating user OTP
    // const validUser = await User.findOne({ where: { otp: userOTP } })
    const validUser = await prisma.user.findFirst({ where: { otp_code: userOTP } });
    if (!validUser) {
      res.status(404).json({ message: 'invalid OTP' });
      return;
    }

    // generate data information from valid user
    const userId = validUser.id;
    const userEmail = validUser.email;
    const userPassword = validUser.password;
    const phoneNumber = validUser.phone_number;

    // generate access token with jwt
    const accessToken = jwt.sign(
      { userId, userEmail, userPassword, phoneNumber },
      process.env.ACCESS_TOKEN,
      { expiresIn: '30s' },
    )

    // generate refresh token with jwt
    const refreshToken = jwt.sign(
      { userId, userEmail, userPassword },
      process.env.REFRESH_TOKEN,
      { expiresIn: '1m' },
    );

    // update refresh token in user table
    await prisma.user.update({
      where: {
        id: validUser.id
      },
      data: {
        refresh_token: refreshToken
      }
    });

    // set cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.status(200).json({ message: `Selamat datang ${validUser.username}`, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
}

module.exports = verifyOTP



