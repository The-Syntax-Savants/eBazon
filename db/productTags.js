import { client } from "./index.js";

export async function createProductTag(productId, tagId) {
  try {
    await client.query(
      `
            INSERT INTO product_tags(product_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT (product_id, tag_id) DO NOTHING;
            `,
      [productId, tagId]
    );
  } catch (error) {
    console.log("Error in createProductTag");
    throw error;
  }
}

export async function addTagsToProduct(productId, tagList) {
  try {
    const createProductTagPromises = tagList.map((tag) =>
      createProductTag(productId, tag.id)
    );

    await Promise.all(createProductTagPromises);
  } catch (error) {
    console.log("Error in createProductTag");
    throw error;
  }
}
