const express = require("express");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils.js");
const {
  createProduct,
  getAllProducts,
  getProductByID,
} = require("../db/products.js");

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
      message: "Could not fetch all products. ",
    });
  }
});

// GET /api/products/id
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const product = await getProductByID(id);
    console.log(product);
    res.send({
      product,
    });
  } catch ({ name, message }) {
    next({
      name: "Error fetching product by ID",
      message: "Could not fetch product. ",
    });
  }
});

// POST /api/products/createProduct
productsRouter.post("/createProduct", async (req, res, next) => {
  // console.log("Request body: ", req.body);
  console.log("^^^");
  try {
    console.log("Request body: ", req.body);
    console.log(req.user, "username***");
    const seller_name = req.user.username;
    const { name, description, price, dimensions, quantity, tags } = req.body;
    console.log(
      name,
      seller_name,
      description,
      price,
      dimensions,
      quantity,
      tags,
      "&&&"
    );
    const product = await createProduct({
      name,
      seller_name,
      description,
      price,
      dimensions,
      quantity,
      tags,
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
