// controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // To verify product details if needed

// @desc    Process and save the cart
// @route   POST /api/carrito
// @access  Public
exports.processCart = async (req, res) => {
	// Expected request body: { items: [{ productId: '...', quantity: X, priceAtPurchase: YYY }], totalAmount: ZZZ, customerInfo: { ... } }
	const { items, totalAmount, customerInfo } = req.body;

	console.log("Received cart data in backend:");
	console.log("Items:", JSON.stringify(items, null, 2));
	console.log("Total Amount:", totalAmount);
	console.log("Customer Info:", customerInfo);

	if (!items || items.length === 0 || !totalAmount) {
		return res
			.status(400)
			.json({ message: "Cart items and total amount are required." });
	}

	try {
		// Optional: Server-side validation of products and prices
		// This adds robustness but also complexity. For now, trusting client-side data for priceAtPurchase.
		// For a real app, you'd re-fetch products by ID and verify prices.
		// Example:
		// for (const item of items) {
		//     const product = await Product.findById(item.productId);
		//     if (!product) {
		//         return res.status(400).json({ message: `Product with ID ${item.productId} not found.` });
		//     }
		//     // You might compare product.price with item.priceAtPurchase here
		// }

		const newCart = new Cart({
			items: items.map((item) => ({
				product: item.productId, // Assuming frontend sends productId
				quantity: item.quantity,
				priceAtPurchase: item.priceAtPurchase,
			})),
			totalAmount,
			customerInfo, // Optional customer info
		});

		const savedCart = await newCart.save();

		// Here you might also want to update product stock levels
		// For each item in items:
		//   await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
		// This needs careful error handling (e.g., if stock is insufficient).

		res.status(201).json({
			message: "Order received and saved successfully!",
			cart: savedCart,
		});
	} catch (err) {
		console.error("Error processing cart:", err.message);
		if (err.name === "ValidationError") {
			return res.status(400).json({
				message: "Validation Error processing cart",
				errors: err.errors,
			});
		}
		res.status(500).json({ message: "Server Error when processing cart" });
	}
};
