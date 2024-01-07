
const express = require("express");
const router = express.Router();
const db = require('../models');
const { where } = require('sequelize');
const cart = require("../models/cart");
const userUtil = require("../util/userUtil");
const { get_cart: get_cart, caluculateCost: caluculateCost } = require('../routes/cart_routes');
const paymentService = require('../services/paymentService');
const authent = userUtil.authent;
const StripeUser = db.StripeUser;

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51O49dTDB1UugWx3SlwFKiiQc8JDwiBU5QX343MsHyZKRmgXN16V4vYSn46NOjm1pSHXgF6kXiDL9FZ2MkuYe17xH00Vx06mKID');

router.use(express.urlencoded({ extended: true }));

const createPaymentIntent = async (req, res) => {
    console.log("createPaymentIntent inside ------------------------");
    if (!userUtil.authenticateToken(req.cookies.accessToken)) {
        return res.status(401).send('Authentication failed');
    }
    //NEW IMPLEMENTATION -RETURNS THE ORIGINAL PAYLOAD OBJECT (DECIPHERS THE JSON PACKAGE : EMAIL AND USERID FROM THE ENCRYPTED JWT PAYLOAD)
    const payload = userUtil.retrieveTokenPayload(req.cookies.accessToken);
    //THIS IS HOW YOU CAN ACCESS THE PAYLOAD OBJECT
    console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
    console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
    //USING THE EMAIL ID FROM PAYLOAD OBJECT
    const userDetails = await userUtil.check_email(payload.emailId);
    const customerId = paymentService.fetchCustomerFromStripe(userDetails);
    // const total = Math.ceil(await paymentService.calculateTotal(userDetails) * 100);
    // Create a PaymentIntent with the order amount and currency
    let cartDetails = 0;

    if (req.query.filter == "false") {
        console.log("filter is false");
        cartDetails = await get_cart(payload.userId, false);

    }
    else {
        console.log("filter is true");
        cartDetails = await get_cart(payload.userId);
    }

    console.log("cartDetails: ", cartDetails);

    if (cartDetails == 0) {
        console.log("cartDetails is 0");
        return res.status(400).send('Cart is empty');
    }

    const [total_price, sales_tax, promocode_discount] = await caluculateCost(req, cartDetails, req.cookies.promocode);

    let finalPrice = total_price + sales_tax - promocode_discount;
    finalPrice = Math.ceil(finalPrice * 100);
    console.log("finalPrice: ", finalPrice);
    const paymentIntent = await stripe.paymentIntents.create({
        customer: customerId,
        // setup_future_usage: "off_session",
        amount: finalPrice,
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });
    console.log("------------------->: " + JSON.stringify(paymentIntent.id));
    res.send({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    });
};

router.post("/create-payment-intent", createPaymentIntent);

//export router
module.exports = router;
