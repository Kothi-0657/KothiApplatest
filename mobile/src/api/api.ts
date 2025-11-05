import axios from "axios";

const API_URL = "http://192.168.29.182:4000/api"; // change to your local IP for physical device

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
