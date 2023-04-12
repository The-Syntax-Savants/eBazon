import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { SingleProductCard } from "../components";
import {
  getAllProductsDB,
  getProductsByTagIdDB,
} from "../api-adapters/products";
import { Pagination } from "../components";
// require("../style.css");
// require("../tailwind.config.js");

const Home = (props) => {
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const grabCartProducts = props.grabCartProducts;
  const isLoggedIn = props.isLoggedIn;

  //For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(16);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = [];

  for (let i = 0; i < Math.ceil(products.length / productsPerPage); i++) {
    totalPages.push(i + 1);
  }

  const fetchAllProducts = async () => {
    const fetchedProducts = await getAllProductsDB();
    setProducts(fetchedProducts.products);
  };

  useEffect(() => {
    fetchAllProducts();
  }, [isLoggedIn]);

  return (
    <div id="home-page">
      <div id="sub-header">
        <br />
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

        <div
          onClick={async (evt) => {
            //Since the whole div is clickable, we have to check if an actual HTML element with a value attribute was clicked.
            if (evt.target.value) {
              const tagProducts = await getProductsByTagIdDB(evt.target.value);
              setProducts(tagProducts);
            }
          }}
        >
          <button className="category-button" value={3}>
            Home Goods
          </button>
          <button className="category-button" value={4}>
            Decoration
          </button>
          <button className="category-button" value={11}>
            Sports
          </button>
          <button className="category-button" value={12}>
            Toys
          </button>
        </div>
      </div>

      <div id="product-cards-container" className="flex flex-wrap">
        {currentProducts.map((product) => {
          return (
            <SingleProductCard
              product={product}
              setAlert={setAlert}
              grabCartProducts={grabCartProducts}
              key={`This is the key: ${product.id}`}
              isLoggedIn={isLoggedIn}
            />
          );
        })}
      </div>

      {totalPages.length > 0 && (
        <div className="btn-group mb-10 flex justify-center ">
          <button
            onClick={() => {
              if (currentPage !== 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            className="btn"
          >
            «
          </button>

          {totalPages.length &&
            totalPages.map((_, idx) => {
              if (currentPage === idx + 1) {
                return (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(idx + 1);
                    }}
                    key={`pagination1 map btn idx: ${idx}`}
                    className="btn w-20 btn-active"
                  >
                    {idx + 1}
                  </button>
                );
              } else {
                return (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(idx + 1);
                    }}
                    key={`pagination2 map btn idx: ${idx}`}
                    className="btn w-30"
                  >
                    {idx + 1}
                  </button>
                );
              }
            })}

          <button
            onClick={() => {
              if (currentPage !== totalPages.length) {
                setCurrentPage(currentPage + 1);
              }
            }}
            className="btn"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
