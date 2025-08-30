import mongoose, { mongo } from "mongoose";

const connectDB = async () =>{
       try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        .then(()=>{
            console.log("MongoDB connected");
        })
        
       } catch (error) {
        console.log("Error in DB connection", error.message);
       }
}

export default connectDB;