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

export const markConversationAsReadDB = async (senderName, receiverName, productId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({senderName: senderName, receiverName: receiverName})
    })
    const result = await response.json()
    console.log(result, "markConversationAsReadDB result")
    return result
  } catch (error) {
    console.error(error)
  }
}

export const getConversationDB = async ({user1Name, user2Name, productId}) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/conversation/${user1Name}/${user2Name}/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    })
    const result = await response.json()
    console.log(result, "getConversationDB result")
    return result
  } catch (error) {
    console.error(error)
  }
}

