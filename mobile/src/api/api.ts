import axios from "axios";

const API_URL = "http://localhost:4000"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
