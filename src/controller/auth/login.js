const { db } = require('../../models')
const User = db.user
const { twoFactor } = require('../../services/auth/twoFactor')
const { otp } = require('../../utils/otpManager')

const login = async (req, res) => {
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

    // send OTP code to user
    twoFactor(requestChannel, newOtp, existedUser.phoneNumber, existedUser.email)
      .then((message) => {
        console.log(message)
        res.status(200).json({ message})
      })
      .catch((message) => {
        console.log(message)
        res.status(500).json({message})
      })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'internal server error' })
  }
}

// const login = async (req, res) => {
//   const cache = new nodeCache()
//   const { otp } = req.body
//   const userEmail = cache.get(req.userEmail)
//   try {
//     const user = await User.findOne({ where: { email: userEmail } })
//     if (!user) return res.status(404).json({ error: 'invalid credentials!' })
//     // const matchPass = await bcrypt.compare(req.body.password, user.password)
//     // if (!matchPass)
//     //   return res.status(401).json({ error: 'wrong email or password!' })

//     const userId = user.id
//     const userEmail = user.email
//     const userPassword = user.password

//     const accessToken = jwt.sign(
//       { userId, userEmail, userPassword },
//       process.env.ACCESS_TOKEN,
//       { expiresIn: '30s' },
//     )
//     const refreshToken = jwt.sign(
//       { userId, userEmail, userPassword },
//       process.env.REFRESH_TOKEN,
//       { expiresIn: '1m' },
//     )
//     await user.update({ refreshToken: refreshToken })

//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     })
//     res
//       .status(200)
//       .json({ message: `Selamat datang ${user.name}`, accessToken })
//   } catch (error) {
//     console.log(`error: ${error}`)
//     res.status(500).json({ error: 'internal server error' })
//   }
// }

module.exports = login
