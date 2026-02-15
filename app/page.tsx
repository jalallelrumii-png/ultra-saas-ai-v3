"use client";

import { useState, useEffect } from "react";

export default function GuestManager() {
  const [masterData, setMasterData] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("masterDataTamu");
    if (savedData) setMasterData(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("masterDataTamu", masterData);
  }, [masterData]);

  const tanyaAI = async () => {
    if (!pertanyaan) return alert("Tanya apa dulu anjing!");
    setLoading(true);
    setJawaban("");
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jawaban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-blue-500">ULTRA AI SAAS V1</h1>
            <p className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase">Enterprise Data Assistant</p>
          </div>
          <button 
            onClick={() => setShowPanel(!showPanel)}
            className="text-xs bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-700 transition font-bold"
          >
            {showPanel ? "TUTUP DATA" : "EDIT MASTER DATA"}
          </button>
        </div>

        {/* Master Data Panel */}
        {showPanel && (
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 animate-in fade-in duration-500">
            <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-zinc-500">
              Input Source Data (Excel/Text)
            </label>
            <textarea
              className="w-full h-40 bg-black border border-zinc-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition text-zinc-300"
              placeholder="Contoh: Budi - VIP - Hadir..."
              value={masterData}
              onChange={(e) => setMasterData(e.target.value)}
            />
          </div>
        )}

        {/* Chat Interface */}
        <div className="space-y-4">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <label className="block text-xs font-bold mb-3 uppercase text-blue-400 tracking-widest">
              Tanya Asisten AI
            </label>
            <div className="flex gap-3">
              <input
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition"
                placeholder="Siapa tamu yang belum datang?"
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && tanyaAI()}
              />
              <button
                onClick={tanyaAI}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                {loading ? "..." : "KIRIM"}
              </button>
            </div>
          </div>

          {/* Jawaban AI */}
          {jawaban && (
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Result Ready</span>
                <button 
                  onClick={copyToClipboard}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${copied ? 'bg-green-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
                >
                  {copied ? "BERHASIL COPY!" : "COPY JAWABAN"}
                </button>
              </div>
              <div className="text-zinc-200 leading-relaxed text-lg font-medium">
                {jawaban}
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-zinc-700 text-[10px] pt-12 uppercase tracking-[0.4em]">
          Product of Ultra AI • 2026 Edition
        </footer>
      </div>
    </main>
  );
}
