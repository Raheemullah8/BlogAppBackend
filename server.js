import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Configuration and Utilities
import connectDB from "./config/db.js";
import cloudinary from "./uitls/cloudinary.js";
// NOTE: Make sure the path is correct: './uitls/cloudinary.js' or './utils/cloudinary.js'

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
const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};
app.use(cors(corsOptions));

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
    res.send("API is running successfully!");
});

// 6. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// 7. Error Handling Middleware (Always put this last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


// 8. SERVER START LOGIC (ESM EXPORT & CONDITIONAL LISTENING)
// ==========================================================

// **STEP A: Vercel Export (ES Module Way)**
// Vercel aur Serverless Functions ke liye Express app ko export karte hain.
export default app;

// **STEP B: Local Listening**
// Yeh code sirf local machine par chalega (development mode mein).
// NODE_ENV check karne se yeh Vercel par run nahi hota.
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running LOCALLY on port ${port}`);
    });
}