const BASE_URL = "http://localhost:3001/api"

const createUserInDB = async (username, password, email, first_name, last_name) => {
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
        console.log(username,"username", password,"password", email,"email", first_name,"first_name", last_name,"last_name")
        const result = await response.json()
        console.log(result)
        return result
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createUserInDB,
}