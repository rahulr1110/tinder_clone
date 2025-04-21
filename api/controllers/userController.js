import cloudinary from "../config/cloudinary.js";
import User from "../models/user.js";

export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;
    let updatedData = otherData;
    if (image) {
      if (image.startsWith("data:image")) {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(image);
          updatedData.image = uploadedResponse.secure_url;
        } catch (error) {
          console.error("error uploading image", error);
          return res.status(400).json({
            success: false,
            message: "error uploading image",
          });
        }
      }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("error in updateProfile", error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
