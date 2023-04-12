import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { placeOrderDB } from "../api-adapters/carts";

const Confirmation = () => {
  const { cartNumber } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    placeOrderDB(cartNumber);
  }, [cartNumber]);

  return (
    <div id="confirmation-page" className="h-screen flex flex-col items-center justify-center">
      <div className="mb-[60vh]">
      <h1 className="text-6xl">Order Placed!</h1>
      <button className="btn btn-primary mt-[3vh] ml-[7vw]" onClick={()=>{
        navigate("/")
      }}>Home</button>
      </div>
    </div>
  );
};

export default Confirmation;
