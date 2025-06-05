// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { processCart } = require("../controllers/cartController");

// POST to process the cart (checkout)
router.post("/", processCart);

module.exports = router;
