import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AkunSaldo from "./AkunSaldo";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../Features/AuthSlice";

Modal.setAppElement("#root");

const Pgn = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [amount, setAmount] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPGNService = async () => {
      try {
        const response = await axios.get(`${apiUrl}/services`, getToken());
        const pgnService = response.data.data.find(
          (item) => item.service_code === "PGN"
        );
        if (pgnService) {
          setService(pgnService);
          setAmount(Number(pgnService.service_tariff));
        } else {
          console.warn("Service PGN tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal mengambil data service:", error);
      }
    };

    fetchPGNService();
  }, [apiUrl]);

  const handleBayar = (e) => {
    e.preventDefault();
    if (!service || amount < 10000) {
      alert("Nominal tidak valid");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPgn = async () => {
    setIsConfirmModalOpen(false);
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/transaction`,
        {
          amount: Number(amount),
          service_code: service?.service_code || "PGN",
        },
        getToken()
      );
      setTransactionData(response.data.data);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Gagal melakukan transaksi:", error);
      setIsFailedModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/dashboard");
  };

  if (!service) {
    return (
      <div className="p-6">
        <p>Memuat data layanan PGN Berlangganan...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AkunSaldo profile={null} balance={null} />

      <div className="mt-8 mx-auto text-center">
        <img
          src={service.service_icon}
          alt={service.service_name}
          className="w-20 h-20 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{service.service_name}</h2>

        <form onSubmit={handleBayar} className="w-full">
          <input
            type="text"
            value={`Rp ${amount.toLocaleString("id-ID")}`}
            readOnly
            className="w-full p-4 border rounded-md text-lg shadow bg-gray-100 cursor-not-allowed"
          />
          <button
            type="submit"
            className="w-full py-4 rounded-lg text-white text-lg font-bold bg-red-500 hover:bg-red-600 transition my-10"
          >
            {isSubmitting ? "Memproses..." : "Bayar"}
          </button>
        </form>

        {/* Modal Konfirmasi */}
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={() => setIsConfirmModalOpen(false)}
          contentLabel="Konfirmasi Pembayaran"
          className="bg-white rounded-md p-6 max-w-md mx-auto mt-40 border shadow-md text-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/Logo.png"}
            alt="Logo"
            className="w-10 h-10 mx-auto mb-4"
          />
          <p className="text-lg mb-6">
            Apakah Anda yakin ingin membayar sebesar{" "}
            <strong>Rp{Number(amount).toLocaleString("id-ID")}</strong> untuk
            layanan <strong>{service.service_name}</strong>?
          </p>
          <div className="flex flex-col justify-center gap-4">
            <button
              onClick={handleConfirmPgn}
              className="text-red-500 font-bold px-4 py-2 rounded-md hover:text-red-700"
            >
              Ya, Lanjutkan
            </button>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="border font-bold px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Batal
            </button>
          </div>
        </Modal>

        {/* Modal Sukses */}
        <Modal
          isOpen={isSuccessModalOpen}
          onRequestClose={handleCloseSuccessModal}
          contentLabel="Transaksi Berhasil"
          className="bg-white rounded-md p-6 max-w-md mx-auto mt-40 border shadow-md text-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />

          <p className="text-lg">Pembayaran PGN sebesar </p>
          <p className="text-xl">
            <strong>
              Rp{transactionData?.total_amount.toLocaleString("id-ID")}
            </strong>
          </p>
          <p className="text-lg mb-6">berhasil!</p>
          <button
            onClick={handleCloseSuccessModal}
            className="mt-6 text-red-500 font-bold px-4 py-2 rounded-md"
          >
            Kembali ke Beranda
          </button>
        </Modal>

        {/* Modal Gagal */}
        <Modal
          isOpen={isFailedModalOpen}
          onRequestClose={() => setIsFailedModalOpen(false)}
          contentLabel="Transaksi Gagal"
          className="bg-white rounded-md p-6 max-w-md mx-auto mt-40 border shadow-md text-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Gagal!</h2>

          <button
            onClick={() => setIsFailedModalOpen(false)}
            className="mt-6 text-red font-bold px-4 py-2 rounded-md"
          >
            Tutup
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Pgn;
