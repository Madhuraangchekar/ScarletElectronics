const express = require("express");
const router = express.Router();

const db = require("../models");
const { Op } = require("sequelize");
const Review = db.Review;
const User = db.User;
const Purchase = db.Purchase;
const UserUtil = require("../util/userUtil");

const comment_fetcher = async (item_id, user_id) => {
	const allOptions = { itemId: item_id };
	if (user_id) {
		allOptions.userId = { [Op.ne]: user_id };
	}
	const reviewsWithUsernames = await Review.findAll({
		where: allOptions,
		include: [
			{
				model: User,
				attributes: ["name"],
				required: true,
			},
		],
	});

	const comments = reviewsWithUsernames.map((review) => ({
		username: review.User.name,
		comment: review.comments,
		rating: review.rating,
	}));

	let ind_comment = {
		review_id: undefined,
		comment: undefined,
		rating: undefined,
	};

	if (user_id) {
		const ind_review = await Review.findOne({
			where: { itemId: item_id, userId: user_id },
		});
		if (ind_review) {
			ind_comment = {
				review_id: ind_review.reviewId,
				comment: ind_review.comments,
				rating: ind_review.rating,
			};
		}
	}

	return { comments: comments, ind_comment: ind_comment };
};
const getReview = async (req, res) => {
	console.log("In Get reivew Item");
	try {
		let userId;
		if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
			userId = undefined;
		} else {
			const payload = UserUtil.retrieveTokenPayload(
				req.cookies.accessToken
			);
			userDetails = await UserUtil.check_email(payload.emailId);
			userId = payload.userId;
		}

		const item_id = req.query["itemId"]; //item id of specific item coming from Request

		const comments = await comment_fetcher(item_id, userId);

		return res.status(200).json({
			success: true,
			status: 200,
			body: comments,
		});

		// res.status(200).render("getreview", {
		// 	comments: comments.comments,
		// 	ind_comment: comments.ind_comment,
		// });
	} catch (err) {
		console.log("Error caught in Get method of Review : " + err);
		return res.status(500).json({
			success: false,
			status: 500,
			message: "Internal Server Error!!",
		});
	}
};

const addReview = async (req, res) => {
	console.log("In POST reivew Item");
	try {
		if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
			// If not authenticated, send a 401 Unauthorized response
			return res.status(401).json({
				success: false,
				status: 401,
				message: "Please login to add the review",
				redirectUrl: "/users/login",
			});
		}
		const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
		//THIS IS HOW YOU CAN ACCESS THE PAYLOAD OBJECT
		console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
		console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
		userDetails = await UserUtil.check_email(payload.emailId);
		const item_id = req.body.itemId; //item id of specific item coming from Request
		const ratings = req.body.rating; // rating of specific item coming from Request
		const comment = req.body.comments; // comments of specific item coming from Request

		let orders = [];

		try {
			const sqlQuery =
				"Select `purchase`.`purchaseId` from `order_detail` " +
				"INNER JOIN `purchase` ON `order_detail`.`purchaseId` = `purchase`.`purchaseId` " +
				"INNER JOIN `item_listing` ON `order_detail`.`listingId` = `item_listing`.`listingId` " +
				"INNER JOIN `ref_catalog` ON `ref_catalog`.`itemId` = `item_listing`.`itemId` " +
				"where `purchase`.`userId`=" +
				payload.userId +
				" " +
				"AND `item_listing`.`itemId` = " +
				item_id;
			[orders, _] = await db.sequelize.query(sqlQuery);
			console.log(orders);
		} catch (error) {
			console.log(error);
		}

		if (orders.length == 0) {
			return res.status(405).json({
				success: false,
				status: 403,
				message: "You must purchase the item before adding a review.",
				redirectUrl: "/item-listing/listings",
			});
		}

		const old_review = await Review.findOne({
			where: { itemId: item_id, userId: userDetails.userid },
		});

		if (old_review) {
			await Review.destroy({ where: { reviewId: old_review.reviewId } });
		}

		await Review.create({
			userId: userDetails.userid,
			itemId: item_id,
			rating: ratings,
			comments: comment,
		});
		console.log("Data added Successfully in REVIEW");

		//res.send("Data added Successfully in REVIEW");
		const comments = await comment_fetcher(item_id, userDetails.userid);

		return res.status(201).json({
			success: true,
			status: 201,
			message: "Added",
			reviewId: comments.ind_comment.review_id,
		});
	} catch (err) {
		console.log("Error caught in post method of Review : " + err);
		return res.status(500).json({
			success: false,
			status: 500,
			message: "Internal Server Error!!",
		});
	}
};

const deleteReview = async (req, res) => {
	console.log("In delete reivew Item");
	try {
		if (!UserUtil.authenticateToken(req.cookies.accessToken)) {
			// If not authenticated, send a 401 Unauthorized response
			return res.status(401).json({
				success: false,
				status: 401,
				message: "Please login to delete the review",
				redirectUrl: "/users/login",
			});
		}
		const payload = UserUtil.retrieveTokenPayload(req.cookies.accessToken);
		//THIS IS HOW YOU CAN ACCESS THE PAYLOAD OBJECT
		console.log("ACCESSING USERID FROM TOKENPAAYLOAD:", payload.userId);
		console.log("ACCESSING emailId FROM TOKENPAAYLOAD:", payload.emailId);
		userDetails = await UserUtil.check_email(payload.emailId);
		const review_id = req.query["reviewId"]; //item id of specific item coming from Request

		const old_review = await Review.findOne({
			where: { reviewId: review_id },
		});

		if (old_review) {
			await Review.destroy({ where: { reviewId: old_review.reviewId } });
			console.log("Deleted review");
			const comments = await comment_fetcher(
				old_review.itemId,
				userDetails.userid
			);
			console.log(comments.ind_comment);
			return res.status(204);
		} else {
			return res.status(404).json({
				success: false,
				status: 404,
				message: "No review found for this item for the given user",
			});
		}
	} catch (err) {
		console.log("Error caught in delete  method of Review : " + err);
		res.status(500).json({
			success: false,
			status: 500,
			message: "Internal Server Error!!",
		});
	}
};

router.get("/", getReview);
router.post("/", addReview);
router.delete("/", deleteReview);

module.exports = router;
