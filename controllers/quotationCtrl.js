const quotationModel = require("../models/quotationModel");

const addQuotationController = async (req, res) => {
  try {
    const quotation = await quotationModel.findOne({
      quotationId: req.body.quotationId,
    });
    if (quotation) {
      return res
        .status(201)
        .send({ success: false, message: "Quotation Id Already Found" });
    }
    const qLength = await quotationModel.countDocuments({});
    const newInvoice = new quotationModel({
      ...req.body,
      quotationId: `QT${qLength + 1}`,
    });
    await newInvoice.save();
    return res
      .status(200)
      .send({ success: true, message: "Quotation Added Successfull" });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const updateQuotationController = async (req, res) => {
  try {
    const invoice = await quotationModel.findOne({
      quotationId: req.body.quotationId,
    });
    if (!invoice) {
      return res
        .status(201)
        .send({ success: false, message: "Quotation Not Found" });
    }
    const updateInvoice = await quotationModel.findOneAndUpdate(
      {
        quotationId: req.body.quotationId,
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
      .send({ success: true, message: "Quotation Updated Successfull" });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const getAllQuotationController = async (req, res) => {
  try {
    const invoices = await quotationModel.find({});
    if (invoices.length === 0) {
      return res
        .status(201)
        .send({ success: false, message: "No Quotation Found" });
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

const getQuotationByIdController = async (req, res) => {
  try {
    const invoice = await quotationModel.findOne({
      quotationId: req.body.quotationId,
    });
    if (!invoice) {
      return res
        .status(201)
        .send({ success: false, message: "No Quotation Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Quotation Fetched Success",
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
  addQuotationController,
  updateQuotationController,
  getAllQuotationController,
  getQuotationByIdController,
};
