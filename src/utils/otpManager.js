const otpGenerator = require('otp-generator')

const otp = otpGenerator.generate(6, { upperCaseAlphabets: true, lowerCaseAlphabets: false, specialChars: false })

module.exports = { otp }
