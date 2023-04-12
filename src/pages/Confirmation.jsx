import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { placeOrderDB } from "../api-adapters/carts";

const Confirmation = () => {
  const { cartNumber } = useParams();

  useEffect(() => {
    placeOrderDB(cartNumber);
  }, [cartNumber]);

  return (
    <div id="confirmation-page" className="h-screen text-center">
      <h1>Order Placed!</h1>
    </div>
  );
};

export default Confirmation;
