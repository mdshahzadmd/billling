const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: Object,
  },
  totalTaxableValue: {
    type: String,
  },
  totalCgst: {
    type: String,
  },
  totalSgst: {
    type: String,
  },
  grandTotal: {
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

const invoiceModel = mongoose.model("invoice", invoiceSchema);
module.exports = invoiceModel;
