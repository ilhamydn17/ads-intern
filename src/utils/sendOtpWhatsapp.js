const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
)

async function sendOtpWhatsapp(userPhone, otp) {
    return await twilio.messages
        .create({
            body: `Kode OTP untuk login adalah ${otp}`,
            from: `whatsapp:+14155238886`,
            to: `whatsapp:${userPhone}`,
        });
}

module.exports = { sendOtpWhatsapp }
