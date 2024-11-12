const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'muzamil.6aug24webgpt@gmail.com',  
        pass: 'cjcy cync rjsh srix' 
    }
});



function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();  
}
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
  
    const otp = generateOTP();
   

    const mailOptions = {
        from: 'muzamil.6aug24webgpt@gmail.com',
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        res.status(500).json({ error: 'Error sending OTP' });
    }
});

module.exports = generateOTP;