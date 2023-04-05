const express = require("express");
const jwt = require("jsonwebtoken");
const { requireUser, requireAdmin } = require("./utils.js");
const {
  createProduct,
  getAllProducts,
  getProductByID,
  deleteProductByID,
  updateProduct
} = require("../db/products.js");
const { addTagsToProduct } = require("../db/productTags.js");

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
productsRouter.post("/createProduct", requireUser, async (req, res, next) => {
  try {
    const seller_name = req.user.username;

    const { name, description, price, dimensions, quantity, tags } = req.body;
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

productsRouter.delete("/:id/delete", requireAdmin, async (req,res,next) => {
  try {
    const {id} = req.params
    const product = await getProductByID(id)
    if(product){
      await deleteProductByID(id)
      res.send({message: "Product has been successfully deleted"})
    }else{
      next({
        name: "ProductDoesNotExistError",
        message: `Product with id: ${id} does not exist`
      })
    }

  } catch ({name, message}) {
    next({name, message})
  }
})

productsRouter.patch("/:id/edit", requireUser, async(req,res,next) => {
  try {
    const {id} = req.params
    const info = req.body
    const test = await getProductByID(id)
    if(test){
      if(req.user.username === test.seller_name || req.user.is_admin){
        const product = await updateProduct(id, info)
        res.send(product)
      }else{
        next({
          name: "YouDoNotOwnThisProductError",
          message: "This product does not belong to you"
        })
      }
    }else{
      next({
        name: "ProductDoesNotExistError",
        message: `Product with id: ${id} does not exist`
      })
    }
  } catch ({name,message}) {
      next({name, message})
  }
})

// productsRouter.post("/:id/addTags", requireUser, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { tags } = req.body;
//     console.log(tags);
//     await addTagsToProduct(id, tags);
//     const product = await getProductByID(id);
//     if (product) {
//       res.send(product);
//     } else {
//       next({
//         name: "ProductNotFoundError",
//         message: "A product was not found with this id",
//       });
//     }
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });


module.exports = productsRouter;
