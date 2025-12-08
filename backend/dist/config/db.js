"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/db.ts
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const pool = new Pool({
    user: "kishlaysingh", // 👈 your Postgres username
    host: "localhost",
    database: "homeservice", // 👈 your DB name
    password: "", // if you set one in psql, add here
    port: 5432,
});
pool.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    }
    else {
        console.log("✅ Connected to PostgreSQL database");
    }
});
exports.default = pool;
