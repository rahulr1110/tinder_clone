import User from "../models/user.js";
import { getConnectedUser } from "../socket/socket.server.js";

export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);
    console.log(likedUser);
    console.log(currentUser);

    if (!likedUserId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!currentUser.likes.includes(likedUser)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      if (likedUser.likes.includes(currentUser.id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser);

        await Promise.all([await currentUser.save(), await likedUser.save()]);

        //send notificatio to other user
        //io.emmit
        const connectedUsers = getConnectedUser();
        const likedUserSocketId = connectedUsers.get(likedUserId);

        if (likedUserSocketId) {
          io.to(likedUserSocketId).emit("newMatch", {
            _id: currentUser._id,
            name: currentUser.name,
            image: currentUser.image,
          });
        }
        const currentSocketId = connectedUsers.get(currentUser._id.toString());
        if (currentSocketId) {
          io.to(currentSocketId).emit("newMatch", {
            _id: likedUser._id,
            name: likedUser.name,
            image: likedUser.image,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log("error in swipeLeft", error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
export const swipeLeft = async (req, res) => {
  try {
    const { dislikesUserId } = req.params;

    const currentUser = await User.findById(req.user.id);
    console.log(dislikesUserId);
    console.log(currentUser);
    if (!currentUser.dislikes.includes(dislikesUserId)) {
      currentUser.dislikes.push(dislikesUserId);
      await currentUser.save();
    }
    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log("error in swipe left", error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
export const getmatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );
    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (error) {
    console.log("error in getMatches", error);
    res.status(500).json({
      success: false,
      message: "internal srever error",
    });
  }
};
export const getUserprofiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } },
      ],
    });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("error in getUserProfiles", error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
