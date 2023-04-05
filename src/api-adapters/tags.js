const BASE_URL = "http://localhost:3001/api"

export const getAllTagsDB = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/tags`, {
          METHOD: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        const result = await response.json();
        console.log(result.tags)
        return result.tags;
      } catch (error) {
        console.log("Error in getAllTagsDB Call!");
        console.error(error);
      }
}

