import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AkunSaldo from "./AkunSaldo";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../Features/AuthSlice";

Modal.setAppElement("#root");

const Zakat = () => {
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
    const fetchService = async () => {
      try {
        const response = await axios.get(`${apiUrl}/services`, getToken());
        const found = response.data.data.find(
          (item) => item.service_code === "ZAKAT"
        );
        if (found) {
          setService(found);
          setAmount(Number(found.service_tariff));
        } else {
          console.warn("Service Zakat tidak ditemukan");
        }
      } catch (error) {
        console.error("Gagal mengambil data service:", error);
      }
    };

    fetchService();
  }, [apiUrl]);

  const handleBayar = (e) => {
    e.preventDefault();
    if (!service || amount < 1000) {
      alert("Nominal tidak valid");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmModalOpen(false);
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/transaction`,
        {
          amount: Number(amount),
          service_code: service?.service_code || "ZAKAT",
        },
        getToken()
      );
      setTransactionData(response.data.data);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Transaksi gagal:", error);
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
        <p>Memuat layanan Zakat...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AkunSaldo />

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
            className="w-full py-4 rounded-lg text-white text-lg font-bold bg-red-600 hover:bg-red-700 transition my-10"
          >
            {isSubmitting ? "Memproses..." : "Bayar"}
          </button>
        </form>

        {/* Modal Konfirmasi */}
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={() => setIsConfirmModalOpen(false)}
          contentLabel="Konfirmasi"
          className="bg-white rounded-md p-6 max-w-md mx-auto mt-40 border shadow-md text-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/Logo.png"}
            alt="Logo"
            className="w-10 h-10 mx-auto mb-4"
          />
          <p className="text-lg mb-6">
            Anda yakin ingin membayar <strong>{service.service_name}</strong>{" "}
            sebesar <strong>Rp{amount.toLocaleString("id-ID")}</strong>?
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleConfirm}
              className="text-green-600 font-bold px-4 py-2 rounded-md hover:text-green-800"
            >
              Ya, Bayar Sekarang
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
          <h2 className="text-xl font-bold mb-2">Transaksi Berhasil!</h2>
          <p>
            Pembayaran Zakat sebesar{" "}
            <strong>
              Rp{transactionData?.total_amount.toLocaleString("id-ID")}
            </strong>{" "}
            berhasil diproses.
          </p>
          <button
            onClick={handleCloseSuccessModal}
            className="mt-6 text-green-600 font-bold px-4 py-2 rounded-md"
          >
            Kembali ke Dashboard
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
          <h2 className="text-xl font-bold mb-2">Transaksi Gagal!</h2>
          <p>Silakan coba kembali dalam beberapa saat.</p>
          <button
            onClick={() => setIsFailedModalOpen(false)}
            className="mt-6 text-red-500 font-bold px-4 py-2 rounded-md"
          >
            Tutup
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Zakat;
