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
  const grabCartProducts = props.grabCartProducts;
  const [quantity, setQuantity] = useState(cartProduct.quantity);

  async function handleRemoveFromCart() {
    try {
      await deleteCartProductDB(cartProduct.id);
      grabCartProducts();
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
      grabCartProducts();
    } catch (error) {
      console.log(error);
      setAlert("error");
      throw error;
    }
  }

  return (
    <div
      id="product-card"
      className="product-card w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4"
    >
      <div className="card w-auto min-w-[900px] bg-base-100 shadow-xl relative">
        <div className="absolute top-5 right-5">
          <button onClick={handleRemoveFromCart} className="btn btn-error">
            Remove
          </button>
        </div>
        <div className="w-48 flex items-center justify-center">
          <figure className="w-full h-full">
            <img
              id="product-image"
              src={
                product.image_url
                  ? product.image_url
                  : "https://i1.wp.com/www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg?resize=624%2C421&ssl=1"
              }
              alt="Product Image"
              className="w-full h-full object-cover"
            />
          </figure>
        </div>
        <div className="flex-grow pr-8">
          <div className="card-body">
            <h2 className="card-title">
              <Link to={`/product-view/${product.id}`}>{product.name}</Link>
              <div className="badge badge-secondary">
                $
                {String(product.price).slice(
                  0,
                  String(product.price).length - 2
                )}
                .{String(product.price).slice(-2)}
              </div>
            </h2>
            <h5>Seller: {product.seller_name}</h5>
            <p className="line-clamp-2">{product.description}</p>
            <div className="card-actions flex-start">
              <label className="input-group">
                <span>Product Quantity: </span>
                <input
                  required
                  type="number"
                  value={quantity}
                  onChange={(event) => handleUpdateCart(event)}
                  placeholder={quantity}
                  className="input input-bordered"
                />
              </label>
              <div className="flex flex-row flex-wrap max-h-20 overflow-auto">
                {product.tags.length > 0 &&
                  product.tags.map((tag, idx) => {
                    return (
                      <p
                        key={`paragraph in SingleProductCard: ${idx}`}
                        className="badge badge-outline min-h-fit max-w-fit mb-2 mr-2"
                      >
                        {tag.name}
                      </p>
                    );
                  })}
              </div>
              {/* Adjust quantity of product in cart */}
              {/* <div className="badge badge-outline">Fashion</div>
        <div className="badge badge-outline">Products</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCartProduct;
