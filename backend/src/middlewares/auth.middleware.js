import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // this will undefine if don't use cookie parser in server.js app.use(cookieParser())
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invaild token provided" });
    }

    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protected Route middleware : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
