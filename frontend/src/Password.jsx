import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate,useParams } from "react-router-dom";
import { useEffect } from "react";
const Password =()=>{
    const [password, setpassword] = useState("");
    const [confirmPassword, setconfirmpassword] = useState("");
    const { id } = useParams(); 
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    const submit = async()=>{
    if (!password || !confirmPassword) {
      return alert("Both fields are required");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
    try{
        await axios.post(`http://localhost:7000/password/${id}`,{password},{
            headers : {Authorization : `Beared ${token}`}
        });
        alert("Password updated successfully");
        navigate(`/view/${id}`); 

    }
    catch (err) {
      console.error("Password update error:", err);
      alert("Failed to update password");
    }

}

    return(
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <label className="block mb-1">New Password</label>
      <input
        type="password"
        className="w-full p-2 mb-3 border rounded"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        placeholder="Enter new password"
      />

      <label className="block mb-1">Re-enter Password</label>
      <input
        type="password"
        className="w-full p-2 mb-4 border rounded"
        value={confirmPassword}
        onChange={(e) => setconfirmpassword(e.target.value)}
        placeholder="Confirm password"
      />

      <button
        onClick={submit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
    </div>
    )
}
export default Password;