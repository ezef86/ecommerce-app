// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	isbn: {
		type: String,
		trim: true,
	},
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
		default:
			"https://dummyimage.com/600x400/000/fff.png&text=Imagen+no+disponible",
	},
	stock: {
		type: Number,
		required: [true, "Cantidad de stock es requerida"],
		min: [0, "El stock no puede ser negativo"],
		default: 0,
	},
	category: {
		// Opcional
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
