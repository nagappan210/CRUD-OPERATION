import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField"; 
import { Mail, Lock } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const enter = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:7000/login", { email, password });

      const userId = res.data.id;
      const roll = res.data.roll; 
     console.log("Token stored:", res.data.token);
localStorage.setItem("token", res.data.token);
console.log("Token now in localStorage:", localStorage.getItem("token"));



      if (roll === 1) {
        alert("Login successful");
        navigate(`/view/${userId}`);
      } else if (roll === 2) {
        alert("Login successful (Admin)");
        navigate(`/admin`);
      } else {
        alert("Unknown role");
      }
    } catch (err) {
      console.error("Login error", err.response?.data || err.message);
      alert(err.response?.data?.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-slate-200 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 dark:bg-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-sky-700 dark:text-sky-400">
          User Login
        </h1>

        <form onSubmit={enter} className="grid gap-4">
          <InputField
            type="email"
            Icon={Mail}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            Icon={Lock}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 transition-colors text-white font-semibold px-4 py-2 rounded-xl"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 my-4 text-center">
          If you are not registered, please click the button below
        </p>
        <button
          className="bg-green-600 hover:bg-green-700 w-full transition-colors text-white font-semibold px-4 py-2 rounded-xl"
          onClick={() => navigate("/")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
