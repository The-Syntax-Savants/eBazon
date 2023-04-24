import React from "react";

const SellerPage = () => {
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: "$10",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Product 2",
      price: "$15",
      imageUrl: "https://via.placeholder.com/150",
    },
    // Add more products here
  ];

  const seller = {
    name: "John Doe",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultricies nisi dolor, at fermentum lacus dapibus ac.",
    imageUrl: "https://via.placeholder.com/100",
  };

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
      <h1 className="text-3xl font-bold mb-6">Seller Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Products for Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="card bordered shadow-md p-4 h-full"
              >
                <img src={product.imageUrl} alt={product.name} />
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold">
                    {product.name}
                  </h2>
                  <p>{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Seller Details</h2>
          <div className="card bordered shadow-md p-4">
            <img
              className="mx-auto mb-4"
              src={seller.imageUrl}
              alt={seller.name}
            />
            <div className="card-body">
              <h2 className="card-title text-xl font-bold">{seller.name}</h2>
              <p>{seller.description}</p>
            </div>
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
