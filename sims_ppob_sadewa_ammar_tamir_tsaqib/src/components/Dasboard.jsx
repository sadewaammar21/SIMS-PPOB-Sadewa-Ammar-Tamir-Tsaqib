import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../Features/AuthSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const serviceIcons = [
  { name: "PBB", icon: "/assets/PBB.png", link: "/pbb" },
  { name: "Listrik", icon: "/assets/Listrik.png", link: "/listrik" },
  { name: "Pulsa", icon: "/assets/Pulsa.png", link: "/pulsa" },
  { name: "PDAM", icon: "/assets/PDAM.png", link: "/pdam" },
  { name: "PGN", icon: "/assets/PGN.png", link: "/pgn" },
  { name: "TV Langganan", icon: "/assets/Televisi.png", link: "/tv-langganan" },
  { name: "Musik", icon: "/assets/Musik.png", link: "/musik" },
  { name: "Voucher Game", icon: "/assets/Game.png", link: "/voucher-game" },
  {
    name: "Voucher Makanan",
    icon: "/assets/Voucher Makanan.png",
    link: "/voucher-makanan",
  },
  { name: "Kurban", icon: "/assets/Kurban.png", link: "/kurban" },
  { name: "Zakat", icon: "/assets/Zakat.png", link: "/zakat" },
  { name: "Paket Data", icon: "/assets/Paket Data.png", link: "/paket-data" },
];

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [banners, setBanners] = useState([]);
  const [showBalance, setShowBalance] = useState(false);
  const toggleBalance = () => setShowBalance((prev) => !prev);

  useEffect(() => {
    fetchProfile();
    fetchBalance();
    fetchBanners();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiUrl}/profile`, getToken());
      setProfile(res.data.data); // sesuai dengan struktur {"data": {...}}
      console.log("Profile fetched:", res.data.data);
    } catch (error) {
      console.error("Gagal fetch profile:", error);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${apiUrl}/balance`, getToken());
      console.log("Balance fetched:", res.data.data.balance);
      setBalance(res.data.data.balance); // langsung ambil data.balance
    } catch (error) {
      console.error("Gagal fetch saldo:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${apiUrl}/banner`);
      console.log("Banners fetched:", res.data.data);
      setBanners(res.data.data); // langsung ambil array banner dari res.data.data
    } catch (error) {
      console.error("Gagal fetch banner:", error);
    }
  };

  return (
    <div className="bg-white border-b pb-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 p-4 bg-gray-100">
        {/* Profile */}
        <div className="flex flex-col items-start gap-2 flex-1 min-w-[250px] max-w-[300px]">
          <img
            src={profile?.profile_image}
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

      {/* Service Icons */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {serviceIcons.map((service, index) => (
          <Link
            to={service.link}
            key={index}
            className="flex flex-col items-center text-center hover:opacity-80 transition"
          >
            <img
              src={process.env.PUBLIC_URL + service.icon}
              alt={service.name}
              className="w-10 h-10"
            />
            <p className="mt-2 text-sm">{service.name}</p>
          </Link>
        ))}
      </div>

      {/* Promo Banners */}
      <div className="px-4 mt-6">
        <h3 className="text-md font-semibold mb-2">Temukan promo menarik</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {banners.map((banner, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden">
              <img
                src={banner.banner_image}
                alt={banner.banner_name}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
