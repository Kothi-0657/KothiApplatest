import { Pool } from "pg";
import bcrypt from "bcryptjs";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const createUserTable = async (pool: Pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(15) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const createUser = async (pool: Pool, user: IUser) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone`,
    [user.name, user.email, user.phone, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByEmail = async (pool: Pool, email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};
