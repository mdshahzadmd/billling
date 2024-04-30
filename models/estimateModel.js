const mongoose = require("mongoose");

const estimateSchema = new mongoose.Schema({
  estimateId: {
    type: Object,
  },
  totalValue: {
    type: String,
  },
  invoice: {
    type: Object,
  },
  billingTo: {
    type: Object,
  },
  products: {
    type: Array,
  },
  advancePayment: {
    type: String,
  },
  discount: {
    type: String,
  },
  balancePayment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "unpaid",
  },
  dueDate: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const estimateModel = mongoose.model("estimate", estimateSchema);
module.exports = estimateModel;
