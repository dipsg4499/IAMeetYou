import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer } from "http";

import prisma from "./src/db/prisma.js";
import UserRouter from "./src/routers/User.router.js";

// 🔹 Load environment variables FIRST
dotenv.config({ path: "./.env" });

// 🔹 Connect to Database BEFORE starting server
try {
  await prisma.$connect();
  console.log("✅ PostgreSQL connected successfully via Prisma");
} catch (error) {
  console.error("❌ PostgreSQL connection failed:", error.message);
  process.exit(1);
}

// 🔹 Resolve __dirname (ES module fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Initialize app
const app = express();
const server = createServer(app);

// 🔹 Middlewares
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 Static files (if needed)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Routes
app.use("/api/v1/user", UserRouter);

// 🔹 Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running 🚀",
  });
});

// 🔹 Server start
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
