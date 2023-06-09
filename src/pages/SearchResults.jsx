import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  getAllProductsDB,
  getProductsByTagIdDB,
} from "../api-adapters/products";
import { SingleProductCard } from "../components";
import { getAllTagsDB } from "../api-adapters/tags";

const SearchResults = (props) => {
  //search-input tag-input
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const grabCartProducts = props.grabCartProducts;
  const isLoading = props.isLoading;
  const setIsLoading = props.setIsLoading;
  const isLoggedIn = props.isLoggedIn;

  const { searchInput } = useParams();

  //for Pagination
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

  const fetchSearchResults = async () => {
    setIsLoading(true);

    let filteredProducts;

    if (selectedTag == null) {
      filteredProducts = await getAllProductsDB();
      filteredProducts = filteredProducts.products;

      if (filteredProducts) {
        filteredProducts = filteredProducts.filter((product) => {
          return product.name.toLowerCase().includes(searchInput.toLowerCase());
        });
        setProducts(filteredProducts);
      }
    } else {
      filteredProducts = await getProductsByTagIdDB(selectedTag);

      if (filteredProducts) {
        filteredProducts = filteredProducts.filter((product) => {
          return product.name.toLowerCase().includes(searchInput.toLowerCase());
        });

        setProducts(filteredProducts);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const fetchAllTags = async () => {
    const fetchedTags = await getAllTagsDB();
    setAllTags(fetchedTags);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [selectedTag, searchInput]);

  useEffect(() => {
    fetchAllTags();
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <progress className="progress w-56" />
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-center border border-1 border-black flex-wrap ">
            {allTags.map((tag) => {
              return (
                <button
                  key={`tag name in searchResults map: ${tag.name}`}
                  value={tag.id}
                  className=" flex justify-center btn-ghost border-solid m-2 border-black border-1 pl-2 pr-2"
                  onClick={(evt) => {
                    setSelectedTag(evt.target.value);
                  }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>

          <div
            id="product-cards-container"
            className="flex flex-wrap justify-evenly mb-10 mt-10 h-full w-full"
          >
            {currentProducts.map((product) => {
              return (
                <SingleProductCard
                  product={product}
                  setAlert={setAlert}
                  grabCartProducts={grabCartProducts}
                  isLoggedIn={isLoggedIn}
                  key={`This is the key: ${product.id}`}
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
        </>
      )}
    </div>
  );
};

export default SearchResults;
