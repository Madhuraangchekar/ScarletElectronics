const express = require("express");
const sendOTP  = require("../services/controller");
const router = express.Router();
const db = require('../models');
const { where } = require('sequelize');
const { encrypt, decrypt } = require('../util/encryptionUtil'); // Assuming the encryptionUtil.js file is in the same directory
const OTP = db.OTP;
const User = db.User;

const get_update_password = async(req, res) =>{
    res.render('recover-password');
    return;
};

const update_password = async(req, res) =>{
    try{
        console.log(req.body);
        const {enemailId , password1, password2} = req.body;
        const user_email = await  User.findOne({where: {encrypted_emailId: enemailId}});
        const emailId = user_email.emailId;
        const user = await User.findOne({where:{emailId:emailId}});

        if(user)
        {
            user.password = password1;
            user.save();
            console.log("Password Changed Sucessfully");
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', 0);
            const content  = {
                success : true,
                status : 200,
                body: {alert : "Password Changed Successfully"},
                redirectUrl : "/users/login"
            };
            
            res.status(200).json(content);
            return;
        }
        else
        {
            console.log("User not found");
            const content  = {
                success : false,
                status : 400,
                message : "User not found. Please sign up first!!"
            };
            res.status(400).json(content);
            return;
        }
    }
    catch(err)
    {
        console.log("Error Occured " + err);
        const content  = {
            success : false,
            status : 400,
            message : "UnExpected Errror!!"
        };
        res.status(400).json(content);
        return;
    }
}

const verfiy_otp = async (req, res)=>{
    try{
        console.log(req.body);
        const { OTP_val, enemailId}  = req.body;
        
        const user_email = await  User.findOne({where: {encrypted_emailId: enemailId}});
        const emailId = user_email.emailId;
        const dbOTP = await OTP.findOne({where:{emailId:emailId}});
        console.log("Details from DB " + dbOTP.emailId + " " + dbOTP.otp + " " +  OTP_val);
        if(dbOTP)
        {
            if(dbOTP.otp === OTP_val && dbOTP.expires_on >= Date.now())
            {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
                const content = {
                    success : true,
                    status : 200,
                    body : {emailId : enemailId},
                    redirectUrl : "/users/recover-password/update?emailId=" + enemailId
                }
                //res.status(200).render("recover-password", {emailId : emailId});
                res.status(200).json(content);
                return;
            }
            else if(dbOTP.expires_on < Date.now())
            {
                const content = {
                    success:false,
                    status:400,
                    message : "Your OTP has been expired Please generate again!!"
                }
                //res.status(400).render("forgot-password", {message : "Your OTP has been expired Please generate again!!"});
                res.status(400).json(content);
                return;
            }
            else
            {
                const content = {
                    success:false,
                    status:400,
                    message : "You entered wrong OTP. Try again!!"
                }
                //res.status(400).render("forgot-password", {message : "Your OTP has been expired Please generate again!!"});
                res.status(400).json(content);
                return;
                // res.status(400).render("otp_validation", {message : "You entered wrong OTP. Try again!!" , emailId : emailId});
                // return;
            }
        }
        else
        {
            const content = {
                success:false,
                status:404,
                message : "You do not exists in our System. Please Sign up first!!"
            }
            //res.status(400).render("forgot-password", {message : "Your OTP has been expired Please generate again!!"});
            res.status(400).json(content);
            return;
            
            //res.send(404).render("otp_validation", {message : "You do not exists in our System. Please Sign up first!!" });
        }

    }
    catch(err)
    {
        console.log("Here Error Caught" + err);
        const content = {
            success:false,
            status:404,
            message : "UnExcepted Error!!!"
        }
        //res.status(400).render("forgot-password", {message : "Your OTP has been expired Please generate again!!"});
        res.status(400).json(content);
        return;
    }
};
const get_recover_pass_page = async (req, res) => {
    // Set cache-control headers before rendering the page
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);
    console.log("/GET RECOVER PASSWORD");

    // Render the page and include the script to modify the history state
    res.render("otp_validation", {
        replaceHistoryScript: '<script>window.history.replaceState({}, "", "/users/recover-password");</script>'
    });

    return;
}

router.get('/update', get_update_password);
router.post('/update', update_password);
router.post('/', verfiy_otp);
router.get('/', get_recover_pass_page);


module.exports = router;