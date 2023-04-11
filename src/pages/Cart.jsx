import React, { useEffect, useState } from "react";
import { getActiveCartProductsDB } from "../api-adapters/carts";
import { SingleCartProduct } from "../components";
import { Link } from "react-router-dom";

const Cart = (props) => {
  const [cartProducts, setCartProducts] = useState([]);
  const grabCartProducts = props.grabCartProducts;

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
      {cartProducts.length === 0 ? (
        <h1>No items in cart</h1>
      ) : (
        <>
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
                  grabCartProducts={grabCartProducts}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
