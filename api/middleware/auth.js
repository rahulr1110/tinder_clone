import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;

    next();
  } catch (error) {
    console.log("error in auth middleware", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
};
