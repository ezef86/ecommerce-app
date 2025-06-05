// server.js
require("dotenv").config();

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const hbs = require("hbs");
const connectDB = require("./connection/db");

const app = express();

// Conexión a la base de datos
connectDB();

// Middleware
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded request bodies

// Serve static files (Bootstrap, custom CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));
// Make Bootstrap accessible from node_modules
app.use(
	"/bootstrap",
	express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

// View Engine Setup (Handlebars)
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

// Register a Handlebars helper for enumerated product titles
hbs.registerHelper("productTitle", function (baseTitle, index) {
	return `${baseTitle}_${index + 1}`;
});

// In server.js, where other hbs helpers are registered:
hbs.registerHelper("eq", function (a, b) {
	return a === b;
});

// Routes
const productApiRoutes = require("./routes/productRoutes");
const cartApiRoutes = require("./routes/cartRoutes");
const viewRoutes = require("./routes/viewRoutes"); // For rendering pages

app.use("/api/productos", productApiRoutes);
app.use("/api/carrito", cartApiRoutes);
app.use("/", viewRoutes); // Mount view routes at the root

// Basic Error Handling (can be expanded)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
// In server.js, before app.listen
// Make current year available to all templates
app.use((req, res, next) => {
	res.locals.currentYear = new Date().getFullYear();
	next();
});
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Connected to MongoDB via: ${process.env.MONGO_CONNECTION_TYPE}`);
});
