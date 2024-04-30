const productModel = require("../models/productModel");
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const querystring = require("querystring");
const md5 = require("md5");

const addProductController = async (req, res) => {
  try {
    let product = await productModel.findOne({ name: req.body.name });
    if (product) {
      return res.status(200).send({
        success: false,
        message: "Product with this name already exists",
      });
    }
    // Create a new product if it doesn't exist
    product = new productModel(req.body);
    await product.save();

    res.status(200).send({
      message: "Product added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const allProducts = await productModel.find({});
    if (allProducts.length === 0) {
      return res
        .status(200)
        .send({ success: false, message: "No Products Found" });
    }
    res.status(201).send({
      success: true,
      message: "Products Fetched Success",
      data: allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Get All Products Controller ${error.message}`,
    });
  }
};

const getProductController = async (req, res) => {
  try {
    const product = await productModel.find({ _id: req.body.id });
    if (product.length === 0) {
      return res
        .status(200)
        .send({ success: false, message: "No Product Found" });
    }
    res.status(201).send({
      success: true,
      message: "Product Fetched Success",
      data: product[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Get All Products Controller ${error.message}`,
    });
  }
};

const deleteProductImageController = async (req, res) => {
  try {
    const { id, imagePath } = req.body;
    const product = await productModel.findOne({ _id: id });
    if (!product) {
      return res
        .status(200)
        .send({ success: false, message: "Product not found" });
    }
    const index = product.images.indexOf(imagePath);
    if (index !== -1) {
      product.images.splice(index, 1);
      await product.save();
      fs.unlinkSync(imagePath); // Make sure to import 'fs' at the top
      return res.status(200).send({
        message: "Image deleted successfully",
        success: true,
      });
    } else {
      return res
        .status(200)
        .send({ success: false, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ _id: req.body._id });
    if (!product) {
      return res
        .status(201)
        .send({ success: false, message: "No product found" });
    }
    const updateProduct = await productModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { new: true }
    );
    if (!updateProduct) {
      return res
        .status(201)
        .send({ success: false, message: "Failed to update" });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product. Please try again later.",
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById({ _id: id });
    if (!product) {
      return res.status(201).send({
        success: false,
        message: "No product found",
      });
    }
    const deleteProduct = await productModel.findByIdAndDelete({ _id: id });
    if (!deleteProduct) {
      return res.status(202).send({
        success: false,
        message: "Error deleting product. Please try again later.",
      });
    }
    return res
      .status(200)
      .send({ success: true, message: "Product Deleted Successful" });
  } catch (error) {
    res.status(500).send({
      message: `Delete Product Ctrl ${error.message}`,
      success: false,
    });
  }
};

// USER PRODUCT PAGE API'S
const getProductByCategoryController = async (req, res) => {
  try {
    const products = await productModel.find({ category: req.body.title });
    if (!products) {
      return res
        .status(200)
        .send({ success: false, message: "No Product Found" });
    }
    return res.status(200).send({
      success: true,
      message: "Product Fetched Successful",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      message: `Product By Category Ctrl ${error.message}`,
      success: false,
    });
  }
};

const getProductByNameController = async (req, res) => {
  try {
    const product = await productModel.findOne({ name: req.body.name });
    if (!product) {
      return res.status(200).send({
        success: false,
        message: "No Product Found",
      });
    }
    return res.status(201).send({
      success: true,
      message: "Product Fetched Success",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      message: `Product By Name Ctrl ${error.message}`,
      success: false,
    });
  }
};

const getMobileLegendGameController = async (req, res) => {
  try {
    const { region } = req.body;
    const uid = process.env.UID;
    const email = process.env.EMAIL;
    const product = "mobilelegends";
    const time = Math.floor(Date.now() / 1000);
    const mKey = process.env.KEY;
    // GENERATING SIGN
    const signArr = {
      uid,
      email,
      product,
      time,
    };
    const sortedSignArr = Object.fromEntries(Object.entries(signArr).sort());
    const str =
      Object.keys(sortedSignArr)
        .map((key) => `${key}=${sortedSignArr[key]}`)
        .join("&") +
      "&" +
      mKey;
    const sign = md5(md5(str));
    const formData = querystring.stringify({
      uid,
      email,
      product,
      time,
      sign,
    });
    let apiUrl =
      region === "brazil"
        ? "https://www.smile.one/br/smilecoin/api/productlist"
        : "https://www.smile.one/ph/smilecoin/api/productlist";
    let apiProduct;
    apiProduct = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (apiProduct.data.status === 200) {
      return res.status(200).send({
        success: true,
        message: "success",
        data: apiProduct.data.data,
      });
    } else {
      console.log("Failed:", apiProduct.data.message);
    }
  } catch (smileOneError) {
    console.error("Error during Smile One order creation:", smileOneError);
    res.status(500).json({ error: "Error during Smile One order creation" });
  }
};

module.exports = {
  addProductController,
  getAllProductsController,
  getProductController,
  deleteProductImageController,
  updateProductController,
  deleteProductController,
  getProductByCategoryController,
  getProductByNameController,
  getMobileLegendGameController,
};
