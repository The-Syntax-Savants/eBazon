const { client } = require(".");
const { addTagsToProduct } = require("./producttags");

async function createProduct({
  name,
  seller_name,
  price,
  description,
  dimensions,
  quantity,
  tags = [],
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

  
     await addTagsToProduct(product.id, tags)

     return await getProductByID(product.id)

  } catch (error) {
    console.error("Error creating Product!");
    throw error;
  }
}
async function getAllProducts() {
  try {
    const { rows: productIds } = await client.query(
      `
        SELECT id FROM products;
      `
    );

    const products = await Promise.all(productIds.map((product) => getProductByID(product.id)))
    console.log(products)
    return products;
  } catch (error) {
    console.error("Error getting all products!");
    throw error;
  }
}

async function getProductByID(productId) {
  try {
    const { rows: [product] } = await client.query(`
      SELECT *
      FROM products
      WHERE id=$1;
    `, [productId])

    if(!product){
      throw{
        name: "ProductNotFoundError",
        message: "Could not find a product with that productId"
      }
    }

    const { rows: tags } = await client.query(
      `
        SELECT tags.*
        FROM tags
        JOIN product_tags ON tags.id=product_tags.tag_id
        WHERE product_tags.product_id=$1;
      `,
      [productId]
    );
      product.tags = tags

    return product
  } catch(error) {
    console.error("Error getting productById!");
    throw error
  }
}
// *** Forgot to not make functions we were not using. my bad -Emilio & Charles


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
  getProductByID
};
