// src/utils/auth.js
import axios from "axios";

export async function checkAuth() {
  try {
    const response = await axios.get("http://localhost:3000/auth/session", {
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
