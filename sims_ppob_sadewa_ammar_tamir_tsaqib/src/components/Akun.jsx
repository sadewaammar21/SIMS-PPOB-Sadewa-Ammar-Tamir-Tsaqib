import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken, Logout } from "../Features/AuthSlice";
import { useDispatch } from "react-redux"; // ✅ Tambahkan ini
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail, MdPerson } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const defaultAvatar = "/assets/avatar-default.png";
const apiUrl = process.env.REACT_APP_API_URL;

const Akun = () => {
  const dispatch = useDispatch(); // ✅ Gunakan dispatch
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    profile_image: "",
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/profile`, getToken());
      setProfile(response.data.data);
      setOriginalProfile(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil profil:", err);
    }
  };

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024) {
      alert("Ukuran gambar maksimal 100KB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put(`${apiUrl}/profile/image`, formData, {
        ...getToken(),
        headers: {
          ...getToken().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProfile();
    } catch (error) {
      console.error("Gagal upload gambar:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        `${apiUrl}/profile/update`,
        {
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
        getToken()
      );
      alert("Profil berhasil diupdate!");
      setIsEditing(false);
      setOriginalProfile(profile);
    } catch (err) {
      console.error("Gagal update profil:", err);
    }
  };

  const handleCancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await dispatch(Logout()); // ✅ Dispatch logout dari redux
    navigate("/"); // Arahkan ke halaman login
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={profile.profile_image || defaultAvatar}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
          />
          <label
            htmlFor="profileUpload"
            className="absolute bottom-0 right-0 bg-white border rounded-full p-1 cursor-pointer shadow"
          >
            <FaEdit />
          </label>
          <input
            type="file"
            id="profileUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <h2 className="text-xl font-semibold mt-4">
          {profile.first_name} {profile.last_name}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <div className="relative">
            <MdAlternateEmail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-xl" />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-4 pl-10 text-lg shadow border rounded w-full bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Nama Depan</label>
          <div className="relative">
            <MdPerson className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-xl" />
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-4 pl-10 text-lg shadow border rounded w-full bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Nama Belakang</label>
          <div className="relative">
            <MdPerson className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-xl" />
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-4 pl-10 text-lg shadow border rounded w-full bg-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdateProfile}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded w-full"
            >
              Simpan
            </button>
            <button
              onClick={handleCancelEdit}
              className="border border-gray-400 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded w-full"
            >
              Batalkan
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded w-full"
          >
            Edit Profil
          </button>
        )}

        {!isEditing && (
          <button
            onClick={handleLogout}
            className="border border-red-600 text-red-600 hover:bg-red-50 font-semibold py-3 rounded w-full"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Akun;
