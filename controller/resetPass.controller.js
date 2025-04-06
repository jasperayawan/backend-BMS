const nodemailer = require('nodemailer')
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanfranciscomanagementsystem@gmail.com',
        pass: process.env.GOOGLE_APP_PASS
    }
  });
  
  
 const resetPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
        // Step 1: Find the user by email
        const query = new Parse.Query(Parse.User);
        query.equalTo('email', email);
        const user = await query.first({ useMasterKey: true });
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        // Step 2: Generate a reset token and expiration date
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
  
        user.set('resetToken', resetToken);
        user.set('resetTokenExpiration', resetTokenExpiration);
        await user.save(null, { useMasterKey: true });
  
        // Step 3: Send reset password email
        const resetLink = `https://barangay-management-system.netlify.app/reset-password?token=${resetToken}`;
        // const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  
        const mailOptions = {
            from: '"Barangay sytem" <barangaysystem@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset email sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
  
  
const resetPassConfirm = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
        // Step 1: Find user by reset token and ensure it's not expired
        const query = new Parse.Query(Parse.User);
        query.equalTo('resetToken', token);
        query.greaterThan('resetTokenExpiration', Date.now());
        const user = await query.first({ useMasterKey: true });
  
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
  
        // Step 2: Update user's password and clear reset token
        user.setPassword(newPassword);
        user.unset('resetToken');
        user.unset('resetTokenExpiration');
        await user.save(null, { useMasterKey: true });
  
        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

  module.exports = {
    resetPassword,
    resetPassConfirm
  }
  