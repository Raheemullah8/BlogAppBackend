import jwt from "jsonwebtoken"
import UserSchema from "../models/UserModel.js"


const authMiddleWare = async (req,res,next) =>{
try {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({error:true,message:"Token Not Found"});

    const decode = await jwt.verify(token,process.env.JWT_SECRET)
    const user = await UserSchema.findOne({email:decode.email})
    
    if (!user) return res.status(401).json({ message: "User not found" });
    
    req.user = user
    next();
} catch (error) {
    return res.status(500).json({error:true,message:"server error"})
}
}

export default authMiddleWare