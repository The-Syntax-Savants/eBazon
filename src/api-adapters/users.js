const BASE_URL = "http://localhost:3001/api";
// const BASE_URL = "https://ebazon.onrender.com/api"

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
    console.log(result);
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
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const editUserDB = async (user) => {
  console.log(user, "WHAT IS BEING PASSED IN");
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
    console.log(result);
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
    //Because of the navbar, this console log causes the user information to be logged for every single render of the page. annoying. should get rid of it -Emilio
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};
