const { db } = require('../../models')
const User = db.user
const { twoFactor } = require('../../services/auth/twoFactor')
const { otp } = require('../../utils/otpManager')

const login = async (req, res) => {
  // get data from body request
  const userPhone = req.body.phoneNumber
  const userEmail = req.body.email
  const requestChannel = req.body.channel

  // find existed user / validation user
  const existedUser = await User.findOne({ where: [{ phoneNumber: userPhone }, { email: userEmail },] });
  if (!existedUser) { return res.status(400).json({ message: 'invalid credential' }) }

  // ... verification password (optional)

  try {
    // find existed OTP 
    let newOtp = otp
    let existedOtp = await User.findOne({ where: { otp: newOtp } })
    while (existedOtp) {
      newOtp = otp
      existedOtp = await User.findOne({ where: { otp: newOtp } })
    }

    // update otp field in user table with new otp
    await existedUser.update({ otp: newOtp })

    // send OTP code to user with 2FA (custom service)
    twoFactor(requestChannel, newOtp, existedUser.phoneNumber, existedUser.email)
      .then((message) => {
        console.log(message)
        res.status(200).json({ message })
      })
      .catch((message) => {
        console.log(message)
        res.status(500).json({ message })
      })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'internal server error' })
  }
}

module.exports = login
