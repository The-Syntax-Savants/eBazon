
import React, {useEffect, useState} from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Footer, Home, Register, Login, Profile, CreateProduct } from "./";
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
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/createProduct" element={<CreateProduct />} />
          <Route exact path="/:username/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
