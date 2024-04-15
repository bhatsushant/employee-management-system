import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
// import { nativeSignIn, auth, signInWithGooglePopup } from "@/utils/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth", {
        email,
        password
      });
      console.log("Login successful", response.data);
      // Redirect or perform actions after successful login
    } catch (error) {
      console.error("Login failed", error);
      // Handle login failure
    }
  };

  const handleSignInWithGoogle = async () => {
    // Implement Google sign-in logic if needed
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold mb-4">Login</h1>
      <form className="w-full max-w-sm" onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Sign In
        </Button>
      </form>
      <Button
        onClick={handleSignInWithGoogle}
        className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
      >
        Sign In with Google
      </Button>
    </div>
  );
};

export default Login;
