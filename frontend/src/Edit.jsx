import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from './InputField';

const Edit = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`http://localhost:7000/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        setName(user.name);
        setAge(user.age);
        setNumber(user.number);
        setEmail(user.email);
        setExistingImages(user.images || []);
      })
      .catch((err) => console.error('Failed to fetch user:', err));
  }, [id, token]);

  const handleNewImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleRemoveImage = (filename) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImagesToDelete((prev) => [...prev, filename]);
      setExistingImages((prev) => prev.filter((img) => img !== filename));
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('number', number);
    formData.append('email', email);
    formData.append('deleteImages', JSON.stringify(imagesToDelete));
    newImages.forEach((file) => formData.append('newImages', file));

    try {
      await axios.put(`http://localhost:7000/user_update_all/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('User updated successfully');
      navigate(`/view/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 flex justify-center items-start">
      <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-xl w-full p-10'>
           <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 dark:text-indigo-400">Edit User</h2>
      <div className='space-y-6 text-gray-800 dark:text-gray-300'>
        <label className=' block mb-2 font-semibold text-indigo-600 dark:text-indigo-400' htmlFor="name">Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full rounded-lg border border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 shadow-sm bg-gray-50 dark:bg-gray-800"
      />

      <label className=" block mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Email</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-lg border border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 shadow-sm bg-gray-50 dark:bg-gray-800"
      />

      <label className="block mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Age</label>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        className="w-full rounded-lg border border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 shadow-sm bg-gray-50 dark:bg-gray-800"
      />

      <label className="block mb-2 font-semibold text-indigo-600 dark:text-indigo-400">Number</label>
      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Number"
        className="w-full rounded-lg border border-indigo-300 dark:border-indigo-600 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 shadow-sm bg-gray-50 dark:bg-gray-800"
      />

      <div>
          <label className="block mb-3 font-semibold text-indigo-600 dark:text-indigo-400">
            Existing Images
          </label>
          {existingImages.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden shadow-md w-24 h-24">
                  <img
                    src={`http://localhost:7000/uploaded/${img}`}
                    alt={`img-${idx}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <button
                    onClick={() => handleRemoveImage(img)}
                    title="Delete Image"
                    className="absolute top-1 right-1 bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full px-2 py-0.5 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500 dark:text-gray-400">No images uploaded.</p>
          )}
        </div>

      <div>
          <label className="block mb-3 font-semibold text-indigo-600 dark:text-indigo-400">
            Add New Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleNewImageChange}
            className="block w-full text-indigo-700 dark:text-indigo-300 file:border file:border-indigo-400 file:rounded-lg file:px-3 file:py-2 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
          />
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {Array.from(newImages).map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-24 h-24 rounded-lg object-cover shadow-md border border-indigo-300"
                />
              ))}
            </div>
          )}
        </div>

      <div className="flex gap-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <button
          onClick={() => navigate(`/view/${id}`)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
      </div>
      </div>
     
    </div>
  );
};

export default Edit;
