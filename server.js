import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Configuration and Utilities
import connectDB from "./config/db.js";
import cloudinary from "./uitls/cloudinary.js"; // Note: Check if the path is correct: 'uitls' or 'utils'

// Routes
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// 1. CORS Configuration
// Using the FRONTEND_URL from the .env file (make sure the casing is correct)
const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Recommended methods
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// 2. Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // For parsing cookies

// 3. Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 4. Database Connection
connectDB();

// 5. Basic Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// 6. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// 7. Error Handling Middleware (Optional but recommended)
// Add this section after all routes to catch any unhandled errors
// This is a minimal example, you might want a dedicated errorHandler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


// 8. Start Server
app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});