import jwt from "jsonwebtoken";
import UserSchema from "../models/UserModel.js";

// Ensure authMiddleWare and isAdmin are correctly exported together
// Note: We use named exports for both in the final export block.

const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        // 1. Token check
        if (!token) return res.status(401).json({ error: true, message: "Authorization denied: Token Not Found." });

        // 2. Token verification
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // --- DEBUG STEP ADDED ---
        // Vercel logs mein is line ka output check karein
        console.log("Decoded JWT Payload:", decode); 
        // --- END DEBUG STEP ---
        
        // 3. User Lookup by ID (CRITICAL FIX)
        // Since your token now signs { id: user._id }, we must use findById.
        // This is faster and more reliable than finding by email.
        const user = await UserSchema.findById(decode.id); 
        
        if (!user) return res.status(401).json({ error: true, message: "User not found or ID is invalid." });
        
        // 4. Attach user data for subsequent checks
        req.user = user;
        next();
    } catch (error) {
        // Handle common token errors (e.g., expiration, invalid signature)
        console.error("Auth Middleware Error:", error.message);
        // Change server error to 401 for token failure, but retain 500 for true server issues
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
             return res.status(401).json({ error: true, message: "Token is invalid or expired." });
        }
        return res.status(500).json({ error: true, message: "Server error during token processing." });
    }
};