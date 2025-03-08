import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied!" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
