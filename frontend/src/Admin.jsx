import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
      const [uid, setUid] = useState("");
      const [name, setName] = useState("");
      const [age, setAge] = useState("");
      const [number, setNumber] = useState("");
      const [search, setSearch] = useState([]);
      const [users, setUsers] = useState([]);
      const navigate = useNavigate();

      useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("http://localhost:7000/admin", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data);
          setSearch(res.data);
        } catch {
          alert("Failed to fetch data from server.");
        }
      };

  useEffect(() => {
    const filtered = users.filter((u) => {
      const matchId = uid ? u.id.toString().includes(uid) : true;
      const matchName = name ? u.name.toLowerCase().includes(name.toLowerCase()) : true;
      const matchAge = age ? u.age?.toString().includes(age) : true;
      const matchNumber = number ? u.number?.toString().includes(number) : true;
      return matchId && matchName && matchAge && matchNumber;
    });
    setSearch(filtered);
  }, [uid, name, age, number, users]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:7000/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      alert("Delete failed.");
    }
  };

  const sendEmail = async (name, email) => {
    if (!email) {
      alert(`Email not found for user ${name}`);
      return;
    }
    try {
      await axios.post("http://localhost:7000/sendemail", { name, email });
      alert("Mail sent successfully");
    } catch {
      alert("Failed to send email.");
    }
  };

  const logout = () => {
    if (!window.confirm("Do you want to logout?")) return;
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
  <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 sm:p-12">
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-400 tracking-wide">
          Admin Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-5 py-2 shadow-md transition duration-300"
        >
          Log Out
        </button>
      </header>

     
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { placeholder: "Search by ID", value: uid, setter: setUid, type: "number" },
          { placeholder: "Search by Name", value: name, setter: setName, type: "text" },
          { placeholder: "Search by Age", value: age, setter: setAge, type: "number" },
          { placeholder: "Search by Number", value: number, setter: setNumber, type: "number" },
        ].map(({ placeholder, value, setter, type }) => (
          <input
            key={placeholder}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setter(e.target.value)}
            className="w-full rounded-lg border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3 shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-500 text-gray-900 dark:text-gray-100 transition"
          />
        ))}
      </section>

     
      {search.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {search.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1 text-indigo-900 dark:text-indigo-300 truncate">{user.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                  <strong>Email:</strong> {user.email || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <strong>ID:</strong> {user.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <strong>Age:</strong> {user.age || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Number:</strong> {user.number || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Password:</strong>{" "}
                  <span className="tracking-widest">••••••••</span>
                </p>
              </div>
            
              <div className="mt-4 flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/adminview/${user.id}`)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-800 text-white py-2 rounded-lg font-medium transition"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/adminedit/${user.id}`)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-800 text-white py-2 rounded-lg font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => sendEmail(user.name, user.email)}
                  className="flex-1 bg-green-600 hover:bg-green-800 text-white py-2 rounded-lg font-medium transition"
                >
                  Email
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="flex-1 bg-red-600 hover:bg-red-800 text-white py-2 rounded-lg font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
         
          <div className="flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-800 transition p-6 shadow-md"
            onClick={() => navigate("/admin_register")}
          >
            <span className="text-indigo-600 dark:text-indigo-300 text-3xl font-bold select-none">+ Add New User</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20 text-lg font-medium">
          No records found.
        </div>
      )}
    </div>
  </div>
);

};

export default Admin;
