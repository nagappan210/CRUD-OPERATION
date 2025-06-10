import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
const Adminview =()=>{
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if (!token) {
        alert("You must be logged in.");
        navigate("/login");
        return;
    }
    axios.get(`http://localhost:7000/get/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
        setUser(res.data);
        setLoading(false);
        }
        ).catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);

        if (err.response?.status === 401) {
          alert("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
    },[id,navigate])

  if (loading) {
    return (
      <div className="text-center mt-8 text-lg">
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-8 text-lg text-red-600">
        User not found
      </div>
    );
  }

    return (
  <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 sm:p-12 flex justify-center items-start">
    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-900 dark:text-indigo-300">
        User Details (Admin Page)
      </h2>

      <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg">
        <div>
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Name: </span>
          {user.name}
        </div>
        <div>
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Email: </span>
          {user.email}
        </div>
        <div>
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Age: </span>
          {user.age}
        </div>
        <div>
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Number: </span>
          {user.number}
        </div>

        <div>
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Uploaded Images:</span>
          {user.images && user.images.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-5">
              {user.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:7000/uploaded/${img}`}
                  alt={`User upload ${idx + 1}`}
                  className="w-full h-36 rounded-lg object-cover shadow-md border border-indigo-200 dark:border-indigo-700"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-gray-500 dark:text-gray-400 italic">No images uploaded.</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6">
        

        <Link
          to="/admin"
          className="inline-block px-6 py-3 rounded-lg border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition"
        >
          Back to Table
        </Link>
      </div>
    </div>
  </div>
);

}
export default Adminview;