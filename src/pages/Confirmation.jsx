import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { placeOrderDB } from "../api-adapters/carts";

const Confirmation = () => {
  const { cartNumber } = useParams();

  useEffect(() => {
    placeOrderDB(cartNumber);
  }, [cartNumber]);

  return (
    <div id="confirmation-page">
      <h1>Confirmed</h1>
      {cartNumber && <h1>{cartNumber}</h1>}
    </div>
  );
};

export default Confirmation;
