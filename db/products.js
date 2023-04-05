import { client } from "./index.js";

export async function createProduct({
  name,
  seller_name,
  price,
  description,
  dimensions,
  quantity,
  tags,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products( name, seller_name, price, description, dimensions, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [name, seller_name, price, description, dimensions, quantity]
    );

    return product;
  } catch (error) {
    console.error("Error creating Product!");
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const { rows: products } = await client.query(
      `
    SELECT * FROM products;
    `
    );
    return products;
  } catch (error) {
    console.error("Error getting all products!");
    throw error;
  }
}

// *** Forgot to not make functions we were not using. my bad -Emilio & Charles

export async function getProductByID(productId) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      SELECT *
      FROM products
      WHERE products.id=$1;
    `,
      [productId]
    );
    return product;
  } catch (error) {}
}

// async function getProductsByTag(tag) {
//   try {
//     const { rows: products} = await client.query(
//         `
//         SELECT * FROM products
//         WHERE tags=$1;
//         `,
//         [tag]
//     )
//     return products;
//   } catch (error){throw error}
// }

// async function getProductsBySeller(username) {
//   try {
//   } catch {}
// }

// async function updateProduct({ id, ...fields }) {
//   try {
//   } catch {}
// }

// module.exports = {
//   createProduct,
//   getAllProducts,
//   getProductByID,
// };
