const db = require('../models');
const EndUser = db.EndUsers;
const User = db.User;
const jwt = require('jsonwebtoken');

async function check_email(emailId) {
    try {
        //parse emailId from request
        //parse query parameters
        console.log("check_email: ");
        // console.log("emailId: ", emailId);
        // const emailId = req.body.emailId;

        if (emailId === undefined) {
            return false;
        }
        const user_email = await User.findOne({ where: { 'emailId': emailId } });
        if (user_email !== null) {
            const dbemail = user_email.get({ plain: true });

            //get details of user from db
            const user_details = await User.findOne({ where: { emailId: emailId } });
            return user_details;
        }
        else {
            console.log("User not found");
            return false;
        }
    }
    catch (err) {
        console.log("Error Caught" + err);
        return false;
    }
}

function authenticateToken(token) {
    console.log('authenticateToken');
    //console.log('token::', token);

    if (token == null) return false;

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return true;
    } catch (error) {
        console.log('JWT verification error:', error);
        return false;
    }
}

function retrieveTokenPayload(token) {
    console.log('retrieveTokenPayload');
    //console.log('token::', token);

    if (token == null) return false;

    try {
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        //console.log(payload)
        return payload;
    } catch (error) {
        console.log('JWT verification error:', error);
        return null;
    }
}

async function authent(req, res) {
    console.log("authent");
    if (!authenticateToken(req.cookies.accessToken)) {
        res.status(401).send('Authentication failed');
        return [false, null];
    }
    const payload = retrieveTokenPayload(req.cookies.accessToken);
    // //THIS IS HOW YOU CAN ACCESS THE PAYLOAD OBJECT
    // console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    const authentication = await check_email(payload.emailId);

    console.log("authentication: ", authentication);

    if (!authentication) {
        //return invalid authorization token
        res.status(401);
        console.log("Invalid Authorization Token");
        res.render('loginPage');
        return [false, null];
    }

    //console.log("user id: ", authentication.dataValues.userid);
    //get cart details from db

    //return authentication_status and user id
    return [true, authentication.dataValues.userid];
}

function generateAccessToken(tokenPackage) {
    return jwt.sign(tokenPackage, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
}
module.exports = { check_email, authenticateToken, generateAccessToken, authent, retrieveTokenPayload };