import React, { useEffect, useState } from "react";
import { getActiveCartProductsDB } from "../api-adapters/carts";
import { SingleCartProduct } from "../components";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);

  async function getCartProducts() {
    try {
      const cartProductsDB = await getActiveCartProductsDB();
      console.log(cartProductsDB, "CART PRODUCTS DB");
      setCartProducts(cartProductsDB);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCartProducts();
  }, []);

  return (
    <div id="cart-container">
      <h1>hello</h1>
      {/* {cartProducts[0] && <h2>{cartProducts[0].product}</h2>} */}

      {/* Link to checkout page */}
      <Link to="/checkout">
        <button className="btn btn-success">CHECKOUT</button>
      </Link>

      <div id="products-container">
        {cartProducts.map((cartProduct) => {
          console.log(cartProduct.product, "INSIDE MAP");
          return (
            <SingleCartProduct
              key={"product id: " + cartProduct.product_id}
              cartProduct={cartProduct}
              getCartProducts={getCartProducts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
