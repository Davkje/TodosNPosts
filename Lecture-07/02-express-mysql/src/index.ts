import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { connectToDatabase } from "./config/db";

const app = express();

// Middleware
app.use(express.json()); // This specific middleware parses JSON string to Javascript Object
app.use(cors()); // This makes the Express server except request from other domains

// Routes
import todoRouter from "./routes/todos";
app.use("/todos", todoRouter);
import postRouter from "./routes/posts";
app.use("/posts", postRouter);
import subtaskRouter from "./routes/subtasks";
app.use("/subtasks", subtaskRouter);

// STATIC FILES
const publicPatch = path.join(__dirname, "../public");
app.use(express.static(publicPatch));

//FALLBACK
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPatch, "index.html"));
});

// Connect To DB
connectToDatabase();

// Start the express server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
