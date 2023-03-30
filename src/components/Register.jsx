import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserInDB } from "../api-adapters";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate()

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
          setAlert(data.message);
          navigate("/")
      }
    } else {
      setAlert("Error: Confirmed Password must match Password. And, password must be at least 8 characters long!");
    }
  };
  return (
    <div>
      <form onSubmit={(e)=>{
        e.preventDefault()
        createUser()
      }}>
        <h2>Register</h2>
        <label className="input-group">
          <span>Username</span>
          <input
            required
            type="text"
            placeholder="User1"
            className="input input-bordered"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>
        <label className="input-group">
          <span>Password</span>
          <input
            required
            type="password"
            placeholder="minimum 8 characters"
            className="input input-bordered"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <label className="input-group">
          <span>Confirm Password</span>
          <input
            required
            type="password"
            placeholder="minimum 8 characters"
            className="input input-bordered"
            onChange={(e) => {
              setConfirmedPassword(e.target.value);
            }}
          />
        </label>
        <label className="input-group">
          <span>First Name</span>
          <input
            required
            type="text"
            placeholder="John"
            className="input input-bordered"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </label>
        <label className="input-group">
          <span>Last Name</span>
          <input
            required
            type="text"
            placeholder="Doe"
            className="input input-bordered"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </label>
        <label className="input-group">
          <span>Email</span>
          <input
            required
            type="text"
            placeholder="info@site.com"
            className="input input-bordered"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <button type="submit" className="btn btn-info">
          Submit
        </button>
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
