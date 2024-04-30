const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
  quotationId: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

const quotationModel = mongoose.model("quotation", quotationSchema);
module.exports = quotationModel;
