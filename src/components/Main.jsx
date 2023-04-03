import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Footer, Home, Register, Login } from "./";
import CreateProduct from "./CreateProduct";
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
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/createProduct" element={<CreateProduct />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
