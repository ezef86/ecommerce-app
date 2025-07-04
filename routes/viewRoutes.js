// routes/viewRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // To fetch products for the products page

// Home page
router.get("/", (req, res) => {
	res.render("index", { pageTitle: "Home" });
});

// Products page
router.get("/products", async (req, res) => {
	try {
		const products = await Product.find().lean(); // .lean() for plain JS objects, faster for HBS
		res.render("products", {
			pageTitle: "Nuestros Productos",
			products: products,
		});
	} catch (err) {
		console.error("Error fetching products for view:", err);
		res
			.status(500)
			.render("error", {
				pageTitle: "Error",
				message: "Could not load products.",
			});
	}
});

// Cart page
router.get("/cart", (req, res) => {
	res.render("cart", { pageTitle: "Shopping Cart" });
});

module.exports = router;
