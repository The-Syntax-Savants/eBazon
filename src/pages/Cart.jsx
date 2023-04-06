import React, { useEffect, useState } from "react";
import { getActiveCartProductsDB } from "../api-adapters/carts";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);

  async function getCartProducts() {
    try {
      console.log("STARTING CALL");
      const cartProductsDB = await getActiveCartProductsDB();
      console.log(cartProductsDB, "INSIDE FUNC");
      return cartProductsDB;
    } catch (error) {
      console.log(error);
    }
  }
  const x = getCartProducts();
  console.log(x, "RETURN");

  //   useEffect(async () => {
  //     const cartProductsDB = await getActiveCartProductsDB();
  //     setCartProducts(cartProductsDB);
  //   }, []);

  // console.log(cartProducts, "!!!!");
  return (
    <div id="cart-container">
      <h1>hello</h1>
      {cartProducts[0] && <h2>{cartProducts[0].product}</h2>}
      <button className="btn btn-success">CHECKOUT</button>
    </div>
  );
};

export default Cart;
