// src/api/rmApi.ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

interface RMApiOptions extends RequestInit {
  body?: any;
}

export const rmApi = async (url: string, options: RMApiOptions = {}) => {
  // ✅ Get RM token if available
  const token = localStorage.getItem("rm_token");

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
      body:
        options.body && typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body,
    });

    // ❌ Handle errors
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `API Error ${res.status}: ${errorText || res.statusText}`
      );
    }

    // ✅ 204 No Content
    if (res.status === 204) return null;

    // ✅ Check JSON response
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
