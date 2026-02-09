import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body; //use app.use(express.json()) middleware in server to get data
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All field is required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    //check if emails vaild:regex
    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invaild email format" });
    }

    const user = await userModel.findOne({
      email,
    }); // return an email or null
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        message: "Invaild user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
