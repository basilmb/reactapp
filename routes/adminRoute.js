const express = require("express");
const router = express.Router();
const User = require("../modals/user_modal");
const jwt = require("jsonwebtoken");
const authMid = require("../middlewares/ad_authMid");

const name = "basil";
const password = "505050";
const _id = "64c0cdf05282ca3a74eda209";

router.post("/login", async (req, res) => {
  try {
    let admin;
    if (req.body.name == name) {
      admin = true;
    }
    if (!admin) {
      return res
        .status(404)
        .json({ message: "admin does not exist", success: false });
    }

    let isMatch;
    if (req.body.password == password) {
      isMatch = true;
    }
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: _id }, process.env.JWT_SECRET, {
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
    if (req.body._Id == _id) {
      const user = await User.find().lean();
      if (!user) {
        return res.status(200).send({
          message: "User does not exist",
          success: false,
        });
      } else {
        res.status(200).send({
          success: true,
          userDetails: user,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Error getting user info",
      success: false,
      error,
    });
  }
});

router.post("/deleteUser/:id", authMid, async (req, res) => {
  try {
    if (req.body._Id == _id) {
      const userId = req.params.id;
      console.log(userId);
      if (userId) {
        await User.deleteOne({ _id: userId });
        res.status(200).json({ message: "Deleted successfuly", success: true });
      } else {
        return res.status(200).send({
          message: "User does not exist",
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deletion", success: false });
  }
});

router.post("/editUser", authMid, async (req, res) => {
  try {
    if (req.body._Id == _id) {
      let edited = false;
  
      const { userId, editedFname, editedLname, editedEmail, editedPhone } = req.body;
  
      const user = await User.findById(userId);
  
      if (user) {
        User.updateOne(
          { _id: userId },
          {
            $set: {
              firstname: editedFname,
              lastname: editedLname,
              phone: editedPhone,
              email: editedEmail,
            },
          }
        ).then(() => {
          edited = true;
          res.status(200).json({ message: "Edited successfuly", success: true });
        });
      } else {
        res.status(500).json({ message: "User does not exist", success: false });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deletion", success: false });
  }
});
module.exports = router;
