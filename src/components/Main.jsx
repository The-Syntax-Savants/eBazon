import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Navbar,
  Footer,
  Home,
  Register,
  Login,
  Profile,
  CreateProduct,
} from "./";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    const localStorageUsername = localStorage.getItem("username");
    if (localStorageToken && localStorageUsername) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div id="main">
      <div id="navbar-container">
        <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </div>

      <div id="content">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/register"
            element={<Register setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/createProduct" element={<CreateProduct />} />
          <Route path="/:username/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
