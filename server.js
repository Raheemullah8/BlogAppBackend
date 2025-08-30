import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB();
app.get ("/",(req,res)=>{
    res.send("Hello World!");
})

app.use("/api/auth",authRoutes);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});