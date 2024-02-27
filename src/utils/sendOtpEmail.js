function sendOtpEmail(userEmail, nodeMailer, otp) {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yudantyodev@gmail.com',
      pass: 'qpytwnbctzpwacpo',
    },
  })

  const mailOption = {
    from: 'yudantyodev@gmail.com',
    to: userEmail,
    subject: 'testing nodemailer',
    text: `Kode OTP anda: ${otp}`,
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err)
        reject({ error: err })
        return
      }
      console.log('email has been sent', info)
      resolve({ message: `OTP sent to ${info.accepted}]` })
    })
  })
}

module.exports = { sendOtpEmail }
