import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteCartProductDB,
  updateCartProductDB,
} from "../api-adapters/carts";
import { Select, Space } from "antd";

const SingleCartProduct = (props) => {
  const cartProduct = props.cartProduct;
  const product = cartProduct.product;
  const getCartProducts = props.getCartProducts;
  const [quantity, setQuantity] = useState(cartProduct.quantity);

  async function handleRemoveFromCart() {
    try {
      await deleteCartProductDB(cartProduct.id);
      console.log(product.name + " removed from cart!");
      getCartProducts();
    } catch (error) {
      console.log(error);
      setAlert("error");
      throw error;
    }
  }

  async function handleUpdateCart(event) {
    try {
      let tempQuantity = event.target.value;
      setQuantity(tempQuantity);
      await updateCartProductDB(cartProduct.id, tempQuantity);
      console.log(product.name + " updated cart product!");
    } catch (error) {
      console.log(error);
      setAlert("error");
      throw error;
    }
  }

  return (
    <div id="product-card" className="max-w-sm w-full">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            id="product-image"
            src="https://i1.wp.com/www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg?resize=624%2C421&ssl=1"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            <Link to={`/product-view/${product.id}`}>{product.name}</Link>
            <div className="badge badge-secondary">
              $
              {String(product.price).slice(0, String(product.price).length - 2)}
              .{String(product.price).slice(-2)}
            </div>
          </h2>
          <h5>Seller: {product.seller_name}</h5>
          <p>{product.description}</p>
          <div className="card-actions justify-end">
            <label className="input-group">
              <span>Product Quantity: </span>
              <input
                required
                type="number"
                value={quantity}
                // onChange={(e) => setQuantity(e.target.value)}
                onChange={(event) => handleUpdateCart(event)}
                placeholder={quantity}
                className="input input-bordered"
              />
            </label>

            <button onClick={handleRemoveFromCart} className="btn btn-error">
              Remove
            </button>
            {/* Adjust quantity of product in cart */}
            {/* <div className="badge badge-outline">Fashion</div>
        <div className="badge badge-outline">Products</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCartProduct;
