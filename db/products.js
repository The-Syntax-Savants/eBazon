import { client } from "./index.js";
import { addTagsToProduct } from "./productTags.js";

export async function createProduct({
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

    await addTagsToProduct(product.id, tags);

    return await getProductByID(product.id);
  } catch (error) {
    console.error("Error creating Product!");
    throw error;
  }
}
export async function getAllProducts() {
  try {
    const { rows: productIds } = await client.query(
      `
        SELECT id FROM products
        WHERE is_active=true;
      `
    );

    const products = await Promise.all(
      productIds.map((product) => getProductByID(product.id))
    );
    console.log(products);
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
      WHERE id=$1;
    `,
      [productId]
    );

    if (!product) {
      throw {
        name: "ProductNotFoundError",
        message: "Could not find a product with that productId",
      };
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
    product.tags = tags;

    return product;
  } catch (error) {
    console.error("Error getting productById!");
    throw error;
  }
}

//search-product-by-tag branch -->>>>

export async function getProductsByTagId(tagId) {
  try {
    const { rows: productIds } = await client.query(
      `
        SELECT product_tags.product_id 
        FROM product_tags
        WHERE product_tags.tag_id=$1
        `,
      [tagId]
    );

    const products = await Promise.all(
      productIds.map((product) => getProductByID(product.product_id))
    );
    return products;
  } catch (error) {
    console.error("Error in DB -> products -> getProductsByTag");
    throw error;
  }
}

export async function getProductsBySeller(username) {
  try {
  } catch {}
}

//search-product-by-tag branch <<<<----

//We can also use this to deactivate a product by updating active to false
export async function updateProduct(productId, fields = {}) {
  // read off the tags & remove that field
  const { tags } = fields; // might be undefined
  delete fields.tags;

  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    let data = {};
    // update any fields that need to be updated

    if (setString.length > 0) {
      await client.query(
        `
        UPDATE products
        SET ${setString}
        WHERE id=${productId}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    // return early if there's no tags to update
    if (!tags) {
      return await getProductByID(productId);
    }

    const tagListIdString = tags.map((tag) => `${tag.id}`).join(", ");

    // delete any post_tags from the database which aren't in that tagList
    await client.query(
      `
      DELETE FROM product_tags
      WHERE tag_id
      NOT IN (${tagListIdString})
      AND product_id=$1;
    `,
      [productId]
    );

    // and create post_tags as necessary
    await addTagsToProduct(productId, tags);

    return await getProductByID(productId);
  } catch (error) {
    throw error;
  }
}

//only should be done by admin
export async function deleteProductByID(productId) {
  try {
    await client.query(
      `
      DELETE FROM product_tags
      WHERE product_tags.product_id=$1
    `,
      [productId]
    );

    await client.query(
      `
      DELETE FROM products
      WHERE products.id=$1
    `,
      [productId]
    );
  } catch (error) {
    console.log("Error in DeleteProduct");
    throw error;
  }
}
