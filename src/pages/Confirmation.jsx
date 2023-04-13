import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { placeOrderDB } from "../api-adapters/carts";

const Confirmation = () => {
  const { cartNumber } = useParams();
  const navigate = useNavigate();

  // Replace this with the actual user's email address from their profile
  const [email, setEmail] = useState("user@example.com");

  useEffect(() => {
    placeOrderDB(cartNumber);
  }, [cartNumber]);

  return (
    <div
      id="confirmation-page"
      className="h-screen flex flex-col items-center justify-start bg-gray-100 pt-20"
    >
      <div className="bg-white rounded-lg p-8 shadow-md">
        <h1 className="text-6xl mb-6 font-semibold text-green-600">
          Order Placed!
        </h1>
        <h2 className="text-4xl mb-6 font-medium text-gray-800">
          Thank you for shopping with us!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          A confirmation email with tracking details has been sent to{" "}
          <span className="font-medium">{email}</span>.
        </p>
        <button
          className="btn btn-primary btn-rounded bg-success mt-4 px-8 py-2 text-xl hover:bg-success-focus transition-colors duration-200"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
