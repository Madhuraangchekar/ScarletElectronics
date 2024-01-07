const generateOTP = require("./generateOPT");
const sendEmail = require("./send_email");
const db = require('../models');
const { where } = require('sequelize');
const User = db.User;
const OTP = db.OTP;

const sendOTP = async({email, subject, message, duration}) => {
    try{
        
        //remove old OTP with given email
        
        //Generate new OTP for the email
        const new_OTP = await generateOTP();
        const AUTH_mail= "scarletelectronics@hotmail.com";
        //Send an email 
        const mailOptions = {
            from: AUTH_mail,
            to: email,
            subject,
            html:`<p style="font-size: 18px; font-weight: bold; color: #333;">${message}</p>
            <p style="font-size: 24px;font-weight: bold; color: #FA8733;">${new_OTP}</p>
            <p style="font-size: 14px; color: #666;">The duration of OTP is ${duration} Hour(s)</p>
            `,
        };
        await sendEmail(mailOptions);

        await OTP.create({
            emailId: email,
            otp: new_OTP,
            created_on : Date.now(),
            expires_on: Date.now() + 3600000* duration,
        });

        return new_OTP;
    }
    catch(err)
    {
        throw err;
    }
}

module.exports = sendOTP;