import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "./uitls/cloudinary.js";
import commentRoutes from "./routes/comment.route.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import postRoutes from "./routes/post.route.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // env se lo
    credentials: true,
  })
);
app.use(cookieParser());

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DB Connect
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World from Vercel!");
});
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);


// ⚡ yaha app ko export karna hoga, listen() hata do
export default app;
