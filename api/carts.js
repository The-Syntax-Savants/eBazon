import express from "express";
import { requireUser } from "./utils.js";
import {
  createCart,
  getActiveCartByUsername,
  getInactiveCartsByUsername,
  updateCart,
} from "../db/carts.js";
import {
  getCartProductsByCartId,
  createCartProduct,
  updateCartProduct,
  deleteCartProduct,
} from "../db/cartProducts.js";

export const cartsRouter = express.Router();
export default cartsRouter;

cartsRouter.use((req, res, next) => {
  console.log("A request is being made to /carts");

  next();
});

cartsRouter.get("/:username", requireUser, async (req, res, next) => {
  try {
  } catch ({ name, message }) {
    throw { name, message };
  }
});

cartsRouter.post("/place-order", requireUser, async (req, res, next) => {
  try {
    const cart = await getActiveCartByUsername(req.user.username);

    if (
      cart.city &&
      cart.state &&
      cart.address_line_1 &&
      cart.address_line_2 &&
      cart.zipcode
    ) {
      //close the current cart for user
      updateCart({ id: cart.id, isComplete: true });
      //make a new cart for the user
      const newCart = createCart({
        username: req.user.username,
        isComplete: false,
      });

      res.send(newCart);
    } else {
      console.log("Please fill out all fields before placing order");
    }
  } catch ({ name, message }) {
    throw { name, message };
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
    throw { name, message };
  }
});

// cartsRouter.get(
//   "/order-history/:username",
//   requireUser,
//   async (req, res, next) => {
//     try {
//       const carts = await getInactiveCartsByUsername(req.user.username);

//       carts.map(async (cart) => {
//         cart.cartProducts = await getCartProductsByCartId(cart.id);
//         console.log(cart);
//       });
//       res.send(carts);
//     } catch ({ name, message }) {
//       throw { name, message };
//     }
//   }
// );

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
          console.log(cart);
          return { ...cart, cartProducts };
        })
      );
      res.send(cartsWithProducts);
    } catch ({ name, message }) {
      throw { name, message };
    }
  }
);

cartsRouter.post("/add-to-cart", requireUser, async (req, res, next) => {
  try {
    //receive productId from req.body
    const { productId } = req.body;
    // get active cart for user
    const cart = await getActiveCartByUsername(req.user.username);
    const cartProducts = await getCartProductsByCartId(cart.id);

    let productFound = false;
    cartProducts.array.forEach(async (element) => {
      if (element.productId === productId) {
        // update quantity if cartProduct already exists
        productFound = true;
        const updatedCartProduct = await updateCartProduct({
          id: element.id,
          quantity: element.quantity + 1,
        });
        res.send(updatedCartProduct);
      }
    });

    //create cartProduct if it isn't in your cart already
    if (!productFound) {
      const newCartProduct = await createCartProduct({
        id: cart.id,
        productId,
        quantity: 1,
      });
      res.send(newCartProduct);
    }
  } catch ({ name, message }) {
    throw { name, message };
  }
});

cartsRouter.delete("/remove-from-cart", requireUser, async (req, res, next) => {
  try {
    const cartProductId = req.body.cartProductId;
    const cartProduct = await deleteCartProduct(cartProductId);
    res.send(cartProduct);
  } catch ({ name, message }) {
    throw { name, message };
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
    throw { name, message };
  }
});
