import { BASE_URL } from "./index.js";

export const createUserInDB = async (
  username,
  password,
  email,
  first_name,
  last_name
) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        first_name: first_name,
        last_name: last_name,
      }),
    });

    const result = await response.json();
    // console.log(result, " createUserInDB result");
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const loginUserDB = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result = await response.json();
    // console.log(result, " loginUserDB result");
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const editUserDB = async (user) => {
  if (user.password === "" || user.password.length < 8) {
    delete user.password;
  }
  try {
    const response = await fetch(
      `${BASE_URL}/users/${user.username}/profile/edit`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      }
    );

    const result = await response.json();
    // console.log(result, " editUserDB result");
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getLoggedInUserFromDB = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await response.json();
    // console.log(result, " getLoggedInUserFromDB result");
    return result;
  } catch (err) {
    console.error(err);
  }
};
