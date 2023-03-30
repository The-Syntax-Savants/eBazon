import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Footer } from "./";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";

const Main = () => {
  return (
    <div id="main">
      <div id="navbar-container">
        <Navbar />
      </div>
      <div id="container">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum
          voluptatum eveniet sunt porro hic iste sit? Delectus fugit accusantium
          facilis architecto commodi iste, ex iusto quibusdam cumque, laborum
          ipsam ea?
        </p>
      </div>
    </div>
  );
};

export default Main;
