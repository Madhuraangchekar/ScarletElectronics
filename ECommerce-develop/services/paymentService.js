const express = require("express");
const db = require('../models');
const { where } = require('sequelize');
const cart = require("../models/cart");
const userUtil = require("../util/userUtil");
const { get_cart: get_cart } = require('../routes/cart_routes');
const authent = userUtil.authent;
const StripeUser = db.StripeUser;
// This is your test publishable API key.
const stripe = require("stripe")("sk_test_51O49dTDB1UugWx3SlwFKiiQc8JDwiBU5QX343MsHyZKRmgXN16V4vYSn46NOjm1pSHXgF6kXiDL9FZ2MkuYe17xH00Vx06mKID");

// The items the customer wants to buy
// const items = [{ id: "xl-tshirt" }];

const chargeCustomer = async (customerId) => {
  // Lookup the payment methods available for the customer
  const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
  });
  try {
      // Charge the customer and payment method immediately
      const paymentIntent = await stripe.paymentIntents.create({
          amount: 1099,
          currency: "usd",
          customer: customerId,
          payment_method: paymentMethods.data[0].id,
          off_session: true,
          confirm: true,
      });
  } catch (err) {
      // Error code will be authentication_required if authentication is needed
      console.log("Error code is: ", err.code);
      const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
      console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
};

const fetchCustomerFromStripe = async function(userDetails) {
    
  const userId = userDetails.userid;    
  const stripeUser = await StripeUser.findOne({where: {'userId': userId}});
  if(stripeUser === null) {        
      const customer = await stripe.customers.create();
      console.log("New Customer created, id: " + customer.id);
      await StripeUser.create({userId: userId, stripeCustomerId: customer.id});
      return customer.id;
  }
  const id = stripeUser.stripeCustomerId;
  console.log("Customer exists, id: ", id);
  return id;
};

const calculateTotal = async function(userDetails) {
  const userId = userDetails.userid;
  const cartDetails = await get_cart(userId);
  var total_price = 0;
  // calculate total price of each listing
  for (var i = 0; i < cartDetails.length; i++) 
  {
      cartDetails[i].totalPrice = cartDetails[i].price * cartDetails[i].quantity;
      total_price += cartDetails[i].totalPrice;
  }
  // promocode = 50;
  // sales = total_price*0.1;
  // finalPrice = total_price - promocode + sales;

  //Remove this later.
  // if(finalPrice <= 0) {
  //   finalPrice = 1;
  // }
  return total_price.toFixed(2);
};

module.exports = { chargeCustomer, fetchCustomerFromStripe, calculateTotal };