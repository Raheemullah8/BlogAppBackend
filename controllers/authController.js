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


export { Register, login };