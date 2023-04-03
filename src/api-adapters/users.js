const BASE_URL = "https://ebazon.onrender.com/api"

export const createUserInDB = async (username, password, email, first_name, last_name) => {
    try {
        const response = await fetch (`${BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                first_name: first_name,
                last_name: last_name
            })
        })
        
        const result = await response.json()
        console.log(result)
        return result
    } catch (error) {
        console.error(error)
    }
}

export const loginUserDB = async (username, password) => {
    try {
        const response = await fetch (`${BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const result = await response.json()
        console.log(result) 
        return result
    } catch (error) {
        console.error(error)
    }
}

export const editUserDB = async (username, token, password, first_name, last_name, email, address_line_1, address_line_2, city, state, zipcode, about, profile_picture, active) => {
    try {
        const response = await fetch (`${BASE_URL}/users/${username}/profile/edit`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                password: password,
                first_name: first_name,
                last_name: last_name,
                email: email,
                address_line_1: address_line_1,
                address_line_2: address_line_2,
                city: city,
                state: state,
                zipcode: zipcode,
                about: about,
                profile_picture: profile_picture,
                active: active

            })
        })

        const result = await response.json()
        console.log(result) 
        return result
    } catch (error) {
        console.error(error)
    }
}

export const getLoggedInUserFromDB = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log(result)
      return result;
    } catch (err) {
      console.error(err);
    }
  };

// module.exports = {
//     createUserInDB,
//     loginUserDB,
//     editUserDB,
//     getLoggedInUserFromDB
// }