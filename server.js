import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Config and Utils
import connectDB from "./config/db.js";
import cloudinary from "./uitls/cloudinary.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

// Load env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 👉 Export for Vercel
export default app;

// 👉 Local run only
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}
