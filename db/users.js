import { client } from "./index.js";
import bcrypt from "bcrypt";

export async function createUser({
  username,
  password,
  email,
  first_name,
  last_name,
  is_admin,
}) {
  try {
    const SALT_COUNT = 10;

    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (username, password, email, first_name, last_name, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (username) DO NOTHING
      RETURNING username, email, first_name, last_name
      `,
      [username, hashedPassword, email, first_name, last_name, is_admin]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE id=$1;
        `,
      [userId]
    );
    if (user) {
      delete user.password;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const { rows } = await client.query(`
        SELECT id, username, first_name, last_name, email, is_admin, active 
        FROM users;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function getUser(username) {
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

export async function updateUser({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, idx) => `"${key}"=$${idx + 1}`)
    .join(", ");

  try {
    if (setString.length) {
      await client.query(
        `
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *
      `,
        Object.values(fields)
      );

      return await getUserById(id);
    }
  } catch (error) {
    throw error;
  }
}
