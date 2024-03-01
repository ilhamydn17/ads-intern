const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
)

function sendOtpWhatsapp(userPhone, otp) {
    return new Promise((resolve, reject) => {
        twilio.messages
            .create({
                body: `Kode OTP untuk login adalah ${otp}`,
                from: `whatsapp:+14155238886`,
                to: `whatsapp:${userPhone}`,
            }).then(() => {
                resolve('otp sent successfully');
            }).catch(err => {
                console.log(err);
                reject(err);
            })
    });

}

module.exports = { sendOtpWhatsapp }
