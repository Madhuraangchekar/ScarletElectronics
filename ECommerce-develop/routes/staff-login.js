const express = require("express");
const router = express.Router();
const mysql = require('mysql2');
const db = require('../models');
const { where } = require('sequelize');
const UserUtil = require('../util/userUtil');
const { encrypt, decrypt } = require("../util/encryptionUtil");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const axios = require("axios"); // Required for reCAPTCHA verification

let refreshTokens = []

const User = db.User;
const Staff = db.Staff;

// GET route to render the login page
const getstafflogin = async (req, res) => {
  res.render("staffloginPage");
};

// POST route to handle loging
const poststafflogin = async (req, res) => {
  const { emailId, password } = req.body;

  const recaptchaResponse = req.body["g-recaptcha-response"];
  if (!recaptchaResponse) {
	  return res
		  .status(400)
		  .json({ success: false, message: "Please complete the CAPTCHA." });
  }

  try {
	const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=6Lffbu8oAAAAAHnr8NxZtRoP9-f7367MM9S_MjtN&response=${recaptchaResponse}`;
	const verificationResponse = await axios.post(verificationURL);

	if (!verificationResponse.data.success) {
		return res.status(400).json({
			success: false,
			message: "CAPTCHA verification Failed/ Expired. Reload and Try again",
		});
	}

    // Check if the emailId exists in the users table
    const user = await User.findOne({ where: { emailId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "You do not exist in our system.",
      });
    }

    // Check if the userId exists in the staff table
    const staffUser = await Staff.findOne({ where: { userId: user.userId } });

    if (!staffUser) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to log in as a staff member.",
      });
    }

    // Check if the provided password matches the hashed password in the database
	const decryptedPassword = decrypt(user.encrypted_password);

	if (password !== decryptedPassword) {
		return res.status(401).json({
			success: false,
			message: "You have entered an invalid password, " + user.name,
		});
	}
    // JWT TOKEN IMPLEMENTATION
    const tokenPackage = { userId: user.userid, emailId: user.emailId };
    const accessToken = UserUtil.generateAccessToken(tokenPackage);
    const refreshToken = jwt.sign(tokenPackage, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: false,
    });

    const object = UserUtil.retrieveTokenPayload(accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", object.userId);

    // Send a JSON response indicating success and possibly a redirect URL.
    return res.status(200).json({
      success: true,
      body: user,
      message: "Welcome " + user.name + ", Login successful",
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(401).json({
      success: false,
      message: "Login Failed. Please use valid credentials.",
    });
  }
};

router.get("/login", getstafflogin);
router.post("/login", poststafflogin);
module.exports = router;
