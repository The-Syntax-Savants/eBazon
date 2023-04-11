import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductByIdDB, editProductInDB } from "../api-adapters/products";
import { getLoggedInUserFromDB } from "../api-adapters/users";
import { createCartProductDB } from "../api-adapters/carts";

// require("../styles/style.css");
// require("../tailwind.config.js");

const SingleProductView = (props) => {
  const [product, setProduct] = useState({});
  const [user, setUser] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [alert, setAlert] = useState("");

  const grabCartProducts = props.grabCartProducts;

  const { productId } = useParams();

  const navigate = useNavigate();

  const getProduct = async () => {
    try {
      const data = await getProductByIdDB(productId);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    const data = await getLoggedInUserFromDB();
    if (data.username) {
      setUser(data);
    }
  };

  const handleDelete = async () => {
    await editProductInDB({ id: product.product.id, is_active: false });
    navigate("/");
  };

  async function handleAddToCart() {
    try {
      await createCartProductDB(product.product.id);
      grabCartProducts();
      console.log(product.product.name + " added to cart!");
      setAlert("success");
    } catch (error) {
      console.log(error);
      setAlert("error");
      throw error;
    }
  }

  useEffect(() => {
    getProduct();
    if(localStorage.getItem("token")){
      fetchUser()
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image container */}
          <div className="relative w-full h-80 md:h-96">
            {console.log(product, "THIS IS PRODUCT")}
            <img
              src={product.product && product.product.image_url}
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
                  Price: ${product.product.price / 100}
                </p>
                <p className="text-gray-600">{product.product.description}</p>
                <p className="text-gray-600">
                  Dimensions: {product.product.dimensions}
                </p>
                {user.username && <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>}
                {((user && user.username === product.product.seller_name) ||
                  user.is_admin) && (
                  <div>
                    <Link to={`/edit-product/${product.product.id}`}>
                      <button className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600">
                        Edit Product
                      </button>
                    </Link>

                    <button
                      className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmDelete(true);
                      }}
                    >
                      Delete Product
                    </button>
                    {showConfirmDelete && (
                      <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen">
                          <div className="relative bg-white w-1/2 md:w-1/3 lg:w-1/4 rounded-md shadow-lg">
                            <div className="p-6">
                              <h4 className="text-lg font-bold mb-4">
                                Are you sure you would like to delete Product:{" "}
                                {product.product && product.product.name}
                              </h4>
                              <div className="flex justify-end">
                                <button
                                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400"
                                  onClick={() => {
                                    setShowConfirmDelete(false);
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
                                  onClick={() => {
                                    handleDelete();
                                  }}
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
