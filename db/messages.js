import { client } from "./index.js";

export async function createMessage({
  senderName,
  receiverName,
  productId,
  messageText,
}) {
  try {
    const {
      rows: [message],
    } = await client.query(
      `
            INSERT INTO messages(
                sender_name, receiver_name, product_id, message
            ) VALUES($1, $2, $3, $4)
            RETURNING *;
        `,
      [senderName, receiverName, productId, messageText]
    );
    console.log(message);
    return message;
  } catch (error) {
    console.log("Error in createMessage DB Method");
    throw error;
  }
}

export async function getConversationBetweenUsersForProduct({
  user1Name,
  user2Name,
  productId,
}) {
  try {
    const conversation = await client.query(`
            SELECT m.id, m.sender_name, m.receiver_name, m.product_id, m.message, m.sent_at, m.read_at, u.username  
            FROM messages m 
            INNER JOIN users u ON m.sender_name = u.username 
            WHERE ((m.sender_name = $1 AND m.receiver_name = $2) OR (m.sender_name = $2 AND m.receiver_name = $1))
            AND m.product_id = $3 
            ORDER BY m.sent_at ASC;
        `, [user1Name, user2Name, productId]);
    console.log(conversation.rows);
    return conversation.rows;
  } catch (error) {
    console.log("Error in getConversationBetweenUsersForProduct in DB");
    throw error;
  }
}


export async function setMessageToRead(id){
    try {
        const {rows: message} = await client.query(`
            UPDATE messages
            SET read_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `, [id])

        return message
    } catch (error) {
        console.log("Error in setMessageToRead in DB")
        throw error
    }
}

export async function getAllUnreadMessagesByUsername(receiverName){
    try {
        const {rows} = await client.query(`
            SELECT m.id, m.sender_name, m.receiver_name, m.product_id, m.message, m.sent_at, u.username
            FROM messages m
            INNER JOIN users u ON m.sender_name = u.username
            WHERE m.receiver_name = $1 AND m.read_at IS NULL
            ORDER BY m.sent_at ASC;
        `, [receiverName])
        return rows
    } catch (error) {
        console.log("Error in getAllUnreadMessagesByUsername in DB")
        throw error
    }
}