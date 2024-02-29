const nodeMailer = require('nodemailer')
const { sendOtpWhatsapp } = require('../../utils/sendOtpWhatsapp')
const { sendOtpEmail } = require('../../utils/sendOtpEmail')

const twoFactor = async (channel, otp, userPhone, userEmail) => {
    return new Promise((resolve, reject) => {
        if (channel == 'whatsapp') {
            // auth with whatsapp
            sendOtpWhatsapp(userPhone, otp).then((message) => {
                console.log(message)
                resolve(message);
            }).catch(err => {
                console.log(err);
                reject('error while sending whatsapp');
            })
        } else if (channel == 'email') {
            // auth with email
            sendOtpEmail(userEmail, nodeMailer, otp)
                .then((message) => {
                    console.log(message)
                    resolve(message);
                })
                .catch((error) => {
                    console.log(error)
                    reject('error while sending email');
                })
        } else {
            return { message: 'not allowed authentication' }
        }
    });
}

module.exports = { twoFactor }