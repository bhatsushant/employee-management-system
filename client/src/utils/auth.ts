// src/utils/auth.js
import axios from "axios";

export async function checkAuth() {
  try {
    const response = await axios.get("http:/localhost:3000/auth/session", {
      withCredentials: true
    });
    console.log(response.data.user);
    return response.data.user;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
}
