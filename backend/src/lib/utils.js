import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECERT is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //MS 7 days
    httpOnly: true, //prevent XSS attacks: cross-site scripting3
    sameSite: "strict", //CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true,
  });
  return token;
};

// http://localhost - http
// https://chatkaro - https secure
