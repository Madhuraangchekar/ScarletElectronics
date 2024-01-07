const express = require("express");
const router = express.Router();

const db = require("../models");
const { Op } = require("sequelize");
const Catalog = db.Catalog;
const UserUtil = require("../util/userUtil");

const getRecommendations = async (req, res) => {
	try {
		const item_id = req.query["itemId"]; //item id of specific item coming from Request

		const item = await Catalog.findOne({ where: { itemId: item_id } });
		const category = item.category;

		const itemsDb = await Catalog.findAll({
			where: { itemId: { [Op.ne]: item_id }, category: category },
			limit: 10,
		});

		const items = itemsDb.map((item) => ({
			name: item.name,
			description: item.description,
			link: "/item-listing/catalog?item-id=" + item.itemId,
		}));

		res.status(200).json({
			success: true,
			status: 200,
			body: { items: items },
		});

		// res.status(200).render("getreview", {
		// 	comments: comments.comments,
		// 	ind_comment: comments.ind_comment,
		// });
	} catch (err) {
		console.log("Recommendations : " + err);
		res.status(500).json({
			success: false,
			status: 500,
			message: "Internal Server Error!!",
		});
	}
};

router.get("/", getRecommendations);

module.exports = router;
