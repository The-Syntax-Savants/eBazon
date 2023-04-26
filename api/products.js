import express from "express";
import jwt from "jsonwebtoken";
import { requireUser, requireAdmin } from "./utils.js";
import {
  createProduct,
  getAllProducts,
  getProductByID,
  getProductsByTagId,
  getProductsBySeller,
  deleteProductByID,
  updateProduct,
} from "../db/products.js";
import { addTagsToProduct } from "../db/productTags.js";

export const productsRouter = express.Router();
export default productsRouter;

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
      product, //The reason we have to do product.product sometimes is because we wrap the fuckin object we are sending in yet another object. I think. -Emilio
    });
  } catch ({ name, message }) {
    next({
      name: "Error fetching product by ID",
      message: "Could not fetch product. ",
    });
  }
});

// GET /api/products/:tagId/tags
productsRouter.get("/:tagId/tags", async (req, res, next) => {
  try {
    const { tagId: id } = req.params;
    const products = await getProductsByTagId(id);
    if (products) {
      res.send(products);
    } else {
      next({
        name: "NoProducts",
        message: "No products exist with that tag",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET products for a seller
productsRouter.get("/seller/:seller_name", async (req, res, next) => {
  try {
    const { seller_name } = req.params;
    const products = await getProductsBySeller(seller_name);
    res.send({
      products,
    });
  } catch ({ name, message }) {
    next({
      name: "Error fetching products by seller",
      message: "Could not fetch products by seller.",
    });
  }
});

// POST /api/products/createProduct
productsRouter.post("/createProduct", requireUser, async (req, res, next) => {
  try {
    const seller_name = req.user.username;

    const { name, description, price, dimensions, quantity, tags, image_url } =
      req.body;
    const product = await createProduct({
      name,
      seller_name,
      description,
      price,
      dimensions,
      quantity,
      tags,
      image_url,
    });
    res.send({ product });
  } catch ({ name, message }) {
    next({
      name: "ErrorCreatingProduct",
      message: "Error Creating Product",
    });
  }
});

productsRouter.delete("/:id/delete", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getProductByID(id);
    if (product) {
      await deleteProductByID(id);
      res.send({ message: "Product has been successfully deleted" });
    } else {
      next({
        name: "ProductDoesNotExistError",
        message: `Product with id: ${id} does not exist`,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

productsRouter.patch("/:id/edit", requireUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const info = req.body;
    if (info.seller_name) {
      info.seller_name = undefined;
    }
    const test = await getProductByID(id);
    if (test) {
      if (req.user.username === test.seller_name || req.user.is_admin) {
        const product = await updateProduct(id, info);
        res.send(product);
      } else {
        next({
          name: "YouDoNotOwnThisProductError",
          message: "This product does not belong to you",
        });
      }
    } else {
      next({
        name: "ProductDoesNotExistError",
        message: `Product with id: ${id} does not exist`,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

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
