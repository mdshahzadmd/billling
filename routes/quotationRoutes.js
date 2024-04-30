const express = require("express");
const {
  updateQuotationController,
  getAllQuotationController,
  getQuotationByIdController,
  addQuotationController,
} = require("../controllers/quotationCtrl");

// router object
const router = express.Router();

router.post("/add-quotation", addQuotationController);
router.get("/get-all-quotation", getAllQuotationController);
router.post("/update-quotation", updateQuotationController);
router.post("/get-quotation-by-id", getQuotationByIdController);

module.exports = router;
