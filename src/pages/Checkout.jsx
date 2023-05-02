import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { placeOrderDB, getMyCartNumberDB } from "../api-adapters/carts";
import { createPaymentIntent } from "../api-adapters/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { Panorama } from "aws-sdk";

const CheckoutFormContent = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationURL, setConfirmationURL] = useState("");
  const clientSecret = props.clientSecret;

  const getConfirmationURL = async () => {
    try {
      const BASE_URL =
        process.env.NODE_ENV === "production"
          ? "https://ebazon.netlify.app"
          : "http://localhost:3000";

      const cartNumber = await getMyCartNumberDB();

      setConfirmationURL(`${BASE_URL}/confirmation/${cartNumber}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConfirmationURL();
  }, []);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        clientSecret: clientSecret,
        return_url: confirmationURL,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    await placeOrderDB();
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
    clientSecret: clientSecret,
  };

  return (
    <div className="h-screen w-[97vw] flex flex-col items-center">
      <form
        id="payment-form"
        className=" mt-[10vh] h-fit w-[40vw]"
        onSubmit={handleSubmit}
      >
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <h3>Shipping</h3>
        <AddressElement
          options={{ mode: "shipping", allowedCountries: ["US"] }}
        />

        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="btn btn-primary ml-[16vw] mt-5"
        >
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner" /> : "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && (
          <div className="alert alert-error shadow-lg mt-5">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{message}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default function Checkout() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const StripeKey = import.meta.env.VITE_STRIPE_KEY;

  useEffect(() => {
    const initializeStripe = async () => {
      const stripe = await loadStripe(StripeKey);
      setStripePromise(stripe);
    };
    initializeStripe();
    createPaymentIntent().then((data) => {
      setClientSecret(data.clientSecret);
    });
  }, []);

  const options = {
    clientSecret: clientSecret,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormContent />
        </Elements>
      )}
    </div>
  );
}
