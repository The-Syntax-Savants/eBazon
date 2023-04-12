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
  const isLoading = props.isLoading;
  const setIsLoading = props.setIsLoading;

  let { searchInput } = useParams();

  const fetchSearchResults = async () => {
    setIsLoading(true);
    let filteredProducts;
    setTimeout(async () => {
      if (selectedTag == null) {
        filteredProducts = await getAllProductsDB();
        filteredProducts = filteredProducts.products;

        if (filteredProducts) {
          filteredProducts = filteredProducts.filter((product) => {
            return product.name
              .toLowerCase()
              .includes(searchInput.toLowerCase());
          });
          setProducts(filteredProducts);
        }
      } else {
        filteredProducts = await getProductsByTagIdDB(selectedTag);

        if (filteredProducts) {
          filteredProducts = filteredProducts.filter((product) => {
            return product.name
              .toLowerCase()
              .includes(searchInput.toLowerCase());
          });
          setProducts(filteredProducts);
        }
      }
      setIsLoading(false);
    }, 1000);
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
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <progress className="progress w-56"></progress>
        </div>
      ) : (
        <div>
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

          <div id="product-cards-container" className="flex flex-wrap">
            {products.map((product) => {
              return (
                <SingleProductCard
                  product={product}
                  setAlert={setAlert}
                  cardLocation={"home"}
                  key={`This is the key: ${product.id}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
