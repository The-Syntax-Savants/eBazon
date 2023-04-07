import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  Profile,
  CreateProduct,
  SingleProductView,
  EditProduct,
  AdminPanel,
  Cart,
} from "./pages";
import { Navbar, Footer } from "./components";
const App = () => {
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
          <Route
            path="/product-view/:productId"
            element={<SingleProductView />}
          />
          <Route path="/:username/profile" element={<Profile />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/panel" element={<AdminPanel />} />
          <Route path="/my-cart" element={<Cart />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
