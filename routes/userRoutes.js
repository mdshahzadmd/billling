const express = require("express");
const {
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
  adminController,
  subscribeController,
  userProfileUpdateController,
  checkPlayerController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

// router object
const router = express.Router();
// routes
router.post("/admin", adminController);
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/update-user", updateUserController);
router.post("/user-profile-update", userProfileUpdateController);
router.post("/user", getUserController);
router.post("/getUserData", authMiddleware, authController);
router.post("/get-all-users", getAllUserController);
router.post("/delete-user", DeleteUserController);
router.post("/send-otp", sendMailController);
router.post("/verify-otp", verifyOtpController);
router.post("/update-pass", updatePassController);
router.post("/subscribe", subscribeController);
router.post("/check-player", checkPlayerController);

// router.post("/get-payment-method", getUserPaymentDetailsController);

module.exports = router;
