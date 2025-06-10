import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate,useParams } from "react-router-dom";
import { useEffect } from "react";
const View =()=>{
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

    const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

    return(
        <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 sm:p-12 flex justify-center items-start">

      <div className="absolute top-4 right-4">
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>


      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-900 dark:text-indigo-300">
            User Details
          </h2>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg">
            <div><strong className="font-semibold text-indigo-700 dark:text-indigo-400">Name:</strong> {user.name}</div>
            <div><strong className="font-semibold text-indigo-700 dark:text-indigo-400">Email:</strong> {user.email}</div>
            <div><strong className="font-semibold text-indigo-700 dark:text-indigo-400">Age:</strong> {user.age}</div>
            <div><strong className="font-semibold text-indigo-700 dark:text-indigo-400">Number:</strong> {user.number}</div>
            <div>
              <strong className="font-semibold text-indigo-700 dark:text-indigo-400">Uploaded Images:</strong>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {user.images && user.images.length > 0 ? (
                  user.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:7000/uploaded/${img}`}
                      alt={`User upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  ))
                ) : (
                  <p>No images uploaded.</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            {user.canedit && (<button
              className="bg-blue-600 text-white px-4 py-2 rounded mx-4 my-2"
              onClick={() => navigate(`/edit/${user.id}`)}
            >
              Edit
            </button>)}
            {user.canchangepassword && (<button
              className="bg-yellow-600 text-white px-4 py-2 rounded mx-4 my-2"
              onClick={() => navigate(`/password/${user.id}`)}
            >
              Change Password
            </button>)}
            
          </div>
        </div>
      </div>
    </div>
    )
}
export default View;