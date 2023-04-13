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
    }, 1000);
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
        <div className="flex items-center justify-center">
          {cartProducts.length === 0 ? (
            <div className="m-5 mt-20 p-5 border-2 border-gray-300 rounded-md text-center">
              <h1 className="text-4xl">Cart Empty</h1>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div
                id="cart-container"
                className="m-5 ml-[7vw] w-full overflow-y-scroll"
              >
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
              </div>

              <div
                id="checkout-details"
                className="mr-[15vw] flex flex-col items-center"
              >
                <div
                  id="cart-total"
                  className="mt-10 mb-5 py-2 px-4 bg-accent rounded text-xl text-white font-bold"
                >
                  <h1>Total: ${subTotal.toFixed(2)}</h1>
                </div>

                <Link to="/checkout">
                  <button className="btn btn-success">CHECKOUT</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
