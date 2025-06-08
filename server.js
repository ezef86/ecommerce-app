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
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

// Archivos estáticos (Bootstrap, custom CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));
// Bootstrap accesible desde node_modules
app.use(
	"/bootstrap",
	express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

// Handlebars
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerPartials(path.join(__dirname, "views"));

// Handlebars helper
hbs.registerHelper("productTitle", function (baseTitle, index) {
	return `${baseTitle}_${index + 1}`;
});
// Helper para formatear precios
hbs.registerHelper("eq", function (a, b) {
	return a === b;
});

// Routes
const productApiRoutes = require("./routes/productRoutes");
const cartApiRoutes = require("./routes/cartRoutes");
const viewRoutes = require("./routes/viewRoutes"); // For rendering pages

// Cargar las rutas de la API y las vistas
// api/productos para cargar productos a la base de datos mediante Postman
app.use("/api/productos", productApiRoutes);
// api/carrito para manejar el carrito de compras
app.use("/api/carrito", cartApiRoutes);
// Ruta para las vistas
app.use("/", viewRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Algo salió mal...");
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
// Antes de app.listen, establecer una variable local con el año actual para todas las vistas
app.use((req, res, next) => {
	res.locals.currentYear = new Date().getFullYear();
	next();
});
app.listen(PORT, () => {
	console.log(`Servidor iniciado en: http://localhost:${PORT}`);
	console.log(
		`Conectado a MongoDB a través de: ${process.env.MONGO_CONNECTION_TYPE}`
	);
});
