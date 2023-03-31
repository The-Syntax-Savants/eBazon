const express = require("express");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils.js");
const { createProduct, getAllProducts } = require("../db/products.js");

const productsRouter = express.Router();

productsRouter.use((req, res, next) => {
  console.log("A request is being made to /products");
  next();
});

// GET /api/products/
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send({
      products,
    });
  } catch ({ name, message }) {
    next({
      name: "Error fetching allProducts",
      message: "Could not fetch all products. bitch. ",
    });
  }
});

// POST /api/products/createProduct
productsRouter.post("/createProduct", requireUser, async (req, res, next) => {
  try {
    const { name, seller_name, description, price, dimensions, quantity } =
      req.body;
    const product = await createProduct({
      name,
      seller_name,
      description,
      price,
      dimensions,
      quantity,
    });
    res.send({ product });
  } catch ({ name, message }) {
    next({
      name: "ErrorCreatingProduct",
      message: "Error Creating Product",
    });
  }
});

module.exports = productsRouter;
