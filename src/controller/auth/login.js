const { PrismaClient } = require('@prisma/client');
const { twoFactor } = require('../../services/auth/twoFactor')
const { otp } = require('../../utils/otpManager')

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    // get data from body request
    const { phoneNumber, email, channel } = req.body;

    // find existed user / validation user
    const existedUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            phone_number: phoneNumber
          },
          {
            email: email
          }
        ]
      }
    }).catch(err => { console.log(err); });
    if (!existedUser) {
      res.status(400).json({ message: 'invalid credential' });
      return;
    }

    // ... verification password (optional)

    // find existed OTP 
    let newOtp = otp;
    let existedOtp = await prisma.user.findFirst({ where: { otp_code: newOtp } });
    while (existedOtp) {
      newOtp = otp
      existedOtp = await prisma.user.findFirst({ where: { otp_code: newOtp } });
    }

    // update otp field in user table with new otp
    await prisma.user.update({
      where: {
        id: existedUser.id
      },
      data: {
        otp_code: newOtp
      }
    })

    // send OTP code to user with 2FA (custom service)
    twoFactor(channel, newOtp, existedUser.phone_number, existedUser.email)
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
