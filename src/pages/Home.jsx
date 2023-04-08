import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { SingleProductCard } from "../components";
import { getAllProductsDB, getProductsByTagIdDB } from "../api-adapters/products";
// require("../style.css");
// require("../tailwind.config.js");

const Home = () => {
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");

  const fetchAllProducts = async () => {
    const fetchedProducts = await getAllProductsDB();
    setProducts(fetchedProducts.products);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);
  return (
    <div id="home-page">
      <div id="sub-header">
        <br></br>
        <h1>Welcome to eBazon! The home of all your shopping needs</h1>
        {alert === "success" && (
          <div className="alert alert-success shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Successfully Added To Cart!</span>
            </div>
          </div>
        )}

        <div onClick={async (evt) => {

          //Since the whole div is clickable, we have to check if an actual HTML element with a value attribute was clicked.
          if (evt.target.value ) {
            const tagProducts = await getProductsByTagIdDB(evt.target.value)
            setProducts(tagProducts)
          }

        }}>
          <button className="category-button" value={3} >Home Goods</button>
          <button className="category-button" value={4}>Decoration</button>
          <button className="category-button" value={11}>Sports</button>
          <button className="category-button" value={12}>Toys</button>
        </div>
      </div>

      <div id="product-cards-container">
        {products.map((product) => {
          return (
            <SingleProductCard
              product={product}
              setAlert={setAlert}
              cardLocation={"home"}
              key={`This is the key: ${product.id}`}
            ></SingleProductCard>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
