import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { getLoggedInUserFromDB, editUserDB } from "../api-adapters/users";

const Profile = () => {
  const { username } = useParams();
  // const fileInputRef = useRef()
  let token = "";
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
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
  const [alert, setAlert] = useState("")

  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0]
  //   setProfilePicture(file)
  // }

  const grabUserInfo = async () => {
    let user = await getLoggedInUserFromDB(token);
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      if(user.address_line_1){
        setAddress1(user.address_line_1);
      }
      if(user.address_line_2){
        setAddress2(user.address_line_2);
      }
      if(user.city){
        setCity(user.city);
      }
      if(user.state){
        setState(user.state);
      }
      if(user.zipcode){
        setZipcode(user.zipcode);
      }
      if(user.about){
        setAbout(user.about);
      }
      if(user.profile_picture){
        setProfilePicture(user.profile_picture);
      }
      if(user.active){
        setActive(user.active);
      }
    }
  };

  useEffect(() => {
    grabUserInfo();
  }, []);

  const submitChanges = async () => {
    const data = await editUserDB(username, token, password, firstName, lastName, email, address1, address2, city, state, zipcode, about, profilePicture, active)
    if(data.message){
        setAlert(`Error: ${data.message}`)
    }else{
        console.log(data)
    }
  }

  return (
    <div className="container m-8">
    <form onSubmit={(e)=>{
        e.preventDefault()
        submitChanges()
    }}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">{username}'s Profile</h1>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
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
    </div>
  );
};

export default Profile;
