const { db } = require('../../models')
const User = db.user
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeOtp = require('node-otp')

const verifyOTP = async (req, res) => {
  const userOTP = req.body.otp

  try {
    // validating user OTP
    const validUser = await User.findOne({ where: { otp: userOTP } })
    if (!validUser) {
      res.status(404).json({ message: 'invalid OTP' })
    }

    // generate jwt token for user
    const userId = validUser.id
    const userEmail = validUser.email
    const userPassword = validUser.password
    const phoneNumber = validUser.phoneNumber

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
    )

    // update refresh token in user table
    await validUser.update({ refreshToken: refreshToken })

    // set cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.status(200).json({ message: `Selamat datang ${validUser.name}`, accessToken })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' })
  }

}

module.exports = verifyOTP



