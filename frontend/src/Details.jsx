import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Details = () => {
  const [age, setAge] = useState("");
  const [number, setNumber] = useState("");
  const [file, setFile] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const inputfile = useRef();

  const upload = (e) => {
    setFile([...e.target.files]);
  };

  const enter = async (e) => {
    e.preventDefault();

    if (!age || !number || file.length === 0) {
      return alert("Please fill in all fields and select files.");
    }

    const formdata = new FormData();
    formdata.append("age", age);
    formdata.append("number", number);
    file.forEach((f) => formdata.append("image", f));

    try {
      await axios.post(`http://localhost:7000/details/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Details submitted successfully!");

      setAge("");
      setNumber("");
      setFile([]);
      if (inputfile.current) inputfile.current.value = "";

      navigate("/login");
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to submit user details");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-6 dark:bg-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-sky-700 dark:text-sky-400">
          Complete Your Profile
        </h2>
        <form onSubmit={enter} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Number</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload File(s)</label>
            <input
              ref={inputfile}
              type="file"
              onChange={upload}
              multiple
              className="block w-full text-sm text-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={!age || !number || file.length === 0}
            className={`w-full px-4 py-2 rounded text-white ${
              !age || !number || file.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default Details;
