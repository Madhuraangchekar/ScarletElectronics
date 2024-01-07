const express = require("express");
const router = express.Router();

const mysql = require('mysql2');

const db = require('../models');
const { where } = require('sequelize');
const Catalog = db.Catalog;
const UserUtil = require('../util/userUtil');
const GoogleDriveUtil = require('../util/googleDriveUtil');

const fs = require('fs');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.originalname + '-' + uniqueSuffix);
    }
});
const upload = multer({ storage: storage });

const {google} = require('googleapis');
// const apis = google.getSupportedAPIs();
// const keyfilepath = require('../util/scarletelectronics-aad28cbbe2ee.json');
// const keyfilepath = __dirname + '/../util/scarletelectronics-aad28cbbe2ee.json';
// const scopes = 'https://www.googleapis.com/auth/drive';

const getadd = async (req, res) => {
    console.log('Successfully in /add-item/add');
    if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
        // If not authenticated, send a 401 Unauthorized response
        return res.status(401).send('Authentication failed, working:)');
      }
      const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
      console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
      console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
      userDetails = await UserUtil.check_email(payload.emailId);
      console.log(userDetails.userid);
      const username = userDetails.name;
    
    // if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    //     // If not authenticated, send a 401 Unauthorized response
    //     return res.status(401).send('Authentication failed');
    // }
    // const userDetails = await UserUtil.check_email(req.cookies.emailId);
    // const username = userDetails.name;
    console.log('username : ',  username);
    res.render('additem', { username });
};

// // Category selection route
// router.post('/insert-category', async (req, res) => {
//     const selectedCategory = req.body.category;

//     // Render the appropriate form based on the selected category
//     res.render('additem', { selectedCategory });
// });

// Insert data into the database based on the selected category
const postinsert = async (req, res) => {
    if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
        // If not authenticated, send a 401 Unauthorized response
        return res.status(401).send('Authentication failed, working:)');
      }
    const fileMetadata = {
        name: req.file.originalname,
        parents: ['18JECWflK5JGaS1zvmIjA2UyyNB-6H605'], // Set the ID of the folder where you want to upload files
    };
    const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
    };
    
    const catalogData = req.body;
    catalogData.listing_Status = 'Active'; // Example value
    catalogData.approval_Status = 'Approved'; // Example value
    catalogData.created_on = new Date();
    catalogData.remarks = 'No remarks'; // Example value
    catalogData.updated_on = new Date();
    console.log(catalogData);

    try {
        // // Get the user details using the emailId from the cookie
        // const userDetails = await UserUtil.check_email(req.cookies.emailId);
        const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
        console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
        console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
        userDetails = await UserUtil.check_email(payload.emailId);
        console.log(userDetails.userid);
        const username = userDetails.name;
        
        const userid = userDetails.userId;

        // Add created_by to catalogData
        catalogData.created_by = userid;
        const catalog = await Catalog
            .create(catalogData)
            .then((result) => {
                console.log('result : '+ JSON.stringify(result, null, 2));
                console.log('ItemId : '+ result.itemId);
                // console.log('ItemId : '+ result['itemId']);

                // Create Folder and save in the catalog database
                GoogleDriveUtil.createDrive(result.itemId)
                    .then((result2) => {
                        result.itemImage = result2;
                        result.save()
                            .then((result) => {
                                if (result.itemImage == -1) {console.log("Error in creating Folder.");}
                                else {console.log("Updated FolderID in new catalog table.");}
                            }).catch((err) => {
                                console.log("Error while updating catalog image folder : " + err);
                            });
                        if (result.itemImage != -1) {
                            GoogleDriveUtil.uploadFile(result2, req.file.path, req.file.filename, req.file.mimetype)
                                .then((result3) => {
                                    console.log("File uploaded successfully : " + result3);
                                })
                                .catch((err) => {
                                    console.log("Error encountered in uploadFile() : " + err);
                                });
                        }
                    })
                    .catch((err) => {
                        console.log("Error while createDrive = " + err)
                    });

            }).catch((err) => {
                console.log('Error : '+ err);
            });
        
        res.redirect('/item-listing/listings');  // Redirect to login or any other page
    }
    catch (error) {
        // Handle the error response
        console.error('Error occurred:', error);
        res.status(500).send('Error occurred');
    }
};

router.get("/add", getadd);
router.post('/insert', upload.single('itemImage'), postinsert);

module.exports = router;