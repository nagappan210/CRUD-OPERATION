import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Calendar, Phone, Upload } from "lucide-react";
import InputField from "./InputField"; // import memoized InputField

const Admin_register = () => {
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [conformpassword, setconformpassword] = useState("");
  const [age, setage] = useState("");
  const [number, setnumber] = useState("");
  const [file, setfile] = useState([]);
  const inputfile = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const upload = (e) => {
    setfile(e.target.files);
  };

  const enter = async (e) => {
    e.preventDefault();
    if (password !== conformpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("age", age);
      formData.append("number", number);
      for (let i = 0; i < file.length; i++) {
        formData.append("image", file[i]);
      }

      await axios.post("http://localhost:7000/admin_register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Registration successful");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-slate-200 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 dark:bg-gray-900 dark:text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-sky-700 dark:text-sky-400">
          Admin Registration
        </h2>
        <form onSubmit={enter} className="grid gap-4">
          <InputField
            Icon={User}
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Name"
          />
          <InputField
            Icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email"
          />
          <InputField
            Icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password"
          />
          <InputField
            Icon={Lock}
            type="password"
            value={conformpassword}
            onChange={(e) => setconformpassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <InputField
            Icon={Calendar}
            type="number"
            value={age}
            onChange={(e) => setage(e.target.value)}
            placeholder="Age"
          />
          <InputField
            Icon={Phone}
            type="number"
            value={number}
            onChange={(e) => setnumber(e.target.value)}
            placeholder="Phone Number"
          />

          <div className="relative">
            <Upload className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={inputfile}
              type="file"
              onChange={upload}
              multiple
              className="pl-10 block w-full text-sm border rounded-xl py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 transition-colors text-white font-semibold px-4 py-2 rounded-xl"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin_register;
