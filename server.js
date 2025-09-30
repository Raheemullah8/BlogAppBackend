import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Config and Utils
import connectDB from "./config/db.js"; // This is an async function
import cloudinary from "./uitls/cloudinary.js"; // Note: Check if the path is 'uitls' or 'utils'

// Routes
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

// Load env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// 1. CORS Setup
const corsOptions = {
    // NOTE: Change this to your live Vercel frontend URL for production!
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};
app.use(cors(corsOptions));

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 4. Server Initialization Function
const startServer = async () => {
    try {
        // IMPORTANT: Await the connection before setting up routes
        await connectDB(); 

        // 5. Test route (Only available if DB connection succeeds)
        app.get("/", (req, res) => {
            res.send("API is running successfully 🚀");
        });

        // 6. Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/category", categoryRoutes);
        app.use("/api/post", postRoutes);
        app.use("/api/comment", commentRoutes);

        // 7. Error handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            const statusCode = err.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        });

        // 8. Local run only
        if (process.env.NODE_ENV !== "production") {
            app.listen(port, () => {
                console.log(`Server running locally on port ${port}`);
            });
        }

    } catch (error) {
        console.error("FATAL SERVER STARTUP ERROR:", error.message);
        // In a real Serverless environment, throwing here will cause the function to fail (which is desired).
        // For local development, this makes the error visible.
    }
};

// Call the async function to start the logic
startServer();

// 👉 Export for Vercel (This must be synchronous and at the root)
// Vercel handles the async initialization when it runs the serverless function.
export default app;
