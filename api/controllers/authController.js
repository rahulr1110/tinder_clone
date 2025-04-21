import User from "../models/user.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;
  try {
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: "all fileds are required",
      });
    }
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "age must be at least 18",
      });
    }
    if (password < 6) {
      return res.status(400).json({
        success: false,
        message: "password must be at least 6",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    const token = signToken(newUser._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
      httpOnly: true, //prevent Xss attacks
      // sameSite: "strict", //prevent CSRF attacks
    });
    res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({ success: false, message: "server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fileds are required",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        messaage: "invalid email or password",
      });
    }
    const token = signToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
      httpOnly: true, //prevent Xss attacks
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log("error in login controller", error);
    res.status(500).json({ success: false, messaage: "server error" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, messaage: "logged out successfully" });
};
