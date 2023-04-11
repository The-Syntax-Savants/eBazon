import { BASE_URL } from "./index.js";

export const getActiveCartProductsDB = async () => {
  try {
    const response = await fetch(`${BASE_URL}/carts/myCart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await response.json();
    console.log(result, " getActiveCartProductsDB result");
    return result;
  } catch (error) {
    console.log("Error in getActiveCartProductsDB Call!");
    console.error(error);
  }
};

export const deleteCartProductDB = async (cartProductId) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/remove-from-cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ cartProductId: cartProductId }),
    });
    const result = await response.json();
    console.log(result, " deleteCartProductDB result");
    return result;
  } catch (error) {
    console.log("Error in deleteCartProductDB Call!");
    console.error(error);
  }
};

export const createCartProductDB = async (product_id) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ product_id: product_id }),
    });
    const result = await response.json();
    console.log(result, " createCartProductDB result");
    return result;
  } catch (error) {
    console.log("Error in createCartProductDB Call!");
    console.error(error);
  }
};

export const updateCartProductDB = async (cartProductId, quantity) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/update-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        cartProductId: cartProductId,
        quantity: quantity,
      }),
    });
    const result = await response.json();
    console.log(result, " updateCartProductDB result");
    return result;
  } catch (error) {
    console.log("Error in updateCartProductDB Call!");
    console.error(error);
  }
};

export const placeOrderDB = async () => {
  try {
    console.log("PLACING ORDER");
    const response = await fetch(`${BASE_URL}/carts/place-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await response.json();
    console.log(result, " placeOrderDB result");
    return result;
  } catch (error) {
    console.log("Error in placeOrderDB Call!");
    console.error(error);
  }
};

// await fetch(`${BASE_URL}/carts/add-to-cart`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
//   body: JSON.stringify({
//     productId: product_id,
//   }),
// });

// export const loginUserDB = async (username, password) => {
//   try {
//     const response = await fetch(`${BASE_URL}/users/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: username,
//         password: password,
//       }),
//     });

//     const result = await response.json();
//     console.log(result);
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// };
