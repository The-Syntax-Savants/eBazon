import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { SingleProductCard } from "./";
import { getAllProductsDB } from "../api-adapters";
require("../style.css");
require("../tailwind.config.js");

const Home = () => {
  const [products, setProducts] = useState([]);

  const fetchAllProducts = async () => {
    const fetchedProducts = await getAllProductsDB();
    console.log("fetchedProducts: ", fetchedProducts);
    setProducts(fetchedProducts.products);
    console.log(products);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);
  return (
    <div id="home-page">
      <div id="sub-header">
        <h1>Welcome to eBazon! The home of all your shopping needs</h1>
      </div>

      <div id="category-btn-container">
        <button className="category-button">Insert Tag Name Here</button>
        <button className="category-button">Insert Tag Name Here</button>
        <button className="category-button">Insert Tag Name Here</button>
        <button className="category-button">Insert Tag Name Here</button>
      </div>

      <div id="product-cards-container">
        {products.map((product) => {
          return (
            <SingleProductCard
              product={product}
              key={`This is the key: ${product.id}`}
            ></SingleProductCard>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
