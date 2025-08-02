import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./pages/HomePage";
import TopUpPage from "./pages/TopUpPage";
import TransactionPage from "./pages/TransactionPage";
import AkunPage from "./pages/AkunPage";
import ListrikPage from "./pages/ListrikPage";
import PbbPage from "./pages/PbbPage";
import PulsaPage from "./pages/PulsaPage";
import PdamPage from "./pages/PdamPage";
import PgnPage from "./pages/PgnPage";
import TVPage from "./pages/TVPage";
import MusikPage from "./pages/MusikPage";
import VoucherGamePage from "./pages/VoucherGamePage";
import VoucherMakananPage from "./pages/VoucherMakananPage";
import QurbanPage from "./pages/QurbanPage";
import ZakatPage from "./pages/ZakatPage";
import PaketDataPage from "./pages/PaketDataPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/top-up" element={<TopUpPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/account" element={<AkunPage />} />
        <Route path="/listrik" element={<ListrikPage />} />
        <Route path="/pbb" element={<PbbPage />} />
        <Route path="/pulsa" element={<PulsaPage />} />
        <Route path="/pdam" element={<PdamPage />} />
        <Route path="/pgn" element={<PgnPage />} />
        <Route path="/tv-langganan" element={<TVPage />} />
        <Route path="/musik" element={<MusikPage />} />
        <Route path="/voucher-game" element={<VoucherGamePage />} />
        <Route path="/voucher-makanan" element={<VoucherMakananPage />} />
        <Route path="/kurban" element={<QurbanPage />} />
        <Route path="/zakat" element={<ZakatPage />} />
        <Route path="/paket-data" element={<PaketDataPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
