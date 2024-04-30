const userModel = require("../models/userModel");
const sendMail = require("./sendMail");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin callback
const adminController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Credentials" });
    }
    const isAdmin = user.isAdmin || false; // If isAdmin is undefined, default to false
    const token = jwt.sign({ id: user._id, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ success: true, message: "Login Successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: `Login Controller ${error.message}`,
    });
  }
};

// register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "Email Alreay Exists" });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ success: true, message: "Registration Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (isMatch) {
      user.lastLogin = new Date();
      await user.save();
    }
    return res
      .status(200)
      .send({ success: true, message: "Login Successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: `Login Controller ${error.message}`,
    });
  }
};

// Get User callback
const getUserController = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          gender: req.body.gender,
          dob: req.body.dob,
          state: req.body.state,
          city: req.body.city,
          class: req.body.class,
        },
      },
      { new: true }
    );
    if (!user) {
      res.status(200).send({ success: false, message: "Failed to update" });
    }
    res
      .status(201)
      .send({ success: true, success: "Profile Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: `Login Controller ${error.message}`,
    });
  }
};

// Auth Callback
const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Auth Error", error });
  }
};

const updateUserController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (!existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    }
    const userUpdate = await userModel.findOneAndUpdate(
      {
        email: req.body.email,
      },
      {
        $push: { address: req.body.address },
      },
      { new: true }
    );
    if (!userUpdate) {
      return res
        .status(201)
        .send({ success: false, message: "Failed to Update" });
    }
    res.status(202).send({
      success: true,
      message: "Profile Updated Successfully",
      data: userUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: `Update Ctrl ${error.message}` });
  }
};

const userProfileUpdateController = async (req, res) => {
  try {
    const userExist = await userModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res.status(200).send({
        success: false,
        message: "User Not Found",
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userUpdate = await userModel.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    if (!userUpdate) {
      return res.status(201).send({
        success: false,
        message: "Failed to update password",
      });
    }
    return res.status(202).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `User Profile Update Ctrl ${error.message}`,
    });
  }
};

// get all users
const getAllUserController = async (req, res) => {
  try {
    let users;
    if (req.body.country) {
      users = await userModel.find({
        email: { $ne: "01.mdshahzad@gmail.com" },
        gender: req.body.gender,
        country: req.body.country,
        isVerified: "Yes",
        isDeleted: "No",
      });
    } else {
      users = await userModel.find({
        email: { $ne: "01.mdshahzad@gmail.com" },
        gender: req.body.gender,
        isVerified: "Yes",
        isDeleted: "No",
      });
    }
    if (users.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No User Found",
      });
    }
    if (!Array.isArray(users)) {
      // Ensure users is an array
      users = [users];
    }
    users.forEach((user) => {
      user.mobile = undefined;
      user.email = undefined;
      user.isActive = undefined;
      user.password = undefined;
      user.isVerified = undefined;
      user.likesCount = undefined;
      user.contactCount = undefined;
      user.likesData = undefined;
      user.contactData = undefined;
      user.mobileVerified = undefined;
    });

    res.status(200).send({
      success: true,
      message: "User Fetched Successful",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Get All User Controller ${error.message}`,
    });
  }
};

// Delete all users
const DeleteUserController = async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "No User Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User Deleted Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: `Delete User Controller ${error.message}`,
    });
  }
};

// Send Mail
const sendMailController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "Email Not Registered With Us" });
    }
    const emailOtp = Math.floor(100000 + Math.random() * 900000);
    const savedOtpUser = await userModel.findOneAndUpdate(
      { email: req.body.email },
      { $set: { emailOtp: emailOtp } },
      { new: true }
    );
    if (!savedOtpUser) {
      return res
        .status(201)
        .send({ success: false, message: "Error In saving Otp" });
    }
    await sendMail(
      savedOtpUser?.email,
      "Email Verification OTP",
      emailOtp,
      req.body.msg
    );
    return res.status(203).send({
      success: true,
      message: "Otp Send Successfully",
      data: savedOtpUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Send Mail Controller ${error.message}`,
    });
  }
};
// Verify Email OTP
const verifyOtpController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    }
    if (user.emailOtp !== req.body.userEnteredOtp) {
      return res
        .status(201)
        .send({ success: false, message: "Failed: Incorrect OTP" });
    } else {
      const updateUser = await userModel.findOneAndUpdate(
        { email: req.body.email },
        { $set: { isActive: "Yes" } },
        { new: true }
      );
      if (!updateUser) {
        return res
          .status(200)
          .send({ success: false, message: "Failed to Verify" });
      }
      return res.status(202).send({
        success: true,
        message: "Email Verification Successful",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Verify Otp Controller ${error.message}`,
    });
  }
};

// send mobile sms otp
const sendSMSController = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "Email Not Registered With Us" });
    }
    const smsOTP = Math.floor(100000 + Math.random() * 900000);
    await sendSMS(smsOTP, mobile);
    const savedOtpUser = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { mobileOtp: smsOTP, mobile: mobile } },
      { new: true }
    );
    if (!savedOtpUser) {
      return res
        .status(201)
        .send({ success: false, message: "Error In saving Otp" });
    }
    return res.status(202).send({
      success: true,
      message: "Otp Send Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Send Mail Controller ${error.message}`,
    });
  }
};

const verifyMobileController = async (req, res) => {
  const message =
    req.body.message === "Profile"
      ? "Profile Created Successfully"
      : "Mobile Verified Successfully";
  try {
    const userExist = await userModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    }

    if (userExist.mobileOtp !== req.body.otp) {
      return res.status(200).send({ success: false, message: "Incorrect OTP" });
    } else {
      const updateUser = await userModel.findOneAndUpdate(
        { email: req.body.email },
        { $set: { mobileVerified: "Yes" } },
        { new: true }
      );
      if (!updateUser) {
        return res
          .status(200)
          .send({ success: false, message: "Failed to Verify" });
      }
      return res.status(202).send({
        success: true,
        message: message,
        data: updateUser,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: `Verify Mobile Ctrl ${error.message}` });
  }
};

const updatePassController = async (req, res) => {
  try {
    const userExist = await userModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    }
    const password = req.body.pass;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    if (!user) {
      return res
        .status(201)
        .send({ success: false, message: "Failed to update password" });
    }
    res
      .status(202)
      .send({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Update Pass Controller ${error.message}`,
    });
  }
};

const subscribeController = async (req, res) => {
  try {
    const emailExist = await subscribeModel.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(200).send({
        success: false,
        message: "You have been successfully subscribed to us.",
      });
    }
    const newEmail = new subscribeModel(req.body);
    await newEmail.save();
    return res.status(200).send({
      success: true,
      message: "You have been successfully subscribed to us.",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Subcribe Controller ${error.message}`,
    });
  }
};

const checkPlayerController = async (req, res) => {
  try {
    //! LOGIN
    const adminLogin = {
      login: process.env.LOGIN,
      password: process.env.PASSWORD,
    };
    console.log("Before Axios request");
    const login = await axios.post(
      "https://api.bigpapastore.com/v1/login",
      adminLogin
    );
    console.log("After Axios request");
    let player;
    if (login.data.status === "ACTIVE") {
      player = await axios.post(
        "https://api.bigpapastore.com/v1/check-player",
        {
          userid: req.body.userid,
          zoneid: req.body.zoneid,
        },
        {
          headers: {
            Authorization: "Bearer " + login.data.token,
          },
        }
      );
      console.log("After Axios request");
      if (player.data.status === 200) {
        return res.status(200).send({
          success: true,
          data: player.data.username,
        });
      } else if (player.data.status === 201) {
        return res.status(201).send({
          success: false,
          message: "User id or Zone id doest not exits",
        });
      } else if (player.data.status === 203) {
        return res.status(203).send({
          success: false,
          message:
            "There is a problem with the network connection. Please try again!",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Check Player Ctrl ${error.message}`,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  getAllUserController,
  DeleteUserController,
  getUserController,
  sendMailController,
  verifyOtpController,
  updatePassController,
  updateUserController,
  verifyMobileController,
  sendSMSController,
  adminController,
  subscribeController,
  userProfileUpdateController,
  checkPlayerController,
};
