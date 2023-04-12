import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCartProductDB } from "../api-adapters/carts";
import { getLoggedInUserFromDB } from "../api-adapters/users";

const SingleProductCard = (props) => {
  const product = props.product;
  const setAlert = props.setAlert;
  const grabCartProducts = props.grabCartProducts;
  const isLoggedIn = props.isLoggedIn;

  const [user, setUser] = useState({});

  async function handleAddToCart() {
    try {
      await createCartProductDB(product.id);
      grabCartProducts();
      console.log(product.name + " added to cart!");
      setAlert("success");
    } catch (error) {
      console.log(error);
      setAlert("error");
      throw error;
    }
  }

  const fetchUser = async () => {
    const data = await getLoggedInUserFromDB();
    if (data.username) {
      setUser(data);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser();
    }
  }, []);

  return (
    <div id="product-card" className="max-w-sm w-full">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            id="product-image"
            src={
              product.image_url
                ? product.image_url
                : "https://i1.wp.com/www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg?resize=624%2C421&ssl=1"
            }
            alt="Product Image"
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

          <div className="flex flex-row flex-wrap max-h-20 overflow-auto">
            {product.tags.length > 0 &&
              product.tags.map((tag, idx) => {
                return (
                  <p
                    key={`paragraph in SingleProductCard: ${idx}`}
                    className="badge badge-outline min-h-fit max-w-fit mb-2 mr-2"
                  >
                    {tag.name}
                  </p>
                );
              })}
          </div>

          {user.username && isLoggedIn && (
            <div className="card-actions justify-end">
              <button onClick={handleAddToCart} className="btn btn-success">
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProductCard;
