import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { getLoggedInUserFromDB, editUserDB } from "../api-adapters/users";

const Profile = () => {
  const { username } = useParams();
  // const fileInputRef = useRef()
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [about, setAbout] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [active, setActive] = useState("");
  const [id, setId] = useState(0);
  const [alert, setAlert] = useState("");

  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0]
  //   setProfilePicture(file)
  // }

  const grabUserInfo = async () => {
    let user = await getLoggedInUserFromDB();
    if (user) {
      setId(user.id);
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setAddress1(user.address_line_1 || "");
      setAddress2(user.address_line_2 || "");
      setCity(user.city || "");
      setState(user.state || "");
      setZipcode(user.zipcode || "");
      setAbout(user.about || "");
      setProfilePicture(user.profile_picture || "");
      setActive(user.active || "");
    }
  };

  useEffect(() => {
    grabUserInfo();
  }, []);

  const submitChanges = async () => {
    if (password && password.length < 8) {
      setAlert(`Error: Your password must be at least 8 characters!`);
    } else {
      const data = await editUserDB({
        id,
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
        address_line_1: address1,
        address_line_2: address2,
        city,
        state,
        zipcode,
        about,
        profile_picture: profilePicture,
        active,
      });
      if (data.message) {
        setAlert(`Error: ${data.message}`);
      } else {
        setAlert(`You have successfully updated your Profile!`);
        console.log(data);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen my-[5vh] overflow-hidden">
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          submitChanges();
        }}
      >
        <div className="hero h-fit w-full bg-base-200">
          <div className="hero-content flex flex-col w-screen">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Profile!</h1>
            </div>
            <div className="card mb-[16vh] flex-shrink-0 w-full max-w-lg h-[60vh] shadow-2xl bg-base-100 overflow-y-auto">
              <div className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    value={email}
                    className="input input-bordered"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="text"
                    placeholder="password"
                    className="input input-bordered"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
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
                    value={lastName}
                    className="input input-bordered"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address Line 1</span>
                  </label>
                  <input
                    type="text"
                    value={address1}
                    className="input input-bordered"
                    onChange={(e) => {
                      setAddress1(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address Line 2</span>
                  </label>
                  <input
                    type="text"
                    value={address2}
                    className="input input-bordered"
                    onChange={(e) => {
                      setAddress2(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    className="input input-bordered"
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State</span>
                  </label>
                  <input
                    type="text"
                    value={state}
                    className="input input-bordered"
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Zipcode</span>
                  </label>
                  <input
                    type="text"
                    value={zipcode}
                    className="input input-bordered"
                    onChange={(e) => {
                      setZipcode(e.target.value);
                    }}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">About</span>
                  </label>
                  <input
                    type="text"
                    value={about}
                    className="input input-bordered"
                    onChange={(e) => {
                      setAbout(e.target.value);
                    }}
                  />
                </div>
                {/* <input
                type="file"
                className="file-input file-input-ghost w-full max-w-xs"
                onChange={(e)=>{
                  setProfilePicture(e.target.files)
                }}
              /> */}
                <div className="form-control mt-6">
                  <button className="btn btn-primary" type="submit">
                    Submit Changes
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

export default Profile;
