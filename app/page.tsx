"use client";

import { useState, useEffect } from "react";

export default function GuestManager() {
  const [masterData, setMasterData] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  // Load data dari LocalStorage pas buka aplikasi
  useEffect(() => {
    const savedData = localStorage.getItem("masterDataTamu");
    if (savedData) setMasterData(savedData);
  }, []);

  // Simpan data otomatis tiap kali Master Data berubah
  useEffect(() => {
    localStorage.setItem("masterDataTamu", masterData);
  }, [masterData]);

  const tanyaAI = async () => {
    if (!pertanyaan) return alert("Tanya apa dulu anjing!");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterData, pertanyaan }),
      });
      const data = await res.json();
      setJawaban(data.jawaban || data.error);
    } catch (err) {
      setJawaban("Error: Gagal konek ke server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-black tracking-tighter text-blue-500">
            ULTRA AI SAAS V1
          </h1>
          <button 
            onClick={() => setShowPanel(!showPanel)}
            className="text-xs bg-zinc-800 px-3 py-1 rounded-full hover:bg-zinc-700 transition"
          >
            {showPanel ? "Sembunyikan Panel" : "Edit Master Data"}
          </button>
        </div>

        {/* Master Data Panel */}
        {showPanel && (
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-zinc-400">
              Master Data (Input Excel/Teks Lu Disini)
            </label>
            <textarea
              className="w-full h-40 bg-black border border-zinc-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Contoh: Budi - Keluarga - Hadir..."
              value={masterData}
              onChange={(e) => setMasterData(e.target.value)}
            />
          </div>
        )}

        {/* Chat Interface */}
        <div className="space-y-4">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
            <label className="block text-sm font-bold mb-3 uppercase text-blue-400">
              Tanya Asisten AI
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                placeholder="Siapa tamu yang belum konfirmasi?"
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && tanyaAI()}
              />
              <button
                onClick={tanyaAI}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                {loading ? "MIKIR..." : "KIRIM"}
              </button>
            </div>
          </div>

          {/* Jawaban AI */}
          {jawaban && (
            <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm text-blue-300 font-bold mb-2 uppercase tracking-tighter">Jawaban AI:</p>
              <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {jawaban}
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-zinc-600 text-[10px] pt-8 uppercase tracking-[0.2em]">
          Powered by Llama-3.3 & Groq - Built by {showPanel ? 'Admin' : 'SaaS Owner'}
        </footer>
      </div>
    </main>
  );
}