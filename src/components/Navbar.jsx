import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getLoggedInUserFromDB } from "../api-adapters/users";
import { getActiveCartProductsDB } from "../api-adapters/carts";
import { getAllTagsDB } from "../api-adapters/tags";
import { Space, Select } from "antd";

const Navbar = (props) => {
  const [admin, setAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState();
  const [visible, setVisible] = useState("hidden");

  const cartProductsCount = props.cartProductsCount;
  const subTotal = props.subTotal;
  const isLoggedIn = props.isLoggedIn;
  const setIsLoggedIn = props.setIsLoggedIn;
  const grabCartProducts = props.grabCartProducts;

  const navigate = useNavigate();

  const refOne = useRef(null);

  const setAdminStatus = async () => {
    const data = await getLoggedInUserFromDB();
    if (data.is_admin) {
      setAdmin(true);
    }
  };

  useEffect(() => {
    const localStorageUsername = localStorage.getItem("username");
    if (localStorageUsername) {
      setAdminStatus();
      setUsername(localStorageUsername);
      grabCartProducts();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    document.addEventListener(
      "click",
      (evt) => {
        if (!refOne.current.contains(evt.target)) {
          setVisible("hidden");
        } else {
          setVisible("visible");
        }
      },
      true
    );
  }, []);

  function handleViewCart() {
    navigate("/my-cart");
  }

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            {!username && !isLoggedIn && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {username && isLoggedIn && (
              <li>
                <Link to={`/${username}/profile`}>Profile</Link>
              </li>
            )}
            {username && isLoggedIn && (
              <li>
                <Link to="/createProduct">Create Listing</Link>
              </li>
            )}
            {admin && (
              <li>
                <Link to="/panel">Admin</Link>
              </li>
            )}
            {username && isLoggedIn && (
              <li>
                <a
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    grabCartProducts();
                    setUsername("");
                    setIsLoggedIn(false);
                    setAdmin(false);
                    navigate("/");
                  }}
                >
                  Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          eBazon
        </Link>
      </div>
      <div className="navbar-end">
        <form
          action=""
          ref={refOne}
          id="search-form"
          className="relative w-max flex flex-row "
          onSubmit={async (e) => {
            e.preventDefault();

            if (search !== undefined && search.length > 0) {
              document.getElementById("search-form").reset();
              setVisible("hidden");
              navigate(`/search-results/${search}`);
            }
          }}
        >
          {/* THIS IS THE SEARCH INPUT */}
          <input
            type="search"
            placeholder="Search Products"
            name="search"
            id="search"
            className="relative peer z-10 bg-transparent w-12 h-12 rounded-full border cursor-pointer outline-none
            pl-12 
            focus:w-full focus:border-indigo-600 focus:cursor-text focus:pl-16 focus:pr-4"
            autoComplete="off"
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
          />

          {/* THIS IS THE SEARCH SVG*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-y-0 my-auto h-8 w-12 px-3.5 stroke-gray-500 border-r border-transparent peer-focus:border-indigo-600 peer-focus:stroke-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <button
            type="submit"
            className={`btn btn-ghost border-solid border-1 border-indigo-600 w-20 ml-2 mr-2 ${visible}`}
          >
            Search
          </button>
        </form>

        {/* <<<<<----- End of Search Button */}

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle ">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">
                  {cartProductsCount}
                </span>
              </div>
            </label>
            <div
              tabIndex={0}
              className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <span className="font-bold text-lg">
                  {cartProductsCount} Items In Cart
                </span>
                {username ? (
                  <span className="text-info">Subtotal: ${subTotal}</span>
                ) : (
                  <span className="text-info">You must be logged in!</span>
                )}
                {username && (
                  <div className="card-actions">
                    <button
                      onClick={handleViewCart}
                      className="btn btn-primary btn-block"
                    >
                      View cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
