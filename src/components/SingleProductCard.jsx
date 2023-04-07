import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createCartProductDB } from "../api-adapters/carts";

const SingleProductCard = (props) => {
  const product = props.product;
  const setAlert = props.setAlert;

  async function handleAddToCart() {
    try {
      await createCartProductDB(product.id);
      console.log(product.name + " added to cart!");
      setAlert("success");
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
            <button onClick={handleAddToCart} className="btn btn-success">
              Add to Cart
            </button>
            {/* <div className="badge badge-outline">Fashion</div>
        <div className="badge badge-outline">Products</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCard;
