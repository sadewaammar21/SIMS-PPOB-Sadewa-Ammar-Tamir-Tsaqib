import React, { useEffect, useState } from "react";
import axios from "axios";
import AkunSaldo from "./AkunSaldo";

// Ambil token dari localStorage
const getToken = () => {
  return localStorage.getItem("accessToken");
};

const apiUrl = process.env.REACT_APP_API_URL;

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/transaction/history`, {
        params: { offset, limit },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const newRecords = response.data.data.records;

      if (newRecords.length === 0) {
        setHasMore(false);
        return;
      }

      setTransactions((prev) => [...prev, ...newRecords]);
    } catch (error) {
      console.error("Gagal mengambil riwayat transaksi:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [offset]);

  const formatCurrency = (amount, type) => {
    const formatted = amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return type === "TOPUP" ? `+ ${formatted}` : `- ${formatted}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("id-ID", options) + " WIB";
  };

  const getAmountColor = (type) => {
    return type === "TOPUP" ? "text-green-600" : "text-red-500";
  };

  return (
    <div className="p-4">
      <AkunSaldo />

      <h2 className="text-xl font-bold my-4">Semua Transaksi</h2>

      <div className="space-y-4">
        {transactions.map((trx, index) => (
          <div
            key={index}
            className="flex justify-between items-start bg-white rounded-xl shadow-sm p-4 border"
          >
            <div>
              <p
                className={`text-2xl font-bold ${getAmountColor(
                  trx.transaction_type
                )}`}
              >
                {formatCurrency(trx.total_amount, trx.transaction_type)}
              </p>
            </div>
            <p className="text-sm text-gray-600">{trx.description}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setOffset((prevOffset) => prevOffset + limit)}
            className="text-red-500 hover:underline"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default Transaction;
