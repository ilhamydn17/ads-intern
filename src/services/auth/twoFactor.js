const nodeMailer = require('nodemailer')
const { sendOtpWhatsapp } = require('../../utils/sendOtpWhatsapp')
const { sendOtpEmail } = require('../../utils/sendOtpEmail')

const twoFactor = (channel, otp, userPhone, userEmail) => {
    return new Promise((resolve, reject) => {
        if (channel == 'whatsapp') {
            // auth with whatsapp
            sendOtpWhatsapp(userPhone, otp).then((message) => {
                resolve(message);
            }).catch(err => {
                reject(err);
            })
        } else if (channel == 'email') {
            // auth with email
            sendOtpEmail(userEmail, nodeMailer, otp)
                .then((message) => {
                    resolve(message);
                })
                .catch((error) => {
                    reject(error);
                })
        } else {
            reject('invalid channel');
        }
    });
}

module.exports = { twoFactor }