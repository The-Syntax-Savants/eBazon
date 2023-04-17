import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCartProductDB } from "../api-adapters/carts";
import { getLoggedInUserFromDB } from "../api-adapters/users";

const SingleProductCard = (props) => {
  const product = props.product;
  const setAlert = props.setAlert;
  const grabCartProducts = props.grabCartProducts;
  const [user, setUser] = useState({});
  const isLoggedIn = props.isLoggedIn;

  async function handleAddToCart() {
    try {
      await createCartProductDB(product.id);
      grabCartProducts();
      console.log(`${product.name} added to cart!`);
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
    <div id="product-card-container" className="h-[700px]">
      <div id="product-card" className="max-w-sm w-full ml-2 mr-2 h-full mb-5">
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
              className="object-fill w-full min-h-[300px] max-h-[300px]"
            />
          </figure>

          <div className="card-body">
            <h2 className="card-title flex justify-between w-full min-h-[3vh] max-h-[3vh]">
              <Link to={`/product-view/${product.id}`} className="line-clamp-1">
                {product.name}
              </Link>
              <div className="badge badge-secondary ml-2">
                $
                {String(product.price).slice(
                  0,
                  String(product.price).length - 2
                )}
                .{String(product.price).slice(-2)}
              </div>
            </h2>

            <h5>Seller: {product.seller_name}</h5>
            <p className="line-clamp-2 min-h-[6vh] max-h-[6vh]">
              {product.description}
            </p>

            <div className="card-actions justify-end flex justify-center justify-evenly">
              <div className="flex mt-1 -ml-[1vw] max-h-[6vh] gap-2 min-h-[6vh] min-w-[10vw] max-w-[10vw] overflow-auto">
                {product.tags.length > 0 &&
                  product.tags.map((tag, idx) => {
                    return (
                      <p
                        key={`paragraph in SingleProductCard: ${idx}`}
                        className="self-center badge badge-outline min-h-fit min-w-fit"
                      >
                        {tag.name}
                      </p>
                    );
                  })}
              </div>

              <div className="">
                {user.username && isLoggedIn && (
                  <button
                    onClick={handleAddToCart}
                    className="ml-[1.8vw] btn btn-success"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCard;
