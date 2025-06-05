// models/Cart.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product", // Reference to the Product model
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: [1, "Quantity must be at least 1"],
		},
		priceAtPurchase: {
			// Store price at the time of purchase to avoid issues with price changes
			type: Number,
			required: true,
		},
	},
	{ _id: false }
); // Do not create a separate _id for each cart item

const cartSchema = new mongoose.Schema({
	items: [cartItemSchema],
	totalAmount: {
		type: Number,
		required: true,
	},
	customerInfo: {
		// Basic info, can be expanded. For now, keeping it simple.
		name: String, // Example field, can be anonymous or from a form
		email: String, // Example field
	},
	status: {
		type: String,
		enum: ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"],
		default: "Pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Cart = mongoose.model("Cart", cartSchema); // This will create a 'carts' collection

module.exports = Cart;
