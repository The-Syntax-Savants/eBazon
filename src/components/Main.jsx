import React, {useEffect, useState} from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Footer, Home, Register, Login, Profile } from "./";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(()=>{
    const localStorageToken = localStorage.getItem("token")
    const localStorageUsername = localStorage.getItem("username")
    if(localStorageToken && localStorageUsername){
      setIsLoggedIn(true)
    }
  },[])

  return (
    <div id="main">
      <div id="navbar-container">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      </div>
      <div id="container">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register setIsLoggedIn={setIsLoggedIn}/>} />
          <Route exact path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
          <Route exact path="/:username/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
