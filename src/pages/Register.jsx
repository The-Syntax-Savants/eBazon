import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserInDB } from "../api-adapters/users";

const Register = (props) => {
  const setIsLoggedIn = props.setIsLoggedIn;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  const createUser = async () => {
    if (password === confirmedPassword && password.length > 7) {
      const data = await createUserInDB(
        username,
        password,
        email,
        firstName,
        lastName
      );
      if (data.name) {
        setAlert(`Error: ${data.message}`);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        setIsLoggedIn(true);
        setAlert(data.message);
        navigate("/");
      }
    } else {
      setAlert(
        "Error: Confirmed Password must match Password. And, password must be at least 8 characters long!"
      );
    }
  };
  return (
    <div className="flex items-center justify-center h-screen w-[97vw] my-[5vh] overflow-hidden">
      <form className=""
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
      >
        <div className="hero h-fit w-full bg-base-200">
          <div className="hero-content flex flex-col w-screen">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Register!</h1>
            </div>
            <div className="card mb-[16vh] flex-shrink-0 w-full max-w-sm h-[60vh] shadow-2xl bg-base-100 overflow-y-auto">
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
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    placeholder="email"
                    className="input input-bordered"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="first name"
                    className="input input-bordered"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="last name"
                    className="input input-bordered"
                    onChange={(e) => {
                      setLastName(e.target.value);
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirmed Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="confirm password"
                    className="input input-bordered"
                    onChange={(e) => {
                      setConfirmedPassword(e.target.value);
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

export default Register;
