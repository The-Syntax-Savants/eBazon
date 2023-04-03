const { client } = require(".");
async function createProduct({
  name,
  seller_name,
  price,
  description,
  dimensions,
  quantity,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products( name, seller_name, price, description, dimensions, quantity, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [name, seller_name, price, description, dimensions, quantity, image]
    );

    return product;
  } catch (error) {
    console.error("Error creating Product!");
    throw error;
  }
}
async function getAllProducts() {
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

// async function getProductByID(produtId) {
//   try {
//     const { rows: [product] } = await client.query(`
//       SELECT *
//       FROM products
//       WHERE products.id=$1;
//     `, [id])
//     return product
//   } catch(error) {}
// }

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

module.exports = {
  createProduct,
  getAllProducts,
};
