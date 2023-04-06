import { client } from "./index.js";

//getAllTags()
// editTag(id) requiredAdmin
// createTag(name) requiredAdmin
// deleteTag(id) requiredAdmin
// getTagsByProductTag(productTagId)

export async function getAllTags() {
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

export async function createTag(name) {
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

// export async function getTagByProductTag(productTagId) {
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

export async function getTagById(id){
  try {
    const {rows: [tag]} = await client.query(`
      SELECT * 
      FROM tags
      WHERE id=$1
    `, [id])
    return tag
  } catch (error) {
    console.error("Error in getTagById Database method!")
    throw error
  }
}

export async function deleteTag(id){
  try {
      await client.query(`
        DELETE
        FROM tags
        WHERE tags.id=$1
      `, [id])

  } catch (error) {
    console.error("Error in deleteTag Database method!")
    throw error
  }
}

export async function editTag(id, name){
  console.log(name, "nAME")
  try {
    const {rows: [tag]} = await client.query(`
    UPDATE tags
    SET name = $1
    WHERE id=${id}
    RETURNING *
    `, [name])

    return tag
  } catch (error) {
    console.error("Error in editTag Database method!")
    throw error
  }
}