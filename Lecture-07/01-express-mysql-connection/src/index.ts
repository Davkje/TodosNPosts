import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();

console.log(process.env.DB_HOST);

// Middleware
app.use(express.json()); // This specific middleware parses JSON string to Javascript Object
app.use(cors()); // This makes the Express server except request from other domains

import mysql from "mysql2/promise";

// Create the connection pool. The pool-specific settings are the defaults
const db = mysql.createPool({
	host: process.env.DB_HOST || "",
	user: process.env.DB_USER || "",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "",
	port: parseInt(process.env.DB_PORT || "3306"),
});

const connectToDatabase = async () => {
	try {
		await db.getConnection();
		console.log("Connected to DB");
	} catch (error: unknown) {
		console.log("Error connecting to DB: " + error);
	}
};

// Routes
import routes from "./routes/todos";
app.use("/todos", routes);

// Connect To DB
connectToDatabase();

// Start the express server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
