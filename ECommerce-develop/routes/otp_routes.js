const express = require("express");
const sendOTP  = require("../services/controller");
const router = express.Router();
const db = require('../models');
const { where } = require('sequelize');
const User = db.User;
const OTP = db.OTP;


const opt_mail = async (req, res)=>{
    console.log(req.body);
    try{
        const { emailId } = req.body;
        const user_email = await  User.findOne({where: {emailId: emailId}});
        if(user_email !== null)
        {
            const dbemail = user_email.get({ plain: true });
            await OTP.destroy({where:{emailId: emailId}});
            console.log("Found User: ", dbemail);
            const createdOPT = await sendOTP({email:emailId,subject :"OTP Verification from ScarletElectronics", message:"This is message for OTP verification", duration :1});
            
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', 0);
            const content  = {
                success : true,
                status : 200,
                body: {emailId : user_email.encrypted_emailId},
                redirectUrl : "/users/recover-password?emailId=" + user_email.encrypted_emailId
            };
            //res.status(200).render('otp_validation', {emailId});
            res.status(200).json(content);
            return;
        }
        else
        {
            const content  = {
                success : false,
                status : 400,
                message : "User not found. Please sign up first!!"
            };   
            //res.status(400).render('forgot-password', );
            res.status(400).json(content);
        }
        
    }
    catch(err)
    {
        console.log("Error Caught" + err);
        const content  = {
            success : false,
            status : 400,
            message : "Unexpected Error"
        };   
        //res.status(400).render('forgot-password', );
        //res.status(400).redirect('/users/login');

        res.status(400).json(content);
    }
}

const get_opt_page = async (req, res)=>{
    console.log("Get/ Reset-Password");
    res.send(req.body);
}
router.post('/', opt_mail);


router.get('/', get_opt_page);

module.exports = router;