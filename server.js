import express from "express";
import dotenv from "dotenv";

dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "./uitls/cloudinary.js";
import commentRoutes from "./routes/comment.route.js"
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js"
import postRoutes from "./routes/post.route.js"


const app = express();
const port = process.env.PORT || 5000;

;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // frontend ka URL
    credentials: true, // cookies allow
  })
);
app.use(cookieParser(

));


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();
app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);


app.listen(port,()=>{
    console.log("Server is running on port 5000");
})
