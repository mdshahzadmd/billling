const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  addProductController,
  getAllProductsController,
  getProductController,
  deleteProductImageController,
  updateProductController,
  deleteProductController,
  getProductByCategoryController,
  getProductByNameController,
  getMobileLegendGameController,
} = require("../controllers/productCtrl");

// router object
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "productImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname.replace(/\s+/g, "-"));
  },
});

const upload = multer({ storage: storage });

// routes
router.post("/add-product", upload.array("images", 3), addProductController);
router.post(
  "/update-product",
  upload.array("images", 3),
  updateProductController
);
router.get("/get-all-products", getAllProductsController);
router.post("/get-product", getProductController);
router.post("/delete-product", deleteProductController);
router.delete("/delete-product-image", deleteProductImageController);
router.post("/product-by-category", getProductByCategoryController);
router.post("/get-product-by-name", getProductByNameController);
router.post("/get-mobile-legend", getMobileLegendGameController);

module.exports = router;
