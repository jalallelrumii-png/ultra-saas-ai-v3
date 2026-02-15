"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import { Sparkles, Send, RefreshCw, Cpu, Cloud, Terminal, Zap, AlertCircle } from "lucide-react";

// KREDENSIAL CLOUD (FIXED DARI SCREENSHOT LU)
const supabase = createClient(
  "https://nhmmocpypgsofihbltpi.supabase.co", 
  "sb_publishable_SNq_Hd5hGbzaAFJGli6Dgw_0bKNAwDF"
);

// MASUKKIN API KEY GROQ LU DISINI!!
const GROQ_KEY = "MASUKKIN_API_KEY_GROQ_LU_DI_SINI"; 

const groq = new Groq({ 
  apiKey: GROQ_KEY, 
  dangerouslyAllowBrowser: true 
});

export default function GeminiGroqSaaS() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  // FETCH DATA DARI CLOUD (SUPABASE)
  const fetchCloudData = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_generations") 
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      if (data) setHistory(data);
    } catch (err: any) {
      setErrorMessage("Cloud Fetch Error: " + err.message);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  // PROSES AI GROQ + AUTO SYNC KE CLOUD
  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setErrorMessage("");
    
    try {
      // 1. Panggil Groq (Llama 3)
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama3-8b-8192",
      });

      const responseText = completion.choices[0]?.message?.content || "No response from AI";

      // 2. Cloud Sync ke Supabase (PROSES GABUNGAN)
      const { error: syncError } = await supabase.from("ai_generations").insert([
        { prompt: input, response: responseText } 
      ]);

      if (syncError) {
        console.error("Supabase Error:", syncError);
        throw new Error("Gagal simpan ke Cloud. Cek apakah tabel 'ai_generations' sudah dibuat?");
      }

      setResult(responseText);
      setInput("");
      fetchCloudData(); // Tarik history terbaru
    } catch (err: any) {
      console.error("PROCESS ERROR:", err);
      setErrorMessage(err.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans flex">
      
      {/* SIDEBAR */}
      <aside className="w-72 h-screen sticky top-0 bg-[#0d0d10] border-r border-[#1f1f23] p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 font-bold text-xl mb-10 text-orange-500">
          <Cpu className="w-6 h-6" />
          <span className="tracking-tighter text-white uppercase">SyncEngine</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <div className="p-3 bg-[#1c1c21] text-white rounded-xl flex items-center gap-3 border border-[#2d2d33] cursor-default">
            <Terminal className="w-4 h-4" /> Groq + Cloud Sync
          </div>
        </nav>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-xl flex gap-2 text-[10px] text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-4 bg-[#121217] border border-[#1f1f23] rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-blue-400" /> System Ready
          </div>
          <p className="text-[11px] text-[#71717a]">Syncing with Supabase Cloud</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">SaaS Engine v1.</h1>
          <p className="text-xl text-[#71717a]">Groq AI terintegrasi Cloud Sync Supabase.</p>
        </header>

        {/* INPUT BOX */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-blue-600 rounded-[30px] blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
          <div className="relative bg-[#121217] p-2 rounded-[28px] border border-[#27272a] flex items-center shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya Groq, simpan ke Cloud..."
              className="flex-1 bg-transparent p-4 outline-none text-white text-lg placeholder-[#3f3f46]"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-white text-black h-14 px-8 rounded-2xl hover:bg-zinc-300 transition-all disabled:opacity-50 font-bold"
            >
              {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : "EXECUTE"}
            </button>
          </div>
        </div>

        {/* AI RESULT */}
        {result && (
          <div className="bg-[#0d0d10] border border-[#27272a] p-8 rounded-[32px] mb-10 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs mb-6 tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4" /> Output from Groq
            </div>
            <div className="text-[18px] leading-relaxed text-[#e4e4e7] font-light">
              {result}
            </div>
          </div>
        )}

        {/* LOG CLOUD */}
        <section>
          <h3 className="font-bold text-[#3f3f46] uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
            <Cloud className="w-3 h-3" /> Cloud Data History
          </h3>
          <div className="space-y-2">
            {history.length > 0 ? history.map((h) => (
              <div key={h.id} className="bg-[#121217]/50 border border-[#1f1f23] p-4 rounded-xl flex justify-between items-center group hover:border-blue-500/30 transition-all">
                <p className="text-sm text-[#d4d4d8] truncate max-w-md italic opacity-60">"{h.prompt}"</p>
                <span className="text-[10px] text-[#3f3f46] font-mono">Cloud Synced</span>
              </div>
            )) : (
              <p className="text-xs text-[#3f3f46]">Tidak ada data history di cloud.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
