import React, { useEffect, useState } from "react";
import { getActiveCartProductsDB } from "../api-adapters/carts";
import { SingleCartProduct } from "../components";
import { Link } from "react-router-dom";

const Cart = (props) => {
  const [cartProducts, setCartProducts] = useState([]);
  const subTotal = props.subTotal;
  const grabCartProducts = props.grabCartProducts;

  async function getCartProducts() {
    try {
      const cartProductsDB = await getActiveCartProductsDB();
      setCartProducts(cartProductsDB);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCartProducts();
  }, []);

  return (
    <div id="cart-container" className="ml-5">
      {cartProducts.length === 0 ? (
        <h1>No items in cart</h1>
      ) : (
        <>
          <div
            id="products-container"
            className="flex flex-col space-y-4 mt-10"
          >
            {cartProducts.map((cartProduct) => {
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
          <div id="checkout-details" className="ml-10 flex flex-col">
            <div id="cart-total" className="mt-10 mb-5 badge badge-accent">
              <h1>Total: ${subTotal.toFixed(2)}</h1>
            </div>
            <Link to="/checkout">
              <button className="btn btn-success">CHECKOUT</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
