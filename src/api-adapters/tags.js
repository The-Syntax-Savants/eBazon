import { BASE_URL } from "./index.js";

export const getAllTagsDB = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tags`, {
      METHOD: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    // console.log(result.tags, " getAllTagsDB result");
    return result.tags;
  } catch (error) {
    console.log("Error in getAllTagsDB Call!");
    console.error(error);
  }
};
