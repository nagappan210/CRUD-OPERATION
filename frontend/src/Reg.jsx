import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import {User,Lock,Mail} from "lucide-react"
const Reg = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const response = await axios.post("http://localhost:7000/register", {
        name,
        email,
        password,
      });

      alert("Registration successful");

      const userId = response.data.id;
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate(`/details/${userId}`);
    } catch (err) {
      console.error("Error registering:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to register");
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-sky-700 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleRegister}>
          <InputField
            Icon={User}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <InputField
            Icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <InputField
            Icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <InputField
            Icon={Lock}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />

          <button
            type="submit"
            className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-700 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Reg;
