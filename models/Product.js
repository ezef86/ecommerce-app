// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Product name is required"],
		trim: true,
	},
	description: {
		type: String,
		required: [true, "Product description is required"],
	},
	price: {
		type: Number,
		required: [true, "Product price is required"],
		min: [0, "Price cannot be negative"],
	},
	imageUrl: {
		type: String,
		default: "/assets/images/default-product.png", // Default image if not provided
	},
	stock: {
		type: Number,
		required: [true, "Stock quantity is required"],
		min: [0, "Stock cannot be negative"],
		default: 0,
	},
	category: {
		// Optional, but good for e-commerce
		type: String,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Create a text index for searching (optional but useful)
productSchema.index({ name: "text", description: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
