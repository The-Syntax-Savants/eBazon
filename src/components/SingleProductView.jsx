import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProductByIdDB } from "../api-adapters/products";

require("../style.css");
require("../tailwind.config.js");
const SingleProductView = () => {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const getProduct = async () => {
    try {
      const data = await getProductByIdDB(productId);
      setProduct(data);
      console.log(data, "DATA");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  console.log(product, "!!!!!!!!");

  return (
    <div id="single-product-page">
      {product.product && (
        <div>
          <h1>{product.product.name}</h1>
        </div>
      )}
    </div>
  );
};

export default SingleProductView;
