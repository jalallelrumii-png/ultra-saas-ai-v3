"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// GANTI PAKE PUNYA LU DARI DASHBOARD SUPABASE!
const SUPABASE_URL = "URL_LU_DI_SINI";
const SUPABASE_ANON_KEY = "KEY_LU_DI_SINI";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function UltraSaaSCloud() {
  const [syncId, setSyncId] = useState("");
  const [masterData, setMasterData] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [jawaban, setJawaban] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // FITUR CLOUD: AMBIL DATA DARI AWAN
  const fetchCloudData = async (id: string) => {
    const { data, error } = await supabase
      .from("event_data")
      .select("content")
      .eq("event_id", id)
      .single();
    
    if (data) setMasterData(data.content);
  };

  // FITUR CLOUD: SIMPAN DATA KE AWAN
  const saveToCloud = async () => {
    if (!syncId) return alert("Isi Sync ID dulu buat konek ke Cloud!");
    await supabase.from("event_data").upsert({ 
      event_id: syncId, 
      content: masterData 
    });
    alert("Data Ter-sinkron ke Cloud!");
  };

  const tanyaAI = async () => {
    if (!pertanyaan) return;
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
      setJawaban("Connection Lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen transition-all ${isDarkMode ? "bg-[#121212] text-zinc-200" : "bg-[#f5f5f7] text-zinc-900"}`}>
      <div className="max-w-2xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-zinc-500/10 pb-6">
          <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Ultra Cloud AI</h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full border border-zinc-500/20">{isDarkMode ? "☀️" : "🌙"}</button>
        </header>

        {/* CLOUD SYNC CONTROL - NILAI JUAL UTAMA */}
        <section className={`p-4 rounded-2xl border ${isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
          <div className="flex gap-2">
            <input 
              placeholder="Enter Sync ID (e.g: EVENT-01)"
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              value={syncId}
              onChange={(e) => setSyncId(e.target.value)}
            />
            <button onClick={() => fetchCloudData(syncId)} className="text-[10px] font-bold bg-zinc-800 px-3 py-2 rounded-lg">CONNECT</button>
            <button onClick={saveToCloud} className="text-[10px] font-bold bg-blue-600 text-white px-3 py-2 rounded-lg">PUSH DATA</button>
          </div>
        </section>

        {/* DATA SOURCE */}
        <textarea
          className={`w-full h-32 p-4 rounded-2xl border outline-none text-sm ${isDarkMode ? "bg-[#1c1c1e] border-zinc-800" : "bg-white border-zinc-200"}`}
          placeholder="Master Data..."
          value={masterData}
          onChange={(e) => setMasterData(e.target.value)}
        />

        {/* AI INPUT */}
        <div className="flex gap-2 p-2 rounded-full border bg-zinc-900/30 border-zinc-500/20">
          <input 
            className="flex-1 bg-transparent px-4 outline-none" 
            placeholder="Ask AI..."
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
          />
          <button onClick={tanyaAI} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-all">
            {loading ? "..." : "SEND"}
          </button>
        </div>

        {/* JAWABAN AI */}
        {jawaban && (
          <div className={`p-6 rounded-[2rem] border animate-in zoom-in-95 ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-xl"}`}>
             <p className="text-[16px] leading-relaxed">{jawaban}</p>
          </div>
        )}
      </div>
    </main>
  );
}
