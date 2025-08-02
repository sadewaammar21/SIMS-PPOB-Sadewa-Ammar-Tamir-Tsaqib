import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import AkunSaldo from "./AkunSaldo";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getToken } from "../Features/AuthSlice";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const TopUp = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(null);

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("accessToken");
  const presetAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  useEffect(() => {
    fetchProfile();
    fetchBalance();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiUrl}/profile`, getToken());
      setProfile(res.data.data);
    } catch (err) {
      console.error("Gagal fetch profile:", err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${apiUrl}/balance`, getToken());
      setBalance(res.data.data.balance);
    } catch (err) {
      console.error("Gagal fetch saldo:", err);
    }
  };

  useEffect(() => {
    if (!resultModalOpen && modalSuccess) {
      fetchBalance(); // Saat modal ditutup secara tidak langsung
    }
  }, [resultModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount < 10000 || amount > 1000000) return;
    setConfirmModalOpen(true);
  };

  const handleConfirmTopUp = async () => {
    setConfirmModalOpen(false);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${apiUrl}/topup`,
        { top_up_amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalSuccess(true);
      await fetchBalance(); // Segera refresh saldo setelah top up berhasil
      console.log("Top Up Response:", response.data);
    } catch (error) {
      setModalSuccess(false);
    } finally {
      setResultModalOpen(true);
      setIsSubmitting(false);
    }
  };

  const handleCloseResultModal = () => {
    setResultModalOpen(false);
    if (modalSuccess) {
      fetchBalance(); // Refresh saldo
      navigate("/dashboard"); // Navigasi ke dashboard
    }
  };

  return (
    <div className="p-6">
      <AkunSaldo profile={profile} balance={balance} />

      <div className="mt-8 mx-auto">
        <h2 className="text-2xl font-bold mb-2">Silahkan masukan</h2>
        <h3 className="text-3xl font-extrabold text-gray-800 mb-6">
          Nominal Top Up
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Input dan Submit */}
            <div className="md:w-1/2 space-y-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-md"
                placeholder="Contoh: 10000"
                min={10000}
                max={1000000}
              />

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !amount ||
                  Number(amount) < 10000 ||
                  Number(amount) > 1000000
                }
                className={`w-full py-3 rounded-md text-white font-bold ${
                  isSubmitting ||
                  !amount ||
                  Number(amount) < 10000 ||
                  Number(amount) > 1000000
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isSubmitting ? "Memproses..." : "Top Up"}
              </button>

              <p className="text-sm text-gray-500">
                Minimum Rp10.000 dan maksimum Rp1.000.000
              </p>
            </div>

            {/* Tombol Nominal Preset */}
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {presetAmounts.map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAmount(val)}
                    className="border rounded-md py-2 px-4 hover:bg-gray-100 text-sm sm:text-base"
                  >
                    Rp{val.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Modal Konfirmasi */}
        <Modal
          isOpen={confirmModalOpen}
          onRequestClose={() => setConfirmModalOpen(false)}
          contentLabel="Konfirmasi Top Up"
          className="bg-white rounded-md p-6 max-w-md mx-auto mt-40 border shadow-md text-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/Logo.png"}
            alt="Logo"
            className="w-10 h-10 text-center mx-auto mb-4"
          />
          <p className="text-lg mb-6">
            Apakah Anda yakin ingin top up sebesar{" "}
            <strong>Rp{Number(amount).toLocaleString("id-ID")}</strong>?
          </p>
          <div className="flex flex-col justify-center gap-4">
            <button
              onClick={handleConfirmTopUp}
              className="text-red-500 font-bold px-4 py-2 rounded-md hover:text-red-700"
            >
              Ya, Lanjut Top Up
            </button>
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="border font-bold px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Batal
            </button>
          </div>
        </Modal>

        {/* Modal Hasil Top Up */}
        <Modal
          isOpen={resultModalOpen}
          onRequestClose={handleCloseResultModal}
          contentLabel="Hasil Top Up"
          className="bg-white rounded-md p-6 max-w-md mx-auto mt-40 border shadow-md text-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          {modalSuccess ? (
            <>
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />

              <p className="text-lg">Top Up sebesar </p>
              <p className="text-lg font-bold mb-6">
                <strong>Rp{Number(amount).toLocaleString("id-ID")}</strong>{" "}
              </p>
              <p className="text-lg mb-6">berhasil!</p>
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Gagal!</h2>
            </>
          )}

          <button
            onClick={handleCloseResultModal}
            className="mt-6 text-red-500 font-bold px-4 py-2 rounded-md"
          >
            Kembali ke Beranda
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default TopUp;
