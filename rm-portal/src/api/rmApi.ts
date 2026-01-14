// src/api/rmApi.ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api"; // RM routes prefixed with /rm

interface RMApiOptions extends RequestInit {
  body?: any; // allow object body (JS object)
}

export const rmApi = async (url: string, options: RMApiOptions = {}) => {
  const token = localStorage.getItem("rm_token");

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
      // Only stringify if body is an object and not already a string
      body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    // If no content (204), return null
    if (res.status === 204) return null;

    // Try to parse JSON, fallback to null if no content
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    return null;
  } catch (err) {
    console.error("rmApi fetch error:", err);
    throw err;
  }
};
