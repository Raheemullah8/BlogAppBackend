import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Config and Utils
import connectDB from "./config/db.js"; 
// Check: Note the path "uitls". If your folder is named 'utils', you should correct this line:
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

// --- CRITICAL FIX: Root Route ko SYNCHRONOUSLY define karna ---
// Vercel ko server running dikhane ke liye yeh route abhi available hoga.
app.get("/", (req, res) => {
    res.send("API is running successfully 🚀");
});
// ------------------------------------------------------------------

// 4. Server Initialization Function (Handles DB connection and sets up API routes)
const startServer = async () => {
    try {
        // IMPORTANT: Await the connection before setting up routes that DEPEND on the DB
        await connectDB(); 

        // 5. API Routes (These are mounted after DB connection starts)
        app.use("/api/auth", authRoutes);
        app.use("/api/category", categoryRoutes);
        app.use("/api/post", postRoutes);
        app.use("/api/comment", commentRoutes);

        // 6. Error handler (Remains the same)
        app.use((err, req, res, next) => {
            console.error(err.stack);
            const statusCode = err.statusCode || 500;
            res.status(statusCode).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        });

        // 7. Local run only (Remains the same)
        if (process.env.NODE_ENV !== "production") {
            app.listen(port, () => {
                console.log(`Server running locally on port ${port}`);
            });
        }

    } catch (error) {
        console.error("FATAL SERVER STARTUP ERROR:", error.message);
    }
};

// Call the async function to start the logic (DB connection & route mounting)
startServer();

// 👉 Export for Vercel 
export default app;
