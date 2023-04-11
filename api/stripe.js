import express from "express";
import StripePackage from "stripe";
const Stripe = new StripePackage(
  "sk_test_51MvOTQLhGAqNc30vEsExUrFXzbDpsKHcOIGxxIAmuYLf6DD3gYXMqyFzC9MEJz9aJ8cnUayMiK3MGbUtb4y5qBcP00OkK8mCMx"
);

export const stripeRouter = express.Router();
export default stripeRouter;

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

stripeRouter.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log("hit the route!!!");

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await Stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
