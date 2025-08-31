import express from "express";
import dotenv from "dotenv";

dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cloudinary from "./uitls/cloudinary.js";


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();
app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api", authRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});