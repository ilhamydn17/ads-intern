const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
)

async function sendOtpWhatsapp(userPhone, otp) {
    return new Promise(async (resolve, reject) => {
        twilio.messages
            .create({
                body: `Kode OTP untuk login adalah ${otp}`,
                from: `whatsapp:+14155238886`,
                to: `whatsapp:${userPhone}`,
            }).then(() => {
                resolve('OTP sent to whatsapp');
            }).catch((err) => {
                console.log(err);
                reject('error while sending whatsapp');
            });
    });

}

module.exports = { sendOtpWhatsapp }
