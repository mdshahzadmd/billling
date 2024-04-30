const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  hsnCode: {
    type: String,
    required: [true, "Hsn Code is required"],
  },
  length: {
    type: Number,
  },
  breadth: {
    type: Number,
  },
  cgst: {
    type: Number,
  },
  sgst: {
    type: Number,
  },
  gst: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
