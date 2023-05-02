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
    const conversation = await client.query(
      `
            SELECT m.id, m.sender_name, m.receiver_name, m.product_id, m.message, m.sent_at, m.read_at 
            FROM messages m 
            WHERE ((m.sender_name = $1 AND m.receiver_name = $2) OR (m.sender_name = $2 AND m.receiver_name = $1))
            AND m.product_id = $3 
            ORDER BY m.sent_at ASC;
        `,
      [user1Name, user2Name, productId]
    );
    return conversation.rows;
  } catch (error) {
    console.log("Error in getConversationBetweenUsersForProduct in DB");
    throw error;
  }
}

export async function setMessageToRead({senderName, receiverName, productId}) {
  try {
    const { rows } = await client.query(
      `
        UPDATE messages
        SET read_at = NOW()
        WHERE product_id = $3
        AND (sender_name = $1 AND receiver_name = $2)
        AND read_at IS NULL
        RETURNING *;
        `,
      [senderName, receiverName, productId]
    );

    return rows;
  } catch (error) {
    console.log("Error in setMessageToRead in DB");
    throw error;
  }
}

export async function getAllUnreadMessagesByUsername(receiverName) {
  try {
    const { rows } = await client.query(
      `
        SELECT m.id, m.sender_name, m.receiver_name, m.product_id, m.message, m.sent_at, m.read_at, p.name AS product_name
        FROM messages m
        INNER JOIN products p ON m.product_id = p.id
        WHERE m.receiver_name = $1 AND m.read_at IS NULL
        ORDER BY m.sent_at ASC;
      
        `,
      [receiverName]
    );
    return rows;
  } catch (error) {
    console.log("Error in getAllUnreadMessagesByUsername in DB");
    throw error;
  }
}

// export async function createOffer({
//   senderName,
//   receiverName,
//   productId,
//   messageText,
//   offerPrice,
// }) {
//   try {
//     const { rows: [offer] } = await client.query(
//       `
//       INSERT INTO messages (sender_name, receiver_name, product_id, message, is_offer, offer_price, offer_status, sent_at)
//       VALUES ($1, $2, $3, $4, true, $5, 'pending', CURRENT_TIMESTAMP)
//       RETURNING *;
//     `,
//       [senderName, receiverName, productId, messageText, offerPrice]
//     );

//     return offer;
//   } catch (error) {
//     console.log("Error in createOffer in DB");
//     throw error;
//   }
// }
