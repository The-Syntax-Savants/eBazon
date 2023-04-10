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
  Checkout,
} from "./pages";
import { Navbar, Footer, Pagination } from "./components";
import { getActiveCartProductsDB } from "./api-adapters/carts";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [cartProductsCount, setCartProductsCount] = useState([]);

  const grabCartProducts = async () => {
    const data = await getActiveCartProductsDB();
    let tempSubTotal = 0;
    for (let i = 0; i < data.length; i++) {
      tempSubTotal += data[i].product.price * data[i].quantity;
    }
    setSubTotal(tempSubTotal / 100);
    setCartProductsCount(data.length);
  };

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    const localStorageUsername = localStorage.getItem("username");
    if (localStorageToken && localStorageUsername) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div id="main">
      <div id="navbar-container mb-10">
        <Navbar
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          subTotal={subTotal}
          cartProductsCount={cartProductsCount}
          grabCartProducts={grabCartProducts}
        />
      </div>

      <div id="content">
        <Routes>
          <Route
            exact
            path="/"
            element={<Home grabCartProducts={grabCartProducts} />}
          />
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
            element={<SingleProductView grabCartProducts={grabCartProducts} />}
          />
          <Route path="/:username/profile" element={<Profile />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/panel" element={<AdminPanel />} />
          <Route
            path="/my-cart"
            element={
              <Cart subTotal={subTotal} grabCartProducts={grabCartProducts} />
            }
          />
          <Route path="/checkout" element={<Checkout subTotal={subTotal} />} />
        </Routes>
      </div>
      <div id="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default App;
