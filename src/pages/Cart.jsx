import React, { useEffect, useState } from "react";
import { getActiveCartProductsDB } from "../api-adapters/carts";
import { SingleCartProduct } from "../components";
import { Link } from "react-router-dom";

const Cart = (props) => {
  const [cartProducts, setCartProducts] = useState([]);
  const subTotal = props.subTotal;
  const grabCartProducts = props.grabCartProducts;
  const isLoading = props.isLoading;
  const setIsLoading = props.setIsLoading;

  async function getCartProducts() {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const cartProductsDB = await getActiveCartProductsDB();
        console.log(cartProductsDB, "CART PRODUCTS DB");
        if (Array.isArray(cartProductsDB)) {
          setCartProducts(cartProductsDB);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }, 500);
  }

  useEffect(() => {
    getCartProducts();
  }, []);

  return (
    <div className="h-screen overflow-auto">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <progress className="progress w-56"></progress>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div
            id="cart-container"
            className="m-5 ml-[7vw] max-h-[80vh] w-fit overflow-y-scroll"
          >
            {cartProducts.length === 0 ? (
              <h1 className="text-6xl text-center ml-[32vw]">
                No items in cart
              </h1>
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
              </>
            )}
          </div>

          {cartProducts.length !== 0 && (
            <div
              id="checkout-details"
              className="mr-[15vw] flex flex-col items-center"
            >
              <div
                id="cart-total"
                className="mt-10 mb-5 badge badge-accent text-xl"
              >
                <h1>Total: ${subTotal.toFixed(2)}</h1>
              </div>
              <Link to="/checkout">
                <button className="btn btn-success">CHECKOUT</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
