const express = require("express");
const router = express.Router();
const User = require("../modals/user_modal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMid = require("../middlewares/authMid");
const upload = require("../middlewares/multerMId")
const cloudinary = require("../middlewares/cloudinaryMId")

router.post("/signup", async (req, res) => {
  try {
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
      return res
        .status(200)
        .json({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;

    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .json({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", success: false });
  }
});

router.post("/get-user-info", authMid, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._Id });
    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.firstname,
          email: user.email,
        },
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error getting user info",
      success: false,
      error,
    });
  }
});

router.post('/addUserImage', authMid, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'react_app', // Set the folder in Cloudinary where you want to store the images
    });

    // Save the Cloudinary image URL to the user document in the database
    const userId = req.body._id; // Assuming you have the user ID from authentication
    console.log(req.body._id);
    await User.findByIdAndUpdate(userId, { image: result.secure_url });

    // Respond with success
    res.status(200).json({ message: 'File uploaded successfully', image: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during file upload' });
  }
});

module.exports = router;
