import UserSchema from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Zaroori utility function for cookie options
const getCookieOptions = (isLogout = false) => {
  // Check if we are in production and if the FRONTEND_URL environment variable is set.
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  // Cookie options must be SameSite: 'None' and Secure: true for cross-domain Vercel deployments.
  // httpOnly: true remains standard practice.
  // path: '/' ensures cookie is accessible across all paths.

  const options = {
    httpOnly: true,
    // CRITICAL FIX: 'None' is required for cross-site cookie transmission (Backend/Frontend on Vercel)
    sameSite: isProduction ? "None" : "lax",
    // CRITICAL FIX: 'Secure: true' is mandatory when using SameSite: 'None' (HTTPS required)
    secure: isProduction,
    path: '/', // Ensure the cookie is available on all paths

  };

  if (!isLogout) {
    // Token expires in 1 hour (as per JWT expiry)
    // maxAge is in milliseconds (1 hour = 3600000ms)
    options.maxAge = 3600000;
  } else {
    // For logout, set maxAge to 0 or very small negative value to instantly delete it
    options.maxAge = 0;
  }

  return options;
};


const Register = async (req, res) => {
    try {
        // ... (Baaki checks)

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // FIX: JWT_SECRET ko trim karein
        const trimmedSecret = process.env.JWT_SECRET.trim();
        
        // 🔑 Token sign karte waqt trimmed secret use karein
        const token = jwt.sign({ id: user._id, role: user.role }, trimmedSecret, { expiresIn: "1h" }); 

        // ... (res.cookie code)
    } catch (error) {
        // ...
    }
};

const login = async (req, res) => {
    try {
        // ... (Baaki checks)

        const user = await UserSchema.findOne({ email });
        // ... (Password check)

        // FIX: JWT_SECRET ko trim karein
        const trimmedSecret = process.env.JWT_SECRET.trim();
        
        // 🔑 Token sign karte waqt trimmed secret use karein
        const token = jwt.sign({ id: user._id, role: user.role }, trimmedSecret, { expiresIn: "1h" });

        // ... (res.cookie code)
    } catch (error) {
        // ...
    }
};
const getUser = async (req, res) => {
  try {
    const users = await UserSchema.find({})
    if (!users) {
      return res.status(400).json({ error: true, message: "User not Found" });
    };
    return res.status(200).json({ error: false, message: "User Get Successful", users })

  } catch (error) {
    return res.status(500).json({ error: true, message: "enternel server error" })
  }
}

const logout = async (req, res) => {
  try {
    // FIX APPLIED: Using getCookieOptions for deletion
    res.clearCookie("token", getCookieOptions(true));

    return res.status(200).json({ error: false, message: "Logout Successful" });

  } catch (error) {
    return res.status(500).json({ error: true, message: "Server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    const { name, email, password } = req.body;

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // Mongoose ko updated document return karne ke liye { new: true } use karein
    const updatedUser = await UserSchema.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.status(200).json({
      error: false,
      message: "User update successful",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const userToDelete = await UserSchema.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ error: true, message: "User Not Found" });
    }
    if (userToDelete.role === "admin") {
      return res.status(400).json({ error: true, message: "Admin can not be Deleted" })
    }
    const deleteUser = await UserSchema.findByIdAndDelete(id)
    return res.status(201).json({ error: false, message: "User Delete successful", user: deleteUser })


  } catch (error) {
    return res.status(500).json({ error: true, message: "server error" })
  }
}



export { Register, login, getUser, logout, updateProfile, deleteUser };
