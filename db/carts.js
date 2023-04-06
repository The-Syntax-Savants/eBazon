import { client } from "./index.js";

export async function createCart({
  username,
  is_complete,
  city,
  state,
  zipcode,
  address_line_1,
  address_line_2,
  price,
  time_of_purchase,
}) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
        INSERT INTO carts(username, is_complete, city, state, zipcode, address_line_1, address_line_2, price, time_of_purchase)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
        `,
      [
        username,
        is_complete,
        city,
        state,
        zipcode,
        address_line_1,
        address_line_2,
        price,
        time_of_purchase,
      ]
    );

    return cart;
  } catch (error) {
    console.error("Error creating cart!");
    throw error;
  }
}

export async function updateCart({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, idx) => `"${key}"=$${idx + 1}`)
    .join(", ");

  console.log(setString, "!!!!!");
  try {
    if (setString.length) {
      await client.query(
        `
          UPDATE carts
          SET ${setString}
          WHERE id=${id}
          RETURNING *
        `,
        Object.values(fields)
      );

      return await getCartById(id);
    }
  } catch (error) {
    throw error;
  }
}

export async function getActiveCartByUsername(username) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
          SELECT * FROM carts
          WHERE username=$1 AND is_complete=false;
          `,
      [username]
    );

    return cart;
  } catch (error) {
    console.log("ERROR in getActiveCartByUsername");
    throw error;
  }
}

// For order history
export async function getInactiveCartsByUsername(username) {
  try {
    const { rows } = await client.query(
      `
          SELECT * FROM carts
          WHERE username=$1 AND is_complete=true;
          `,
      [username]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}
