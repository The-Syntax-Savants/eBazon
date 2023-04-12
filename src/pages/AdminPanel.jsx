import React, { useEffect, useState } from "react";
import { editUserDB, getLoggedInUserFromDB } from "../api-adapters/users";
import {
  getAllUsersFromDB,
  addTagInDB,
  editTagInDB,
  deleteTagInDB,
} from "../api-adapters/admin";
import { getAllTagsDB } from "../api-adapters/tags";

const AdminPanel = () => {
  const [admin, setAdmin] = useState({is_admin: false});
  const [allUsers, setAllUsers] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [alert, setAlert] = useState("");

  const fetchUsersAndTags = async () => {
    //make api adapter for getAllUsersDB then populate diasyUI table
    const data = await getAllUsersFromDB();
    setAllUsers(data.users);

    const grabTags = await getAllTagsDB();
    setAllTags(grabTags);
  };

  const fetchAdmin = async () => {
    if(localStorage.getItem("token")){
      const data = await getLoggedInUserFromDB();
      if (data.is_admin) {
        setAdmin(data);
      }else{
        setAlert(`Error: You must be an Admin to access this page`)
      }
    }else{
      setAlert(`Error: You must be an Admin to access this page`)
    }
  };
  useEffect(() => {
      fetchAdmin();
  }, []);

  useEffect(() => {
    if (admin.is_admin) {
      fetchUsersAndTags();
    }
  }, [admin]);
  return (
    <>
      {allUsers.length ? (
        <div id="container" className="container flex flex-col items-center h-screen overflow-auto">
          <div id="admin-title" className="text-center mt-[4vh]">
          <h3 className="text-3xl font-bold text-gray-800">Welcome {admin.first_name} To Your Admin Panel</h3>
          </div>
          <div id="admin-tables" className="flex max-h-[60vh]">
              <div
                id="users-table"
                className="overflow-x-scroll overflow-y-scroll table-responsive max-w-[50vw] max-h-screen m-5"
              >
                {allTags.length && (
                  <table className="table w-full table-compact">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Active?</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address1</th>
                        <th>Address2</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Zipcode</th>
                        <th>ID</th>
                        <th>Admin?</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user, idx) => {
                        delete user.password
                        return (
                          <tr key={user.id} className="hover">
                            <th>{idx + 1}</th>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            {user.active ? <td>True</td> : <td>False</td>}
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.address_line_1}</td>
                            <td>{user.address_line_2}</td>
                            <td>{user.city}</td>
                            <td>{user.state}</td>
                            <td>{user.zipcode}</td>
                            <td>{user.id}</td>
                            {user.is_admin ? <td>True</td> : <td>False</td>}
                            <td><button onClick={async ()=>{
                              user.active = false
                              await editUserDB(user)
                            }}>Delete</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div
                id="tags-table"
                className="overflow-x-auto overflow-y-scroll mt-5 table-responsive h-full"
              >
                {allTags.length && (
                  <table className="table w-full table-compact">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTags.map((tag, idx) => {
                        return (
                          <tr key={tag.id} className="hover">
                            <th>{idx + 1}</th>
                            <td
                              onClick={async (e) => {
                                e.preventDefault();
                                const data = await editTagInDB(tag.id, newTag);
                                if (data.name) {
                                  setAlert(`Error: ${data.message}`);
                                } else {
                                  setAlert(data.message);
                                }
                              }}
                            >
                              {tag.name}
                            </td>
                            <td
                              onClick={async (e) => {
                                e.preventDefault();
                                const data = await deleteTagInDB(tag.id);
                                if (data.name) {
                                  setAlert(`Error: ${data.message}`);
                                } else {
                                  setAlert(data.message);
                                }
                              }}
                            >
                              <button>delete</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
          </div>
                <input
                  type="text"
                  placeholder="New Tag Or Edit Tag"
                  className="input mt-[2.8vh] ml-[53vw] input-bordered input-primary w-[18vw]"
                  onChange={(e) => {
                    setNewTag(e.target.value);
                  }}
                />
                <div className="ml-[53vw]">
                <button
                  className="btn btn-outline btn-primary"
                  type="Submit"
                  onClick={async (e) => {
                    e.preventDefault();
                    const data = await addTagInDB(newTag);
                    if (data.message) {
                      setAlert(`Error: ${data.message}`);
                    } else {
                      setAlert(
                        `Tag "${data.name}" has successfully been created`
                      );
                    }
                  }}
                >
                  Submit
                </button></div>
          
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-gray-800">Administrator login required</h1>
      )}
      {alert.startsWith("Error") ? (
            <div className=" w-screen alert alert-error shadow-lg container flex flex-col items-center justify-center max-h-screen overflow-auto mt-[60px]">
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
            <div className="w-screen alert alert-success shadow-lg container flex flex-col items-center justify-center max-h-screen overflow-auto mt-[60px]">
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
    </>
  );
};

export default AdminPanel;
