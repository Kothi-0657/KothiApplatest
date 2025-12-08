// src/config/db.ts
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "kishlaysingh",     // 👈 your Postgres username
  host: "localhost",
  database: "homeservice",  // 👈 your DB name
  password: "",             // if you set one in psql, add here
  port: 5432,
});

pool.connect((err?: Error) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database");
  }
});

export default pool;
