import React from "react";
import { Link } from "react-router-dom";

// require("../style.css");
// require("../tailwind.config.js");

const SingleProductCard = (props) => {
  const { product } = props;
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
            <button className="btn btn-success">Add to Cart</button>
            {/* <div className="badge badge-outline">Fashion</div>
        <div className="badge badge-outline">Products</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCard;
