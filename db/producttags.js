const { client } = require(".");

// getProductTagsByProductId(productId)
// addProductTag(productId, tagId) requiredUser
// deleteProductTag(productTagId) requiredUser

async function getProductTagsByProductId(productId) {
  try {
  } catch (error) {}
}

async function addProductTag(productId, tagId) {
  try {
    // const {rows: [product]} = await client.query(`
    //     SELECT *
    //     FROM products
    //     WHERE id=$1
    // `, [productId])

    // const {rows: [tag]} = await client.query(`
    //     SELECT name
    //     FROM tags
    //     WHERE id=$1
    //     RETURNING *;
    // `, [tagId])

    const {
      rows: [productTag],
    } = await client.query(`
            INSERT INTO productTags(productId, tagId)
            VALUES ($1, $2)
            RETURNING *;
        `);

    product.tags = [];
    product.tags.push(tag);

    return product;
  } catch (error) {}
}

async function deleteProductTag(productTagId) {
  try {
  } catch (error) {}
}
