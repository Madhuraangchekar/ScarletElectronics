const express = require("express");
const router = express.Router();

const db = require('../models');
const { where } = require('sequelize');
const EndUserRequest = db.EndUserRequest;
const ItemListing = db.ItemListing; //newcode
const Messages = db.Messages;
const User = db.User;
const EndUser = db.EndUsers;
const Catalog = db.Catalog;

const UserUtil = require('../util/userUtil');

// router.get("/", async (req, res) => {
// 	if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
// 		// If not authenticated, send a 401 Unauthorized response
// 		return res.status(401).send('Authentication failed');
// 	}
// 	const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
// 	console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
// 	console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
// 	if (payload.emailId) {
// 		const emailId = payload.emailId;
// 		const userDetails = await db.User.findOne({ where: { emailId } });
// 		const userId = userDetails.dataValues.userid;
// 		const endUserDetails = await db.EndUsers.findOne({ where: { userId } });
// 		const user = {
// 			name: userDetails.name,
// 			emailId: userDetails.emailId,
// 		};

// 		return res.status(200).json({
// 			success: true,
// 			status: 200,
// 			body: user
// 		});

// 		// res.render("userProfile", { user: user });
// 	} else {

// 		return res.status(401).json({
// 			success: false,
// 			status: 401,
// 			message: "Invalid cookie",
// 			redirectUrl: "/users/login"
// 		});

// 		// res.redirect("login");
// 	}
// });

const getAllrequests = async (req, res) => {
  console.log("token ", req.cookies.accessToken);
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

  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // //console.log(userDetails);
  // const username = userDetails.name;
  const custRepId = userDetails.userid;
  console.log("Username is " + username);
  
  res.render('all_requests', {username});
  
};

const postClaimedrequests = async (req, res) => {
  console.log("token ", req.cookies.accessToken);
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }
  const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
  console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
  console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
  userDetails = await UserUtil.check_email(payload.emailId);
  console.log(userDetails.userid);

  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // console.log(userDetails.userid);
  const username = userDetails.name;

  console.log('Working');
  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // //console.log(userDetails);
  // const username = userDetails.name;
  const custRepId = userDetails.userid;
  console.log("Username is " + username);

  EndUserRequest.findAll({
      where: {
          customer_rep: custRepId
          
      },
      include: [User],
    }).then((requests) => {
      const serializedRequests = requests.map((request) => {
        return {
          requestId: request.requestId,
          userName: request.User.name,
          userEmail: request.User.emailId,
          userId: request.userId,
          listingId: request.listingId,
          updateDescription: request.update_description,
          createdOn: request.created_on,
          currentStatus: request.current_status,
          customerRep: username,
          updatedOn: request.updated_on
        };
      });
  
      // Send the serialized data as a response
      //res.render('customer_rep_dasboard', {serializedRequests, username});
      return res.status(200).json({
        success: true,
        message: "Requests fetched from database",
        serializedRequests: serializedRequests
        
      });
      // res.render('seller_listing', {serializedListings})
    }).catch((error) => {
      console.error('Error retrieving data:', error);
      res.status(500).send('Internal server error');
    });

};


const getshowallrequest = async (req, res) => {
  console.log('Button Working');

  //new jwt implementation
  console.log("token ", req.cookies.accessToken);
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }
  const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
  console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
  console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
  userDetails = await UserUtil.check_email(payload.emailId);
  console.log(userDetails.userid);

  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // console.log(userDetails.userid);
  const username = userDetails.name;

  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // console.log(userDetails.userid);
  // const username = userDetails.name;

  EndUserRequest.findAll({
    include: [User]
  
  }).then((requests) => {
    const serializedRequests = requests.map((request) => {
      return {
        requestId: request.requestId,
        userId: request.userId,
        userName: request.User.name,
        userEmail: request.User.emailId,
        listingId: request.listingId,
        updateDescription: request.update_description,
        createdOn: request.created_on,
        currentStatus: request.current_status,
        customerRep: request.customer_rep,
        updatedOn: request.updated_on
      };
    });
    //console.log("~!!!!!!!!!!!   print here    !!!!", requests);
  //const all_requests = EndUserRequest.findAll().then(function(serializedRequests){
      //const row = User.findOne()
      //res.render('all_requests', {serializedRequests, username});
        return res.status(200).json({
        success: true,
        message: "Request assigned to you",
        serializedRequests: serializedRequests,
        // username: username,
        // cr_name: username,
        
      });
      
      
    }).catch(function(err){
      console.log('Oops! something went wrong, : ', err);
    });
  
};
router.post("/show-all-request", getshowallrequest);


const postClaimrequest = async (req, res) => {
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }
    
    receivedRequestId = req.body.reqID;
    console.log("The requestID is : ", receivedRequestId);
    //console.log("!!!!!!!!!!!!!hsjabfkaskhf: ", receivedRequestId);

      //new jwt implementation
  console.log("token ", req.cookies.accessToken);

  const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
  console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
  console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
  userDetails = await UserUtil.check_email(payload.emailId);
  console.log(userDetails.userid);

  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // console.log(userDetails.userid);
  const username = userDetails.name;
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // //console.log(userDetails.userid);
    // const username = userDetails.name;
    Messages.update({customer_rep : userDetails.userid},{where: {requestId: receivedRequestId}});

    EndUserRequest.findOne({where: {requestId: receivedRequestId},
      
      
    }).then((table) => {
      table.customer_rep = userDetails.userid;
      
      return table.save();
    }).then(() => {
       
      // Send the serialized data as a response
      //res.redirect('/customer_representative/show-all-request');
      return res.status(200).json({
        success: true,
        message: "Request assigned to you",
        
        redirectUrl: "/customer_representative/show-all-request"
      });
      // res.render('listings', { serializedListings, username });
      
    }).catch((error) => {
      console.error('Error retrieving data:', error);
      res.status(500).send('Internal server error');
    });
    // EndUserRequest.update({customerRep: userDetails.userid},{where: {requestId: receivedRequestId}}).then(() => {
       
    //   // Send the serialized data as a response
    //   res.redirect('/customer_representative/show-all-request');
      
    // }).catch((error) => {
    //   console.error('Error retrieving data:', error);
    //   res.status(500).send('Internal server error');
    // });
    
};

const updateStatus = async (req, res) => {
  console.log("token ", req.cookies.accessToken);
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }

  receivedRequestId = req.body.reqID;
  console.log("The requestID is : ", receivedRequestId);
  //console.log("!!!!!!!!!!!!!hsjabfkaskhf: ", receivedRequestId);
  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // //console.log(userDetails.userid);
  // const username = userDetails.name;

    //new jwt implementation

    const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
  
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    const username = userDetails.name;

  EndUserRequest.findOne({where: {requestId: receivedRequestId}}).then((table) => {
    table.current_status = req.body.status;
    table.updated_on = new Date();
    
    return table.save();
  }).then(() => {
     
    // Send the serialized data as a response
    //res.redirect('/customer_representative/show-all-request');
    return res.status(200).json({
      success: true,
      message: "Request status Updated",
      
      redirectUrl: "/customer_representative/show-all-request"
    });
    // res.render('listings', { serializedListings, username });
    
  }).catch((error) => {
    console.error('Error retrieving data:', error);
    res.status(500).send('Internal server error');
  });
};
router.post("/update-request-status", updateStatus);


//Renders threads page
const getthread = async (req, res) => {
    //new jwt implementation
    console.log("token ", req.cookies.accessToken);
    if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
      // If not authenticated, send a 401 Unauthorized response
      return res.status(401).send('Authentication failed, working:)');
    }
    const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
  
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    const username = userDetails.name;
  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  //   //console.log(userDetails.userid);
    
  // const username = userDetails.name;
  const reqId = req.query.reqId;
  //console.log(req);
  console.log(reqId);

  res.render("threads",{ username, reqId });
};

//Function to get messeges 
const getAllMesseges = async (req, res) => {
    //new jwt implementation
    console.log("token ", req.cookies.accessToken);
    if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
      // If not authenticated, send a 401 Unauthorized response
      return res.status(401).send('Authentication failed, working:)');
    }
    const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
  
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    const username = userDetails.name;

  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  // console.log(userDetails.userid);
  // const username = userDetails.name;

  const reqId = req.body.reqId;
  console.log("RequestId received = ", reqId);

  Messages.findAll({
    where: {
      requestId: reqId
  }
  
  }).then((messages) => {
    const serializedMessages = messages.map((getMessage) => {
      return {
        messageId: getMessage.messageId,
        requestId: getMessage.requestId,
        userId: getMessage.userId,
        customerRep: getMessage.customer_rep,
        customerRepName: username,
        listingId: getMessage.listingId,
        updateDescription: getMessage.update_description,
        createdOn: getMessage.created_on,
        createdBy: getMessage.created_by
      };
    });
  //const all_requests = EndUserRequest.findAll().then(function(serializedRequests){
      
      //res.render('all_requests', {serializedRequests, username});
        return res.status(200).json({
        success: true,
        message: "Request assigned to you",
        serializedMessages: serializedMessages
        
      });
      
      
    }).catch(function(err){
      console.log('Oops! something went wrong, : ', err);
    });
  



};



const getMessegeToBeInserted = async (req, res) => {
    //new jwt implementation
    console.log("token ", req.cookies.accessToken);
    if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
      // If not authenticated, send a 401 Unauthorized response
      return res.status(401).send('Authentication failed, working:)');
    }
    const payload = await UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
  
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    const username = userDetails.name;

  // userDetails = await UserUtil.check_email(req.cookies.emailId);
  //const reqId = req.body.reqId;
  console.log("!!!!!!!!!    Reqest received   !!!!!!!");
  const Messages = db.Messages;
  //console.log(req);
  const reqId=req.body.reqId;
  const row = await Messages.findOne({where: {requestId: reqId}});
  //console.log("********   Row data *******", row.userId);
  EndUserRequest.update({updated_on: new Date()},{where: {requestId: reqId}});
  Messages.create({
    requestId: reqId,
    userId: row.userId,
    customer_rep: userDetails.userid,
    update_description: req.body.updateDescription,
    created_on: new Date(),
    created_by: "cr"
   });

   return res.status(200).json({
    success: true,
    message: "Message Inserted",
    reqId:reqId
  });
  
  //Fetch remaining data from db

  //console.log(req);
  

};

//newcode
const getReplistings =  async (req, res) => {
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }

  try {
    const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
  
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    const username = userDetails.name;
    const rep_listings1 = await ItemListing.findAll(
      {
        include: [{
          model: EndUser,
          include: [{
            model: User,
            attributes: ['name'], // Only fetch the username
          }]
        },{
          model: Catalog
        }]

      }
      ).then((messages) => {
      const rep_listings = messages.map((getListings) => {
        return {
          listingId: getListings.listingId,
          itemId: getListings.itemId,
          itemName: getListings.Catalog.name,
          sellerId: getListings.sellerId,
          username: getListings.EndUser.User.name,
          price: getListings.price,
          created_on: getListings.created_on,
          created_by: getListings.created_by,
          remarks: getListings.remarks,
          updated_by: getListings.updated_by,
          updated_on: getListings.updated_on,
          quantity: getListings.quantity
        };
      });
    res.render('rep_listings', { rep_listings, username })
    });


  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Route to handle deletion of a listing
const postdeletereplisting = async (req, res) => {
  console.log("token ", req.cookies.accessToken);
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }

  const listingId = req.params.listingId;
  try {
    const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
  
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    const username = userDetails.name;
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    // const username = userDetails.name;
    await ItemListing.destroy({ where: { listingId } });
    res.redirect('/customer_representative/rep_listings');
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Route to render the modification form
const getmodifyreplisting = async (req, res) => {
  console.log("token ", req.cookies.accessToken);
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }

  const listingId = req.params.listingId;
  try {
    const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    const username = userDetails.name;
    const listing = await ItemListing.findByPk(listingId);
    res.render('modify_listing', { listing, username });
  } catch (error) {
    console.error('Error fetching listing for modification:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Route to handle the form submission for modification
const postmodifyreplisting = async (req, res) => {
  console.log("token ", req.cookies.accessToken);
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    // If not authenticated, send a 401 Unauthorized response
    return res.status(401).send('Authentication failed, working:)');
  }
  const listingId = req.params.listingId;
  try {
    const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    userDetails = await UserUtil.check_email(payload.emailId);
    console.log(userDetails.userid);
    // userDetails = await UserUtil.check_email(req.cookies.emailId);
    // console.log(userDetails.userid);
    // const username = userDetails.name;
    // Update the ItemListing with the new values from the form
    await ItemListing.update(req.body, { where: { listingId } });

    res.redirect('/customer_representative/rep_listings');
  } catch (error) {
    console.error('Error modifying listing:', error);
    res.status(500).send('Internal Server Error');
  }
};

router.get("/header", async (req, res) => {
	if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
		// If not authenticated, send a 401 Unauthorized response
		return res.status(401).send('Authentication failed');
	}
	const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
	console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
	console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
	if (payload.emailId) {
		const emailId = payload.emailId;
		const userDetails = await db.User.findOne({ where: { emailId } });
		const userId = userDetails.dataValues.userid;
		
		const user = {
			name: userDetails.name,
			emailId: userDetails.emailId,

		};

		return res.status(200).json({
			success: true,
			status: 200,
			body: user
		});

		// res.render("userProfile", { user: user });
	} else {

		return res.status(401).json({
			success: false,
			status: 401,
			message: "Invalid cookie",
			redirectUrl: "/users/login"
		});

		// res.redirect("login");
	}
});

router.get("/", getAllrequests);
router.post("/get-claimed-requests", postClaimedrequests);
router.post("/claim-request", postClaimrequest);
router.get("/thread", getthread);
router.get("/rep_listings", getReplistings);
router.post("/rep_listings/delete/:listingId", postdeletereplisting);
router.get("/rep_listings/modify/:listingId", getmodifyreplisting);
router.post("/rep_listings/modify/:listingId", postmodifyreplisting);
router.post("/insert-message", getMessegeToBeInserted);
router.post("/show-all-messeges", getAllMesseges);


module.exports = router;


