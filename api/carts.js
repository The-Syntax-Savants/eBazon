import express from "express";
import { requireUser } from "./utils.js";
import {
  createCart,
  getActiveCartByUsername,
  getInactiveCartsByUsername,
  updateCart,
} from "../db/carts.js";
import {
  createCartProduct,
  getCartProductsByCartId,
  deleteCartProduct,
  updateCartProduct,
  getAllCartProducts,
  getAllCarts,
} from "../db/cartsProducts.js";
import { getProductByID } from "../db/products.js";

export const cartsRouter = express.Router();

cartsRouter.use((req, res, next) => {
  console.log("A request is being made to /carts");

  next();
});

cartsRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "Carts is healthy" });
  } catch (error) {
    next(error);
  }
});

cartsRouter.post("/place-order", requireUser, async (req, res, next) => {
  try {
    const cart = await getActiveCartByUsername(req.user.username);

    const { cartNumber } = req.body;

    if (cartNumber === cart.id) {
      if (
        // cart.city &&
        // cart.state &&
        // cart.address_line_1 &&
        // cart.address_line_2 &&
        // cart.zipcode
        true
      ) {
        //close the current cart for user
        updateCart({ id: cart.id, is_complete: true });
        //make a new cart for the user
        const newCart = await createCart({
          username: req.user.username,
          is_complete: false,
          city: null,
          state: null,
          zipcode: null,
          address_line_1: null,
          address_line_2: null,
          price: 0,
          time_of_purchase: null,
        });

        res.send(newCart);
      } else {
        console.log("Please fill out all fields before placing order");
      }
    } else {
      next({
        name: "ErrorPlacingOrder",
        message: "You do not have access to place this order",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

cartsRouter.get("/my-cart-number", requireUser, async (req, res, next) => {
  try {
    const cart = await getActiveCartByUsername(req.user.username);
    res.send({ cartId: cart.id });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

cartsRouter.patch("/edit-address", requireUser, async (req, res, next) => {
  try {
    const { city, state, address_line_1, address_line_2, zipcode } = req.body;

    const cart = await getActiveCartByUsername(req.user.username);

    const newCart = await updateCart({
      id: cart.id,
      city,
      state,
      address_line_1,
      address_line_2,
      zipcode,
    });
    res.send(newCart);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Go to users cart page
cartsRouter.get("/my-cart", async (req, res, next) => {
  try {
    const cart = await getActiveCartByUsername(req.user.username);
    const cartProducts = await getCartProductsByCartId(cart.id);

    const cartProductsWithProducts = await Promise.all(
      cartProducts.map(async (cartProduct) => {
        const product = await getProductByID(cartProduct.product_id);
        return { ...cartProduct, product };
      })
    );
    res.send(cartProductsWithProducts);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

cartsRouter.get(
  "/order-history/:username",
  requireUser,
  async (req, res, next) => {
    try {
      const carts = await getInactiveCartsByUsername(req.user.username);

      // wait for all promises to resolve before proceeding
      const cartsWithProducts = await Promise.all(
        carts.map(async (cart) => {
          const cartProducts = await getCartProductsByCartId(cart.id);
          return { ...cart, cartProducts };
        })
      );
      res.send(cartsWithProducts);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

cartsRouter.post("/add-to-cart", requireUser, async (req, res, next) => {
  try {
    // Receive product_id from req.body
    const { product_id } = req.body;
    // Get active cart for user
    const cart = await getActiveCartByUsername(req.user.username);
    const cartProducts = await getCartProductsByCartId(cart.id);

    let productFound = false;
    cartProducts.forEach(async (element) => {
      if (element.product_id === product_id) {
        // Update quantity if cartProduct already exists
        productFound = true;
        const updatedCartProduct = await updateCartProduct({
          id: element.id,
          quantity: element.quantity + 1,
        });
        res.send(updatedCartProduct);
      }
    });

    // If product not found in cart, add it to the cart
    if (!productFound) {
      // Add the new cartProduct
      const newCartProduct = await createCartProduct({
        username: req.user.username,
        product_id: product_id,
        quantity: 1,
      });
      res.send(newCartProduct);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

cartsRouter.delete("/remove-from-cart", requireUser, async (req, res, next) => {
  try {
    const cartProductId = req.body.cartProductId;
    const cartProduct = await deleteCartProduct(cartProductId);
    res.send(cartProduct);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

cartsRouter.patch("/update-quantity", requireUser, async (req, res, next) => {
  try {
    const { cartProductId, quantity } = req.body;
    const cartProduct = await updateCartProduct({
      id: cartProductId,
      quantity,
    });
    res.send(cartProduct);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

cartsRouter.get("/allCartProducts", async (req, res) => {
  const cartProducts = await getAllCartProducts();

  res.send({
    cartProducts,
  });
});

cartsRouter.get("/allCarts", async (req, res) => {
  const carts = await getAllCarts();

  res.send({
    carts,
  });
});

export default cartsRouter;
