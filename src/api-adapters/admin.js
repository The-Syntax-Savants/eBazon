const BASE_URL = "http://localhost:3001/api";
// const BASE_URL = "https://ebazon.onrender.com/api"

export const deleteProductInDB = async (id, token) => {
    try {
        const response = await fetch (`${BASE_URL}/${id}/delete`, {
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