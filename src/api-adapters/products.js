const BASE_URL = "http://localhost:3001/api";
// const BASE_URL = "https://ebazon.onrender.com/api"

export const getAllProductsDB = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
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


export const getProductByIdDB = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      METHOD: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error in getProductByID product Call!");
    console.error(error);
  }
};

export const createProductInDB = async (product) => {

  try {
    const response = await fetch(`${BASE_URL}/products/createProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(product),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error in createProduct Call!");
    console.error(error);
  }
};

// module.exports = {
//   getAllProductsDB,
//   // createProductInDB
// };
