// controllers/productController.js
const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/productos
// @access  Public
exports.getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server Error when fetching products" });
	}
};

// @desc    Get a single product by ID
// @route   GET /api/productos/:id
// @access  Public
exports.getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(product);
	} catch (err) {
		console.error(err.message);
		if (err.kind === "ObjectId") {
			return res
				.status(404)
				.json({ message: "Product not found (invalid ID format)" });
		}
		res.status(500).json({ message: "Server Error when fetching product" });
	}
};

// @desc    Create a new product
// @route   POST /api/productos
// @access  Public (can be restricted later)
exports.createProduct = async (req, res) => {
	const { name, description, price, imageUrl, stock, category } = req.body;
	try {
		const newProduct = new Product({
			name,
			description,
			price,
			imageUrl,
			stock,
			category,
		});
		const product = await newProduct.save();
		res.status(201).json(product);
	} catch (err) {
		console.error(err.message);
		if (err.name === "ValidationError") {
			return res
				.status(400)
				.json({ message: "Validation Error", errors: err.errors });
		}
		res.status(500).json({ message: "Server Error when creating product" });
	}
};

// @desc    Update an existing product by ID
// @route   PUT /api/productos/:id
// @access  Public (can be restricted later)
exports.updateProduct = async (req, res) => {
	const { name, description, price, imageUrl, stock, category } = req.body;
	try {
		let product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Update fields
		product.name = name !== undefined ? name : product.name;
		product.description =
			description !== undefined ? description : product.description;
		product.price = price !== undefined ? price : product.price;
		product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
		product.stock = stock !== undefined ? stock : product.stock;
		product.category = category !== undefined ? category : product.category;

		const updatedProduct = await product.save();
		res.json(updatedProduct);
	} catch (err) {
		console.error(err.message);
		if (err.name === "ValidationError") {
			return res
				.status(400)
				.json({ message: "Validation Error", errors: err.errors });
		}
		if (err.kind === "ObjectId") {
			return res
				.status(404)
				.json({ message: "Product not found (invalid ID format)" });
		}
		res.status(500).json({ message: "Server Error when updating product" });
	}
};

// @desc    Delete a product by ID
// @route   DELETE /api/productos/:id
// @access  Public (can be restricted later)
exports.deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		await product.deleteOne(); // Mongoose v6+ uses deleteOne() on the document
		// For older versions: await Product.findByIdAndRemove(req.params.id);

		res.json({ message: "Product removed successfully" });
	} catch (err) {
		console.error(err.message);
		if (err.kind === "ObjectId") {
			return res
				.status(404)
				.json({ message: "Product not found (invalid ID format)" });
		}
		res.status(500).json({ message: "Server Error when deleting product" });
	}
};
