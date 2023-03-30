const { client } = require(".")

async function createUser({username, password, email, first_name, last_name}){
    try {
        const {rows: [user]} = await client.query(`
            INSERT INTO users (username, password, email, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (username) DO NOTHING
            RETURNING username, email, first_name, last_name
        `, [username, password, email, first_name, last_name])
    
        return user
    } catch (error) {
        throw error
    }
}

async function getUserById(userId){
    try {
        const {rows: [user]} = await client.query(`
            SELECT * FROM users
            WHERE id=$1;
        `, [userId])
        if(user){
            delete user.password
        }
        return user
    } catch (error) {
        throw error 
    }
}

async function getAllUsers(){
    try {
        const {rows} = await client.query(`
            SELECT id, username, first_name, last_name, email, is_admin, active 
            FROM users;
        `)
        return rows
    } catch (error) {
        throw error
    }
}

async function getUser(username){
    try {
        const {
            rows: [user],
          } = await client.query(
            `
              SELECT *
              FROM users
              WHERE username=$1;
              `,
            [username]
          );
      
          return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    getUser,
}




