const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    default: null,
  },
  emailOtp: {
    type: String,
  },
  password: {
    type: String,
  },
  userGst: {
    type: String,
  },
  name: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
