import { BASE_URL } from "./index.js";

export const getAllUnreadMessagesForUserDB = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const result = await response.json();
    console.log(result, " getAllUnreadMessagesForUserDB result");
    return result;
  } catch (error) {
    // console.log("Error in getAllUnreadMessagesForUserDB Call!");
    console.error(error);
  }
};