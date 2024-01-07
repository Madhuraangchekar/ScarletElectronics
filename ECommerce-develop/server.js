console.log("server.js loaded");
const express = require("express");
const jwt = require("jsonwebtoken");

const landing = require("./routes/user_routes.js");

const userRouter = require("./routes/user_routes.js");
const addItem = require("./routes/add_item.js");
const itemListing = require("./routes/item_listing_routes.js");
// const cart = require("./routes/cart_routes.js");
const review = require("./routes/review_rating.js");
const { router: cart } = require("./routes/cart_routes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const cookieParser = require("cookie-parser");
const Admin = require("./routes/admin.js");
const CustomerRepLogin = require("./routes/staff-login.js");
const customerRepresentative = require("./routes/customer_representative.js");
const recommendations = require("./routes/recommendation_routes.js");
const salesReportRouter = require('./routes/crSalesReport'); // Adjust the path as necessary

const mysql = require("mysql2");
const { encrypt, decrypt } = require("./util/encryptionUtil"); // Assuming the encryptionUtil.js file is in the same directory

const db = require("./models");
const { where } = require("sequelize");
const User = db.User;
const OTP = db.OTP;
const Catalog = db.Catalog;

OTP.belongsTo(User, {
	foreignKey: "emailId",
	targetKey: "emailId",
	onDelete: "CASCADE", // Define the onDelete behavior (e.g., CASCADE, SET NULL)
});

const app = express();

// app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

// remedy for css not loading
var path = require("path");
app.use("/public", express.static(path.resolve(__dirname + "/public")));
app.use("/users", userRouter);
// end of Yujia's remedy

app.use("/add-item", addItem);
app.use("/item-listing", itemListing);
app.use("/cart", cart);

app.use("/review", review);
app.use("/recommendations", recommendations);
app.use("/payments", paymentRoutes);
app.use('/reports', salesReportRouter); // Prefixing with '/api'

app.post("/token", (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		const tokenPackage = {
			name: user.name,
			password: user.encrypted_password,
		};
		const accessToken = generateAccessToken(tokenPackage);
		res.json({ accessToken: accessToken });
	});
});

app.use("/admin", Admin);
app.use("/staff-login", CustomerRepLogin);
app.use("/customer_representative", customerRepresentative);

db.sequelize.sync().then(() => {
	app.listen(3000, () => {
		console.log("Server is running on port 3000");
	});
});
