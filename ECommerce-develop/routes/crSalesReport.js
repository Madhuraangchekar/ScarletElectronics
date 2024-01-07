const express = require("express");
const router = express.Router();
const db = require('../models');
const UserUtil = require('../util/userUtil');

// Route to render the sales report page
const getSalesReportPage = async (req, res) => {
  if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
    return res.status(401).send('Authentication failed');
  }

  const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
  const userDetails = await UserUtil.check_email(payload.emailId);
  const username = userDetails.name;

  res.render('sales_report_page', { username }); // Assuming 'sales_report_page.ejs' is your EJS template
};

// API route to fetch sales report data
const getSalesReportData = async (req, res) => {
//   if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
//     return res.status(401).send('Authentication failed');
//   }

  try {
    console.log('Fetching sales report data...');
    const salesReportQuery = `
        SELECT 
            il.itemId, 
            c.name as productName, 
            COUNT(od.listingId) as totalItemsSold, 
            SUM(il.price * od.quantity) as totalRevenue
        FROM 
            order_detail od 
        JOIN 
            item_listing il ON od.listingId = il.listingId
        JOIN 
            ref_catalog c ON il.itemId = c.itemId
        GROUP BY 
            il.itemId, c.name;
    `;

    const salesReportData = await db.sequelize.query(salesReportQuery, { type: db.sequelize.QueryTypes.SELECT });

    res.status(200).json({
      success: true,
      message: 'Sales report data retrieved successfully',
      data: salesReportData
    });
  } catch (error) {
    console.error('Error fetching sales report data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales report data'
    });
  }
};

// API route to fetch the "Customer Purchase History Report" data
const getCustomerPurchaseHistoryData = async (req, res) => {
    try {
      console.log('Fetching "Customer Purchase History Report" data...');
      const customerPurchaseHistoryQuery = `
          SELECT 
              u.userId,
              u.name as customerName,
              il.itemId,
              rc.name as productName,
              COUNT(od.orderId) as numberOfPurchases,
              SUM(il.price * od.quantity) as totalSpent
          FROM 
              purchase p
          JOIN 
              order_detail od ON p.purchaseId = od.purchaseId
          JOIN 
              item_listing il ON od.listingId = il.listingId
          JOIN 
              ref_catalog rc ON il.itemId = rc.itemId
          JOIN 
              users u ON p.userId = u.userId
          GROUP BY 
              u.userId, u.name, il.itemId, rc.name
          ORDER BY 
              u.userId, totalSpent DESC;
      `;
  
      const customerPurchaseHistoryData = await db.sequelize.query(customerPurchaseHistoryQuery, { type: db.sequelize.QueryTypes.SELECT });
  
      res.status(200).json({
        success: true,
        message: '"Customer Purchase History Report" data retrieved successfully',
        data: customerPurchaseHistoryData
      });
    } catch (error) {
      console.error('Error fetching "Customer Purchase History Report" data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching "Customer Purchase History Report" data'
      });
    }
  };
  

// Add the route handlers
router.get("/sales-report-page", getSalesReportPage);
router.get("/sales-report-data", getSalesReportData);
router.get("/customer-purchase-history-data", getCustomerPurchaseHistoryData);

module.exports = router;
