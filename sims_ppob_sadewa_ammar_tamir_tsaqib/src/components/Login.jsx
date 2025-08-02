import React, { useState, useEffect } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { LoginAuth, reset } from "../Features/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSuccess && user?.status === 1) {
      toast.success("Berhasil masuk!");
      navigate("/dashboard");
      dispatch(reset());
    }

    if (isSuccess && user?.status !== 1) {
      setLocalError("Akun belum aktif!");
      dispatch(reset());
    }

    if (isError) {
      setLocalError(message || "Password yang anda masukkan salah");
      dispatch(reset());
    }
  }, [isSuccess, isError, user, message, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(""); // reset error saat submit ulang
    const result = await dispatch(LoginAuth({ email, password }));

    if (LoginAuth.fulfilled.match(result)) {
      const token = result.payload?.token;
      if (token) {
        localStorage.setItem("accessToken", token);
        navigate("/dashboard");
      } else {
        toast.error("Login gagal: token tidak ditemukan.");
      }
    } else {
      console.log("Login gagal:", result.payload?.message);
    }
  };

  return (
    <main className="flex h-screen w-full">
      {/* Form Login */}
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
          <h1 className="text-2xl font-bold">Masuk atau buat akun</h1>
          <h1 className="text-2xl font-bold">untuk memulai</h1>
        </div>

        <form className="w-full max-w-xl space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdAlternateEmail className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              name="email"
              value={email}
              onChange={onChange}
              className="p-4 pl-10 text-lg shadow border rounded w-full"
              placeholder="Email"
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
              onChange={(e) => {
                setLocalError(""); // Clear error saat user mengetik ulang
                onChange(e);
              }}
              className={`p-4 pl-10 pr-10 text-lg shadow border rounded w-full ${
                localError ? "border-red-500 bg-red-50" : ""
              }`}
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
            {localError && (
              <p className="text-red-500 text-sm mt-2">{localError}</p>
            )}
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded shadow text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="flex items-center gap-1 mt-4">
          <p className="text-gray-600 m-0">Belum punya akun? registrasi</p>
          <Link to="/register" className="text-red-500 m-0 font-bold">
            di sini
          </Link>
        </div>
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

export default Login;
