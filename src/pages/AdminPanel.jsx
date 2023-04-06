import React, { useEffect, useState } from "react";
import { getLoggedInUserFromDB } from "../api-adapters/users";
import {
  getAllUsersFromDB,
  addTagInDB,
  editTagInDB,
  deleteTagInDB,
} from "../api-adapters/admin";
import { getAllTagsDB } from "../api-adapters/tags";

const AdminPanel = () => {
  const [admin, setAdmin] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("")
  const [alert, setAlert] = useState("")

  const fetchUsersAndTags = async () => {
    //make api adapter for getAllUsersDB then populate diasyUI table
    const data = await getAllUsersFromDB();
    setAllUsers(data.users);

    const grabTags = await getAllTagsDB();
    setAllTags(grabTags);
  };

  const fetchAdmin = async () => {
    if (localStorage.getItem("token")) {
      const data = await getLoggedInUserFromDB();
      if(data.is_admin){
          setAdmin(data);
      }
    }
  };
  useEffect(() => {
    fetchAdmin();
  }, []);

  useEffect(() => {
    if(admin.is_admin){
        fetchUsersAndTags();
    }
  }, [admin]);
  return (
    <>
      {allUsers.length ? ( 
        <div id="container" className="overflow-y-auto mt-20 max-h-fit">
          <div id="admin-title">
            <h3>Welcome {admin.first_name} To Your Admin Panel</h3>
          </div>
          <div id="admin-tables" className="flex overflow-y-auto max-h-fit">
          <div className="scrollable-container flex">
            <div id="users-table" className="overflow-x-auto overflow-y-auto table-responsive">
              {allTags.length && (
                <table className="table w-full ">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user, idx) => {
                      return (
                        <tr key={user.id} className="hover">
                          <th>{idx + 1}</th>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.id}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div
              id="tags-table"
              className="overflow-x-auto overflow-y-auto table-responsive"
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
                          <td onClick={async (e)=>{
                            e.preventDefault()
                            const data = await editTagInDB(tag.id, newTag)
                            if(data.name){
                                setAlert(`Error: ${data.message}`)
                            }else{
                                setAlert(data.message)
                            }
                          }}>{tag.name}</td>
                          <td onClick={async (e)=>{
                            e.preventDefault()
                            const data = await deleteTagInDB(tag.id)
                            if(data.name){
                                setAlert(`Error: ${data.message}`)
                            }else{
                                setAlert(data.message)
                            }
                        }}><button>delete</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              <input type="text" placeholder="New Tag Or Edit Tag" className="input input-bordered input-primary w-full max-w-xs" onChange={(e)=>{
                setNewTag(e.target.value)
              }}/>
              <button className="btn btn-outline btn-primary" type="Submit" onClick={async (e)=>{
                e.preventDefault()
                const data = await addTagInDB(newTag)
                if(data.message){
                    setAlert(`Error: ${data.message}`)
                }else{
                    setAlert(`Tag "${data.name}" has successfully been created`)
                }
              }}>Submit</button>
            </div>
            </div>
          </div>
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
      ): <h1>Get the fuck outta here normie</h1>}
    </>
  );
};

export default AdminPanel;
