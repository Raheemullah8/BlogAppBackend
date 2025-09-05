import UserSchema from "../modles/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path; // direct cloudinary se URL milta hai
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token);

    const user = new UserSchema({
      name,
      email,
      profileImage,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log(error.message);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserSchema.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    const ispasswordCorrect = await bcrypt.compare(password, user.password);

    if (!ispasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
    res.status(500).json({ message: "Server Error" })
    console.log(error);

  }
}
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
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
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
            updateData.password = password; // For now, assuming you are not hashing
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
const deleteUser = async (req,res)=>{
  try {
    const {id} = req.params
    const userToDelete = await UserSchema.findById(id);
    if(!userToDelete) return res.status(404).json({error:false,message:"User Not Found"})
    if(!userToDelete){
      return res.status(400).json({error:true,message:"Admin can not Deleted"})
    }
    const deleteUser = await UserSchema.findByIdAndDelete({id})
    return res.status(201).json({error:false,message:"User Delete successful",user:deleteUser})
    

  } catch (error) {
    return res.status(500).json({error:true,message:"server error"})
  }
}



export { Register, login, getUser, logout, updateProfile,deleteUser };