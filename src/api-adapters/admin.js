// const BASE_URL = "http://localhost:3001/api";
const BASE_URL = "https://ebazon.onrender.com/api"

export const deleteProductInDB = async (id, token) => {
    try {
        const response = await fetch (`${BASE_URL}/products/${id}/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        const result = await response.json()
        console.log(result) 
        return result
    } catch (error) {
        console.error(error)
    }
}

//Used so an admin can add an available tag to the database
export const addTagInDB = async(name) => {
    try{
        const response = await fetch(`${BASE_URL}/tags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name: name
            }),
        }) 
        const result = await response.json()
        console.log(result)
        return result
    }catch (error) {
        console.error("Error in api-adapters -> addTagInDB")
        throw error;
    }
}

//Used so an admin can edit the name of a tag in the database. Id used to find the tag since thats what the SQL query uses
export const editTagInDB = async (tagId, name) => {
    try{
        const response = await fetch(`${BASE_URL}/tags/${tagId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                name: name
            })
        })
        const result = await response.json()
        return result
    }catch (error) {
        console.error("Error in api-adapters -> editTagInDB")
    }
}

//Used so an admin can delete a tag from the database. SQL query uses ID to find the appropriate tag. 
export const deleteTagInDB = async(tagId) => {
    try{
        const response = await fetch(`${BASE_URL}/tags/${tagId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        const result = await response.json()
        console.log(result)
        return result

    }catch (error) {
        console.error("Error in api-adapters -> deleteTagInDB")
        throw error
    }

}

export const getAllUsersFromDB = async () =>{
    try{
        const response = await fetch(`${BASE_URL}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        const result = await response.json()
        console.log(result)
        return result

    }catch (error) {
        console.error("Error in api-adapters -> getAllUsersFromDB")
        throw error
    }
}