"use client";

import { useState, useEffect } from "react";

export default function UltraSaaS() {
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
    if (!pertanyaan) return;
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
      setJawaban("System Connection Interrupted.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jawaban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      setMasterData("");
      localStorage.removeItem("masterDataTamu");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Apple Style Header */}
        <header className="flex justify-between items-end border-b border-zinc-800/50 pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Ultra AI
            </h1>
            <p className="text-[11px] font-medium text-zinc-500 tracking-[0.2em] uppercase">Intelligence SaaS V1</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="text-[11px] font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-full transition-all active:scale-95 border border-red-500/20">
              RESET
            </button>
            <button onClick={() => setShowPanel(!showPanel)} className="text-[11px] font-semibold text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-all active:scale-95 border border-zinc-700">
              {showPanel ? "HIDE PANEL" : "EDIT DATA"}
            </button>
          </div>
        </header>

        {/* Master Data - iOS Glass Effect */}
        {showPanel && (
          <section className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Data Repository</label>
            <div className="relative group">
              <textarea
                className="w-full h-44 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 text-[15px] focus:ring-1 focus:ring-blue-500 outline-none transition shadow-inner text-zinc-200 leading-relaxed"
                placeholder="Paste your Excel or Raw Data here..."
                value={masterData}
                onChange={(e) => setMasterData(e.target.value)}
              />
            </div>
          </section>
        )}

        {/* Interaction Zone */}
        <section className="space-y-6">
          <div className="bg-gradient-to-b from-zinc-800/30 to-transparent p-[1px] rounded-[2.5rem]">
            <div className="bg-zinc-900/80 backdrop-blur-2xl p-2 rounded-[2.45rem] shadow-2xl flex items-center">
              <input
                className="flex-1 bg-transparent border-none rounded-full px-6 py-4 focus:outline-none text-[16px] placeholder:text-zinc-600 font-medium"
                placeholder="Ask anything..."
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && tanyaAI()}
              />
              <button
                onClick={tanyaAI}
                disabled={loading}
                className={`px-8 py-4 rounded-full font-bold transition-all active:scale-90 ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'}`}
              >
                {loading ? "..." : "SEND"}
              </button>
            </div>
          </div>

          {/* AI Response - Apple Card Style */}
          {jawaban && (
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2rem] animate-in zoom-in-95 duration-500 shadow-2xl relative group">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">Response Analysis</span>
                <button 
                  onClick={copyToClipboard}
                  className={`text-[10px] font-bold px-4 py-2 rounded-full transition-all ${copied ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  {copied ? "COPIED" : "COPY OUTPUT"}
                </button>
              </div>
              <p className="text-zinc-100 text-[18px] leading-[1.6] font-medium tracking-tight">
                {jawaban}
              </p>
            </div>
          )}
        </section>

        <footer className="pt-20 pb-10 text-center">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.5em]">
            Engineered by Ultra Labs • MMXXVI
          </p>
        </footer>
      </div>
    </main>
  );
}
