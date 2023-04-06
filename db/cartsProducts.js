import { client } from "./index.js";
import { getActiveCartByUsername } from "./carts.js";

export async function createCartProduct({ username, product_id, quantity }) {
  try {
    const cart = await getActiveCartByUsername(username);
    console.log(cart, "CART IN CREATE CART PRODUCT");
    const {
      rows: [cartProduct],
    } = await client.query(
      `
            INSERT INTO cart_products(cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
      [cart.id, product_id, quantity]
    );
    console.log(cartProduct, "CART PRODUCT IN CREATE CART PRODUCT");
    return cartProduct;
  } catch (error) {
    console.log("ERROR in createCartProduct");
    throw error;
  }
}

export async function getCartProductsByCartId(cartId) {
  try {
    const { rows } = await client.query(
      `
          SELECT * FROM cart_products
          WHERE cart_id=$1;
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
      const {
        rows: [cartProduct],
      } = await client.query(
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

// THIS IS ONLY FOR TEST PURPOSES!! DELETE!!!
// #
// #
// #
// #
// #
// #
export async function getAllCartProducts() {
  try {
    const { rows: cartProducts } = await client.query(
      `
        SELECT * FROM cart_products;
      `
    );

    console.log(cartProducts);
    return cartProducts;
  } catch (error) {
    console.error("Error getting all cart products!");
    throw error;
  }
}

export async function getAllCarts() {
  try {
    const { rows: carts } = await client.query(
      `
        SELECT * FROM carts;
      `
    );

    console.log(carts);
    return carts;
  } catch (error) {
    console.error("Error getting all carts!");
    throw error;
  }
}
