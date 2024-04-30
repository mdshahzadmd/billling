const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const invoiceModel = require("../models/invoiceModel");
const estimateModel = require("../models/estimateModel");
const quotationModel = require("../models/quotationModel");

const getAllClientsController = async (req, res) => {
  try {
    const allUser = await userModel.find({
      email: { $ne: "01.mdshahzad@gmail.com" },
    });
    if (!allUser) {
      return res.status(200).send({ success: false, message: "No User Found" });
    }
    return res.status(200).send({
      success: true,
      message: "All Users Fetched Sucesss",
      data: allUser,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: `Get All User Ctrl ${error.message}` });
  }
};

const addClientController = async (req, res) => {
  try {
    const client = await userModel.findOne({ email: req.body.email });
    if (client) {
      return res
        .status(200)
        .send({ success: false, message: "Email Alreay Exists" });
    }
    const newUser = new userModel(req.body);
    await newUser.save();
    return res.status(200).send({
      success: true,
      message: "Client Added Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Get All Queries Ctrl ${error.message}`,
    });
  }
};

const getClientController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.id });
    if (!user) {
      return res.status(200).send({ success: false, message: "No User Found" });
    }
    return res.status(200).send({
      success: true,
      message: "All Users Fetched Sucesss",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: `Get User Ctrl ${error.message}` });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({ _id: req.body.id });
    if (!user) {
      return res.status(200).send({ success: false, message: "No User Found" });
    }
    return res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: `Delete User Ctrl ${error.message}` });
  }
};

const editUserController = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).send({
        success: false,
        message: "Id is required in the request body",
      });
    }
    const updateUser = await userModel.findOneAndUpdate(
      { _id },
      { $set: req.body },
      { new: true }
    );
    if (!updateUser) {
      return res.status(200).send({
        success: false,
        message: "Failed to Update User",
      });
    }
    return res
      .status(201)
      .send({ success: true, message: "User Updated Successfully" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Admin Edit User Ctrl ${error.message}`,
    });
  }
};

const adminDashboardController = async (req, res) => {
  try {
    //products
    const productCount = await productModel.countDocuments({});
    //invoice
    const invoiceCount = await invoiceModel.countDocuments({});
    const invoices = await invoiceModel.find({});
    //estimtate
    const estimateCount = await estimateModel.countDocuments({});
    const estimates = await estimateModel.find({});
    //quotation
    const quotationCount = await quotationModel.countDocuments({});
    const quotations = await quotationModel.find({});
    return res.status(200).send({
      success: true,
      message: "Dashboard Fetched",
      data: {
        productCount,
        invoiceCount,
        invoices,
        estimateCount,
        estimates,
        quotationCount,
        quotations,
      },
    });
  } catch (error) {
    console.error(`Send Mail to Incomplete Profiles Ctrl: ${error.message}`);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const adminDeleteInvoiceController = async (req, res) => {
  try {
    const invoice = await invoiceModel.findOne({
      invoiceId: req.body.invoiceId,
    });
    if (!invoice) {
      return res.status(201).send({
        success: false,
        message: "No Invoice Found",
      });
    }
    const deleteInvoice = await invoiceModel.findOneAndDelete({
      invoiceId: req.body.invoiceId,
    });
    if (!deleteInvoice) {
      return res.status(201).send({
        success: false,
        message: "Failed to delete",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Invoice Deleted Successfully",
    });
  } catch (error) {
    console.error(`Send Mail to Incomplete Profiles Ctrl: ${error.message}`);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const adminDeleteEstimateController = async (req, res) => {
  try {
    const estimate = await estimateModel.findOne({
      estimateId: req.body.estimateId,
    });
    if (!estimate) {
      return res.status(201).send({
        success: false,
        message: "No Estimate Found",
      });
    }
    const deleteEstimate = await estimateModel.findOneAndDelete({
      estimateId: req.body.estimateId,
    });
    if (!deleteEstimate) {
      return res.status(201).send({
        success: false,
        message: "Failed to delete",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Estimate Deleted Successfully",
    });
  } catch (error) {
    console.error(`Send Mail to Incomplete Profiles Ctrl: ${error.message}`);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

const adminDeleteQuotationController = async (req, res) => {
  try {
    const quotation = await quotationModel.findOne({
      quotationId: req.body.quotationId,
    });
    if (!quotation) {
      return res.status(201).send({
        success: false,
        message: "No Quotation Found",
      });
    }
    const deleteQuotation = await quotationModel.findOneAndDelete({
      quotationId: req.body.quotationId,
    });
    if (!deleteQuotation) {
      return res.status(201).send({
        success: false,
        message: "Failed to delete",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Quotation Deleted Successfully",
    });
  } catch (error) {
    console.error(`Send Mail to Incomplete Profiles Ctrl: ${error.message}`);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAllClientsController,
  addClientController,
  getClientController,
  deleteUserController,
  editUserController,
  adminDashboardController,
  adminDeleteInvoiceController,
  adminDeleteEstimateController,
  adminDeleteQuotationController,
};
