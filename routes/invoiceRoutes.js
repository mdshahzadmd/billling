const express = require("express");
const multer = require("multer");
const {
  addInvoiceController,
  getAllInvoiceController,
  getInvoiceByIdController,
  updateInvoiceController,
} = require("../controllers/invoiceCtrl");

// router object
const router = express.Router();

router.post("/add-invoice", addInvoiceController);
router.post("/update-invoice", updateInvoiceController);
router.get("/get-all-invoice", getAllInvoiceController);
router.post("/get-invoice-by-id", getInvoiceByIdController);

module.exports = router;
