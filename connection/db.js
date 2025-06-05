// connection/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		let mongoURI;
		if (process.env.MONGO_CONNECTION_TYPE === "ATLAS") {
			mongoURI = process.env.MONGO_ATLAS_URI;
			if (!mongoURI) {
				throw new Error(
					"MONGO_ATLAS_URI is not defined in .env file for ATLAS connection type."
				);
			}
		} else {
			// Default to LOCAL
			mongoURI = process.env.MONGO_LOCAL_URI;
			if (!mongoURI) {
				throw new Error(
					"MONGO_LOCAL_URI is not defined in .env file for LOCAL connection type."
				);
			}
		}

		await mongoose.connect(mongoURI);
		console.log("MongoDB Connected successfully.");

		mongoose.connection.on("error", (err) => {
			console.error("MongoDB connection error:", err);
		});

		mongoose.connection.on("disconnected", () => {
			console.log("MongoDB disconnected.");
		});
	} catch (err) {
		console.error("MongoDB connection failed:", err.message);
		process.exit(1); // Exit process with failure
	}
};

module.exports = connectDB;
