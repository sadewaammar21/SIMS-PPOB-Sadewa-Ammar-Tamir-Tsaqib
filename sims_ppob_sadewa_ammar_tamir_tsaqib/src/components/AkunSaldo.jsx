import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getToken } from "../Features/AuthSlice";

const apiUrl = process.env.REACT_APP_API_URL;

const AkunSaldo = ({ profile: profileProp, balance: balanceProp }) => {
  const [profile, setProfile] = useState(profileProp || null);
  const [balance, setBalance] = useState(balanceProp || null);
  const [showBalance, setShowBalance] = useState(false);

  const toggleBalance = () => setShowBalance((prev) => !prev);

  useEffect(() => {
    if (!profileProp) fetchProfile();
    if (!balanceProp) fetchBalance();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiUrl}/profile`, getToken());
      setProfile(res.data.data);
      console.log("Profile fetched:", res.data.data);
    } catch (error) {
      console.error("Gagal fetch profile:", error);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${apiUrl}/balance`, getToken());
      setBalance(res.data.data.balance);
      console.log("Balance fetched:", res.data.data.balance);
    } catch (error) {
      console.error("Gagal fetch saldo:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-start gap-4 p-4 bg-gray-100">
      {/* Profile */}
      <div className="flex flex-col items-start gap-2 flex-1 min-w-[250px] max-w-[300px]">
        <img
          src={profile?.profile_image || "/assets/default-profile.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="text-xl text-gray-600">Selamat datang,</p>
          <h1 className="text-3xl font-bold">
            {profile ? `${profile.first_name} ${profile.last_name}` : ""}
          </h1>
        </div>
      </div>

      {/* Saldo Card */}
      <div className="relative w-full sm:w-[60%] h-48 rounded-xl overflow-hidden max-w-[600px]">
        <img
          src="/assets/Background Saldo.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex flex-col justify-center text-white px-6 text-left">
          <p className="text-sm">Saldo anda</p>
          <h2 className="text-3xl font-bold mt-2">
            {showBalance
              ? `Rp ${balance?.toLocaleString("id-ID") ?? "0"}`
              : "••••••••"}
          </h2>
          <button
            onClick={toggleBalance}
            className="text-sm mt-3 underline flex items-center gap-2 w-fit"
          >
            {showBalance ? (
              <>
                Sembunyikan Saldo <FaEyeSlash />
              </>
            ) : (
              <>
                Lihat Saldo <FaEye />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AkunSaldo;
