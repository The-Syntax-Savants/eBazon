import React from "react";
import { Link } from "react-router-dom";

require("../style.css");
require("../tailwind.config.js");

const SingleProductCard = (props) => {
  const { product } = props;
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title">
          <h2>{product.name}</h2>
        </div>
        <div className="card-subtitle">
          <h3>{product.price}</h3>
          <h3>{product.sellerName}</h3>
        </div>
        <div className="card-content">
          <p>{product.description}</p>
          <h3>{product.dimensions}</h3>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCard;
