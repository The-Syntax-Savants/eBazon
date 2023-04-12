import { BASE_URL } from "./index.js";

export const getAllProductsDB = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      METHOD: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    // console.log(result, " getAllProductsDB result");
    return result;
  } catch (error) {
    console.log("Error in getAllProductsDB Call!");
    console.error(error);
  }
};

export const getProductByIdDB = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    // console.log(result, " getProductByIdDB result");
    return result;
  } catch (error) {
    console.log("Error in getProductByID product Call!");
    console.error(error);
  }
};

export const getProductsByTagIdDB = async (tagId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${tagId}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error in api-adapters -> products -> getProductByTagIdDB");
    throw error;
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
    // console.log(result, " createProductInDB result");
    return result;
  } catch (error) {
    console.log("Error in createProduct Call!");
    console.error(error);
  }
};

export const editProductInDB = async (product) => {
  try {
    if (product.tags && product.tags.length < 1) {
      delete product.tags;
    }
    const id = product.id;
    const response = await fetch(`${BASE_URL}/products/${id}/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(product),
    });

    const result = await response.json();
    // console.log(result, " editProductInDB result");
    return result;
  } catch (error) {
    console.error(error);
  }
};
