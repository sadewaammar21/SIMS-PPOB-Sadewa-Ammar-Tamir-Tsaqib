import React, { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RegisterAuth, reset } from "../Features/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { email, first_name, last_name, password, confirmPassword } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registrasi gagal!");
      dispatch(reset());
    }

    if (isSuccess) {
      toast.success("Registrasi berhasil!");
      navigate("/");
      dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch, navigate]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Reset error

    if (!email || !first_name || !last_name || !password || !confirmPassword) {
      toast.error("Semua kolom wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      const result = await dispatch(
        RegisterAuth({ email, first_name, last_name, password })
      );

      if (RegisterAuth.rejected.match(result)) {
        console.log("Gagal daftar:", result.payload);
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat registrasi:", err.message);
      toast.error("Kesalahan internal saat registrasi");
    }
  };

  return (
    <main className="flex h-screen w-full">
      {/* Form Register */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-white px-8">
        <div className="mb-8 flex items-center">
          <img
            src={process.env.PUBLIC_URL + "/assets/Logo.png"}
            alt="Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold ml-2">SIMS PPOB</h1>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
        </div>

        <form className="w-full max-w-xl space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdAlternateEmail className="text-gray-400 text-xl" />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="p-4 pl-10 text-lg shadow border rounded w-full"
              placeholder="Email"
              required
            />
          </div>

          {/* First Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              name="first_name"
              value={first_name}
              onChange={onChange}
              className="p-4 pl-10 text-lg shadow border rounded w-full"
              placeholder="Nama Depan"
              required
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              name="last_name"
              value={last_name}
              onChange={onChange}
              className="p-4 pl-10 text-lg shadow border rounded w-full"
              placeholder="Nama Belakang"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 text-xl" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={onChange}
              className="p-4 pl-10 pr-10 text-lg shadow border rounded w-full"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 text-xl" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              className={`p-4 pl-10 pr-10 text-lg shadow border rounded w-full ${
                error ? "border-red-500 bg-red-50" : ""
              }`}
              placeholder="Konfirmasi Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            >
              {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-right w-full">
                {error}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded shadow text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Daftar"}
          </button>
        </form>
      </div>

      {/* Ilustrasi */}
      <div className="w-1/2 h-screen">
        <img
          src={process.env.PUBLIC_URL + "/assets/Illustrasi Login.png"}
          alt="Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </main>
  );
}

export default Register;
