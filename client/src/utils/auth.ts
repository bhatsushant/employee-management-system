// src/utils/auth.js
import axios from "axios";

const client = import.meta.env.VITE_API_URL;

export async function checkAuth() {
  try {
    const response = await axios.get(`${client}/auth/session`, {
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
    return response.data.user;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
}
