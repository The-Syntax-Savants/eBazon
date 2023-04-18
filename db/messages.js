import { client } from "./index.js"

export async function createMessage({senderName, receiverName, productId, messageText}){
    try {
        const {rows: [message]} = await client.query(`
            INSERT INTO messages(
                sender_name, receiver_name, product_id, message
            ) VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [senderName, receiverName, productId, messageText])
        console.log(message)
        return message
    } catch (error) {
        console.log("Error in createMessage DB Method")
        throw error
    }
}