const mongoose = require("mongoose");

const estimateHistorySchema = new mongoose.Schema({
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
  paymentGiven: {
    type: String,
  },
  discount: {
    type: String,
  },
  balancePayment: {
    type: String,
  },
  status: {
    type: String,
    default: "unpaid",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

const estimateHistoryModel = mongoose.model(
  "estimateHistory",
  estimateHistorySchema
);
module.exports = estimateHistoryModel;
