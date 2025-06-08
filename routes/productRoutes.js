// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController");

// GET a todos los productos
router.get("/", getAllProducts);

// GET un único producto por ID
router.get("/:id", getProductById);

// POST un producto nuevo
router.post("/", createProduct);

// PUT para actualizar un producto por ID
router.put("/:id", updateProduct);

// DELETE un producto por ID
router.delete("/:id", deleteProduct);

module.exports = router;
