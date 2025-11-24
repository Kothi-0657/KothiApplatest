import axios from "axios";

const API_URL = "http://192.168.1.12:4000/api"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
