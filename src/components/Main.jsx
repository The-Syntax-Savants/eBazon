import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Footer, Home, Register } from "./";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";

const Main = () => {

  return (
    <div id="main">
      <div id="navbar-container">
        <Navbar />
      </div>
      <div id="container">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
