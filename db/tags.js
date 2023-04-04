const { client } = require(".");

//getAllTags()
// editTag(id) requiredAdmin
// createTag(name) requiredAdmin
// deleteTag(id) requiredAdmin
// getTagsByProductTag(productTagId)

async function getAllTags() {
  try {
    const { rows: tags } = await client.query(
      `
            SELECT *
            FROM tags
        `
    );

    return tags;
  } catch (error) {
    console.log("Error in getAllTags Database method!");
    throw error;
  }
}

async function createTag(name) {
  try {
    const {
      rows: [tag],
    } = await client.query(
      `
            INSERT INTO tags(name)
            VALUES ($1)
            RETURNING *;
        `,
      [name]
    );
    return tag;
  } catch (error) {
    console.error("Error in createTag Database method!");
    throw error;
  }
}

// async function getTagByProductTag(productTagId) {
//   try {
//     const { rows: tags } = await client.query(
//       `
//             SELECT name FROM tags
//             WHERE productTagId=$1;
//         `,
//       [productTagId]
//     );
//     return tags;
//   } catch (error) {
//     console.log("Error getting tags by product tags");
//     throw error;
//   }
// }

// async function deleteTag(id)({

// })

// async function editTag(id)({

// })

module.exports = {
  getAllTags,
  createTag,
};
