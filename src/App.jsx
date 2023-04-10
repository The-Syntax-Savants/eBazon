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
  SearchResults,
  Checkout,
  // Stripe,
} from "./pages";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Navbar, Footer, Pagination } from "./components";
import { createPaymentIntent } from "./api-adapters/stripe";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const stripePromise = loadStripe(
    "pk_test_51MvOTQLhGAqNc30vaCPHwOYngRS0iERaK2A9QymnF3g6Y0VUDpNBiB5Wveb9Vt62YZ3NyXMWwjonuaKiOBHl4mZQ00gY6bvm8D"
  );

  // useEffect(() => {
  //   createPaymentIntent().then((data) => {
  //     console.log(data.clientSecret, "CLIENT SECRET");
  //     setClientSecret(data.clientSecret);
  //   });
  // }, []);

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    const localStorageUsername = localStorage.getItem("username");
    if (localStorageToken && localStorageUsername) {
      setIsLoggedIn(true);
    }
    console.log("RUNNING USE EFFECT");
    createPaymentIntent().then((data) => {
      setClientSecret(data.clientSecret);
      console.log(data.clientSecret, "CLIENT SECRET");
      console.log(clientSecret, "CLIENT SECRET STATE");
    });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div id="main">
      <div id="navbar-container mb-10">
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
          <Route
            path="/search-results/:searchInput/:tagInput"
            element={<SearchResults />}
          />
          <Route
            path="/checkout"
            element={
              clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <Checkout />
                </Elements>
              )
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
