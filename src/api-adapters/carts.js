const BASE_URL = "http://localhost:3001/api";
// const BASE_URL = "https://ebazon.onrender.com/api"

export const getActiveCartProductsDB = async () => {
  try {
    console.log("STARTING API ADAPTER");
    console.log(localStorage.getItem("token"), "TOKEN");
    const response = await fetch(`${BASE_URL}/carts/myCart`, {
      METHOD: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await response.json();
    console.log(result, "API ADAPTER RESULT");
    return result;
  } catch (error) {
    console.log("Error in getAllProductsDB Call!");
    console.error(error);
  }
};

export const deleteCartProduct = async () => {
  try {
    const response = await fetch(`${BASE_URL}/carts/${username}`, {
      METHOD: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error in getAllProductsDB Call!");
    console.error(error);
  }
};
