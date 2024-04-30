const express = require("express");
const {
  editUserController,
  deleteUserController,
  sendMailToIncompleteUsersController,
  addClientController,
  getAllClientsController,
  getClientController,
  adminDashboardController,
  adminGetAllUsersController,
  adminDeleteInvoiceController,
  adminDeleteEstimateController,
  adminDeleteQuotationController,
} = require("../controllers/AdminCtrl");

// router object
const router = express.Router();

// ============== CLIENTS
router.post("/add-client", addClientController);
router.post("/get-client", getClientController);
router.get("/get-all-clients", getAllClientsController);
router.post("/delete-user", deleteUserController);
router.post("/admin-edit-user", editUserController);
//DASHBOARD
router.get("/admin-dashboard", adminDashboardController);
// DELETE
router.post("/delete-invoice", adminDeleteInvoiceController);
router.post("/delete-estimate", adminDeleteEstimateController);
router.post("/delete-quotation", adminDeleteQuotationController);

module.exports = router;
