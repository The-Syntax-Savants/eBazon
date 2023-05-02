import { useState, useEffect, React } from "react";
import { getProductsBySellerNameDB } from "../api-adapters/products";
import { useParams } from "react-router-dom";
import { SingleProductCard } from "../components";
import { Button } from "antd";

const SellerPage = (props) => {
  const { seller_name } = useParams();
  const [products, setProducts] = useState([]);
  const isLoggedIn = props.isLoggedIn;

  const fetchSellerProducts = async () => {
    const fetchedProducts = await getProductsBySellerNameDB(seller_name);
    console.log(fetchedProducts, "fetchedProducts");
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  console.log(products);

  const reviews = [
    {
      id: 1,
      author: "Jane Doe",
      content: "Great product, fast delivery!",
    },
    {
      id: 2,
      author: "Mark Smith",
      content: "I'm very satisfied with my purchase.",
    },
    // Add more reviews here
  ];

  return (
    <div className="p-6">
      <div className="card bordered shadow-md p-4">
        <span className="flex items-center justify-center">
          <h1 className="text-3xl font-bold mb-0">
            {seller_name}'s Store Page
          </h1>
          <button className="btn drop-shadow-lg btn-success ml-3 transform scale-75">
            Message
          </button>
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-1 justify-items-center">
            {products.products &&
              products.products.map((product) => (
                <div className="transform scale-75">
                  <SingleProductCard
                    product={product}
                    key={`This is the key: ${product.id}`}
                    isLoggedIn={isLoggedIn} // Pass the 'isLoggedIn' prop if necessary
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="card bordered shadow-md p-4 mb-4">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">
                  {review.author}
                </h2>
                <p>{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
