import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUserDB } from "../api-adapters/users";

const Login = (props) => {
  const setIsLoggedIn = props.setIsLoggedIn;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    const data = await loginUserDB(username, password);

    if (data.name) {
      setAlert(`Error: ${data.message}`);
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      setIsLoggedIn(true);
      setAlert("You are logged in!");
      navigate("/");
    }
  };

  return (
    <div
      id="login-page"
      className="flex flex-col items-center justify-center h-fit w-[97vw] my-[5vh]"
    >
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          loginUser();
        }}
      >
        <div className="hero h-fit w-full">
          <div className="hero-content flex flex-col w-screen">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-[3vh]">Login now!</h1>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="username"
                    className="input input-bordered"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="input input-bordered"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control mt-6">
                  <button className="btn btn-primary" type="submit">
                    Login
                  </button>
                </div>
              </div>
            </div>
            <Link className="py-6 link link-hover" to="/register">
              Don't have an account? Sign up here.
            </Link>
          </div>
        </div>
      </form>
      {alert.startsWith("Error") ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alert}</span>
          </div>
        </div>
      ) : alert ? (
        <div className="alert alert-success shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alert}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Login;
