"use client";

import { useState, useEffect } from "react";

export default function UltraSaaS() {
  const [masterData, setMasterData] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isListening, setIsListening] = useState(false);

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
      setJawaban("Connection Error.");
    } finally {
      setLoading(false);
    }
  };

  // FITUR 1: VOICE INPUT (SPEECH TO TEXT)
  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser lu gak support voice, anjing!");
    
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setPertanyaan(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jawaban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 font-[-apple-system,BlinkMacSystemFont,sans-serif] ${isDarkMode ? "bg-[#121212] text-[#e2e2e2]" : "bg-[#f5f5f7] text-[#1d1d1f]"}`}>
      <div className="max-w-2xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* HEADER DENGAN TOGGLE WARNA */}
        <header className="flex justify-between items-center border-b border-zinc-500/20 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Ultra AI</h1>
            <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Premium SaaS</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-all border ${isDarkMode ? "bg-zinc-800 border-zinc-700 text-yellow-400" : "bg-white border-zinc-200 text-indigo-600 shadow-sm"}`}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={() => { if(confirm("Hapus data?")) setMasterData(""); }} className="text-[10px] font-bold text-red-500 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">RESET</button>
          </div>
        </header>

        {/* REPOSITORY PANEL */}
        <section className={`rounded-3xl p-6 border transition-all ${isDarkMode ? "bg-[#1c1c1e]/50 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
          <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase tracking-widest opacity-50">
            <span>Data Repository</span>
            <button onClick={() => setShowPanel(!showPanel)} className="text-blue-500 underline">{showPanel ? "Hide" : "Edit"}</button>
          </div>
          {showPanel && (
            <textarea
              className={`w-full h-32 bg-transparent border-none outline-none resize-none text-[14px] leading-relaxed ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}
              placeholder="Paste data Excel/Teks lu di sini..."
              value={masterData}
              onChange={(e) => setMasterData(e.target.value)}
            />
          )}
        </section>

        {/* INTERACTION ZONE */}
        <section className="space-y-4">
          <div className={`flex items-center gap-2 p-2 rounded-full border transition-all ${isDarkMode ? "bg-[#1c1c1e] border-zinc-800 focus-within:border-blue-500" : "bg-white border-zinc-200 shadow-md focus-within:border-blue-400"}`}>
            <button onClick={startVoice} className={`p-3 rounded-full transition-all ${isListening ? "bg-red-500 animate-pulse" : "hover:bg-zinc-500/10"}`}>
              🎤
            </button>
            <input
              className="flex-1 bg-transparent border-none outline-none px-2 text-[15px]"
              placeholder="Tanya asisten..."
              value={pertanyaan}
              onChange={(e) => setPertanyaan(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tanyaAI()}
            />
            <button onClick={tanyaAI} disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold text-sm active:scale-95 transition-all shadow-lg shadow-blue-500/20">
              {loading ? "..." : "KIRIM"}
            </button>
          </div>

          {/* AI RESPONSE */}
          {jawaban && (
            <div className={`p-8 rounded-[2rem] border animate-in zoom-in-95 duration-500 relative ${isDarkMode ? "bg-[#1c1c1e] border-zinc-800" : "bg-white border-zinc-200 shadow-xl"}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Analysis Result</span>
                <button onClick={copyToClipboard} className={`text-[10px] font-bold px-4 py-2 rounded-full transition-all ${copied ? "bg-green-500 text-white" : isDarkMode ? "bg-white/5 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}>
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
              <p className="text-[17px] leading-relaxed font-medium">{jawaban}</p>
            </div>
          )}
        </section>

        <footer className={`text-center pt-10 opacity-30 text-[9px] font-bold uppercase tracking-[0.4em]`}>
          Ultra Intelligence • MMXXVI
        </footer>
      </div>
    </main>
  );
}
