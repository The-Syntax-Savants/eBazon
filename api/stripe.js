import express from "express";
import StripePackage from "stripe";
import dotenv from "dotenv";
import { getActiveCartByUsername } from "../db/carts.js";
import { getCartProductsByCartId } from "../db/cartsProducts.js";
import { getProductByID } from "../db/products.js";

dotenv.config();

const STRIPE_SK = process.env.STRIPE_SK;
const Stripe = new StripePackage(STRIPE_SK);

export const stripeRouter = express.Router();
export default stripeRouter;

const calculateOrderAmount = async (items, req) => {
  // const total = items.reduce((acc, item) => {
  //   return acc + item.price;
  // }, 0);
  try {
    const cart = await getActiveCartByUsername(req.user.username);
    console.log("cart", cart);
    const cartProducts = await getCartProductsByCartId(cart.id);
    console.log("cartProducts", cartProducts);

    const cartProductsWithProducts = await Promise.all(
      cartProducts.map(async (cartProduct) => {
        const product = await getProductByID(cartProduct.product_id);
        return { ...cartProduct, product };
      })
    );

    let subTotal = 0;
    for (let i = 0; i < cartProductsWithProducts.length; i++) {
      subTotal +=
        cartProductsWithProducts[i].product.price *
        cartProductsWithProducts[i].quantity;
    }

    console.log("#####", subTotal);
    return subTotal;
  } catch ({ name, message }) {
    next({ name, message });
  }
};

stripeRouter.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log("hit the route!!!");

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await Stripe.paymentIntents.create({
    amount: await calculateOrderAmount(items, req),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
