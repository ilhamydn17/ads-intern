const nodeMailer = require('nodemailer')
const { sendOtpWhatsapp } = require('../../utils/sendOtpWhatsapp')
const { sendOtpEmail } = require('../../utils/sendOtpEmail')

const twoFactor = async (channel, otp, userPhone, userEmail) => {
    if (channel == 'whatsapp') {
        // auth with whatsapp
        sendOtpWhatsapp(userPhone, otp).then(() => {
            console.log('whatsapp has been sent')
            return "OTP sent to whatsapp"
        }).catch(err => {
            console.log(err);
            return "error while sending whatsapp"
        })
    } else if (channel == 'email') {
        // auth with email
        sendOtpEmail(userEmail, nodeMailer, otp)
            .then(() => {
                console.log('email has been sent')
                return "OTP sent to email"
            })
            .catch((error) => {
                console.log(error)
                return "error while sending email"
            })
    } else {
        return { message: 'not allowed authentication' }
    }
}

module.exports = { twoFactor }