const express = require("express");
const {
  addEstimateController,
  updateEsimateController,
  getAllEsimateController,
  getEsimateByIdController,
  getAllEstimateHistoryController,
  deleteEstimateHistoryController,
} = require("../controllers/estimateCtrl");

// router object
const router = express.Router();

router.post("/add-estimate", addEstimateController);
router.post("/update-estimate", updateEsimateController);
router.get("/get-all-estimate", getAllEsimateController);
router.post("/get-estimate-by-id", getEsimateByIdController);
// ESTIMATE HISTORY
router.get("/get-all-estimate-history", getAllEstimateHistoryController);
router.post("/delete-est-history", deleteEstimateHistoryController);

module.exports = router;
