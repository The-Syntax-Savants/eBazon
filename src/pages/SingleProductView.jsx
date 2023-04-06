import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProductByIdDB } from "../api-adapters/products";

// require("../styles/style.css");
// require("../tailwind.config.js");

const SingleProductView = () => {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const getProduct = async () => {
    try {
      const data = await getProductByIdDB(productId);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  console.log(product, "!!!!!!!!");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image container */}
          <div className="relative w-full h-80 md:h-96">
            <img
              src="https://www.shutterstock.com/image-vector/profile-blank-icon-empty-photo-260nw-535853269.jpg"
              alt="Product"
              className="w-full h-full object-cover rounded-md shadow-md"
            />
          </div>

          {/* Product information container */}
          <div className="bg-white p-6 rounded-md shadow-md space-y-4">
            {product.product && (
              <div>
                <h1 className="text-2xl font-semibold">
                  {product.product.name}
                </h1>
                <p className="text-xl text-gray-600">
                  Price: ${product.product.price}
                </p>
                <p className="text-gray-600">{product.product.description}</p>
                <p className="text-gray-600">
                  Dimensions: {product.product.dimensions}
                </p>
                <button className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600">
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews container */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          {/* Add your reviews components here */}
        </div>

        {/* Recommended products container */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Add your single product cards here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductView;
