import { client } from "./index.js";
import { getActiveCartByUsername } from "./carts.js";

export async function createCartProduct({ username, productId, quantity }) {
  try {
    const cart = getActiveCartByUsername(username);
    const {
      rows: [cartProduct],
    } = await client.query(
      `
            INSERT INTO carts_products("cartId", "productId", "quantity")
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
      [cart.id, productId, quantity]
    );
    return cartProduct;
  } catch (error) {
    throw error;
  }
}

export async function getCartProductsByCartId(cartId) {
  try {
    const { rows } = await client.query(
      `
          SELECT * FROM cart_products
          WHERE "cartId"=$1;
          `,
      [cartId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function updateCartProduct({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, idx) => `"${key}"=$${idx + 1}`)
    .join(", ");

  console.log(setString, "!!!!!");
  try {
    if (setString.length) {
      const cartProduct = await client.query(
        `
          UPDATE cart_products
          SET ${setString}
          WHERE id=${id}
          RETURNING *
        `,
        Object.values(fields)
      );

      return cartProduct;
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteCartProduct(cartProductId) {
  try {
    const {
      rows: [cartProduct],
    } = await client.query(
      `
        DELETE FROM cart_products
        WHERE id=$1
        RETURNING *;
      `,
      [cartProductId]
    );

    return cartProduct;
  } catch (error) {
    throw error;
  }
}
