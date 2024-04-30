const invoiceModel = require("../models/invoiceModel");

const addInvoiceController = async (req, res) => {
  try {
    const invoice = await invoiceModel.findOne({
      invoiceId: req.body.invoiceId,
    });
    if (invoice) {
      return res
        .status(201)
        .send({ success: false, message: "Invoice Id Already Found" });
    }

    const iLength = await invoiceModel.countDocuments({});
    const newInvoice = new invoiceModel({
      ...req.body,
      invoiceId: `IN${iLength + 1}`,
    });
    await newInvoice.save();
    return res
      .status(200)
      .send({ success: true, message: "Invoice Added Successfull" });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const updateInvoiceController = async (req, res) => {
  try {
    const invoice = await invoiceModel.findOne({
      invoiceId: req.body.invoiceId,
    });
    if (!invoice) {
      return res
        .status(201)
        .send({ success: false, message: "Invoice Not Found" });
    }
    const updateInvoice = await invoiceModel.findOneAndUpdate(
      {
        invoiceId: req.body.invoiceId,
      },
      { $set: req.body },
      { new: true }
    );
    if (!updateInvoice) {
      return res
        .status(202)
        .send({ success: false, message: "Failed to update" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Invoice Updated Successfull" });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const getAllInvoiceController = async (req, res) => {
  try {
    const invoices = await invoiceModel.find({});
    if (invoices.length === 0) {
      return res
        .status(201)
        .send({ success: false, message: "No Invoice Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Invoice Fetched Success",
      data: invoices,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const getInvoiceByIdController = async (req, res) => {
  try {
    const invoice = await invoiceModel.findOne({
      invoiceId: req.body.invoiceId,
    });
    if (!invoice) {
      return res
        .status(201)
        .send({ success: false, message: "No Invoice Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Invoice Fetched Success",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  addInvoiceController,
  updateInvoiceController,
  getAllInvoiceController,
  getInvoiceByIdController,
};
