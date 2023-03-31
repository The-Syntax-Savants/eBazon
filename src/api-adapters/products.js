const BASE_URL = "http://localhost:3001/api";

const getAllProductsDB = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      METHOD: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error in getAllProductsDB Call!");
    console.error(error);
  }
};

module.exports = { getAllProductsDB };
