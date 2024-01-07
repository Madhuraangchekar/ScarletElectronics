const nodemailer = require("nodemailer");
require('dotenv').config();

// const AUTH_mail= process.env.AUTH_MAIL;
// const AUTH_pwd =  process.env.AUTH_PWD;

const AUTH_mail= process.env.AUTH_MAIL;
const AUTH_pwd =  process.env.AUTH_PWD;


let transport = nodemailer.createTransport({
    host : "smtp-mail.outlook.com",
    auth : {
        user :AUTH_mail,
        pass : AUTH_pwd
    },
});

transport.verify((err, success)=>{

    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Ready for msg");
    }
});

const sendEmail = async(mailOptions) =>{
    try{
        await transport.sendMail(mailOptions);
        console.log("Mail Sent!!!");
        return;
    }catch(error)
    {
       throw error; 
    }
}

module.exports = sendEmail;