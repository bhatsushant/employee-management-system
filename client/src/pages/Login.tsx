import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signInWithGooglePopup } from "@/utils/firebase";
import { useAuth } from "@/contexts/UserContext";
import logo from "../../public/app_logo.svg";
import googleLogo from "@/assets/google_logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/auth", {
        email,
        password
      });
      setCurrentUser(data.currentUser);
      localStorage.setItem("verifiedUser", "true");
      localStorage.setItem("user", JSON.stringify(data.currentUser));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      setCurrentUser(user);
      localStorage.setItem("verifiedUser", "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed with Google", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={logo} alt="Company Logo" className="h-1/3" />
      <h1 className="text-3xl font-semibold mb-4">Login</h1>
      <form className="w-full max-w-sm" onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Sign In
        </Button>
        <Button
          onClick={handleSignInWithGoogle}
          className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
        >
          <img src={googleLogo} alt="Google Button" className="mr-2" />
          Sign In with Google
        </Button>
      </form>
    </div>
  );
};

export default Login;
