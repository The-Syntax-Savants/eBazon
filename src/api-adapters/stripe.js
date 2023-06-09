import { BASE_URL } from "./index.js";

export const createPaymentIntent = async (items) => {
  try {
    return fetch(`${BASE_URL}/stripe/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    }).then((res) => {
      return res.json();
    });
  } catch (error) {
    console.log("Error in createPaymentIntent Call!");
    console.error(error);
  }
};
