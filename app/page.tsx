"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Sparkles, Send, History, Zap, Shield, Layout, Cpu, Globe, Trash2 } from "lucide-react";

// 1. KONEKSI SUPABASE (DARI SCREENSHOT LU)
const supabase = createClient(
  "https://nhmmocpypgsofihbltpi.supabase.co",
  "sb_publishable_SNq_Hd5hGbzaAFJGli6Dgw_0bKNAwDF"
);

export default function GeminiSaaSFinal() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // 2. AMBIL DATA DARI DATABASE SAAT LOAD
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const { data, error } = await supabase
      .from("ai_generations") 
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (!error && data) setHistory(data);
  }

  // 3. LOGIKA GENERATE + SIMPAN KE DB
  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    try {
      // Simulasi Response AI (Nanti tinggal ganti fetch ke OpenAI/Gemini API)
      const aiResponse = `[Analisa Sistem 2026] Untuk ide "${input}", disarankan menggunakan arsitektur Edge Computing dengan integrasi database Supabase yang sudah lu pasang. Performa dijamin stabil.`;
      
      // Simpan ke Supabase
      const { error } = await supabase.from("ai_generations").insert([
        { prompt: input, response: aiResponse }
      ]);

      if (error) throw error;

      setResult(aiResponse);
      setInput("");
      fetchHistory(); // Update list history otomatis
    } catch (err) {
      alert("Cek tabel 'ai_generations' di Supabase lu, udah dibuat belum?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased flex">
      
      {/* SIDEBAR - GEMINI DARK STYLE */}
      <aside className="w-72 h-screen sticky top-0 bg-[#0d0d10] border-r border-[#1f1f23] p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 font-bold text-xl mb-10 text-white">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight">Gemini OS</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <div className="p-3 bg-[#1c1c21] text-white rounded-xl flex items-center gap-3 font-medium cursor-pointer border border-[#2d2d33]">
            <Layout className="w-4 h-4" /> Workspace
          </div>
          <div className="p-3 text-[#a1a1aa] hover:bg-[#15151a] rounded-xl flex items-center gap-3 transition cursor-pointer">
            <Globe className="w-4 h-4" /> Deployments
          </div>
          <div className="p-3 text-[#a1a1aa] hover:bg-[#15151a] rounded-xl flex items-center gap-3 transition cursor-pointer">
            <History className="w-4 h-4" /> Activity
          </div>
        </nav>

        <div className="p-4 bg-[#121217] border border-[#1f1f23] rounded-2xl shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-blue-400" /> System Status
          </div>
          <p className="text-[11px] text-[#71717a]">DB: Connected</p>
          <p className="text-[11px] text-[#71717a]">API: v3.0-Flash</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">Eksekusi Ide Lu.</h1>
          <p className="text-xl text-[#71717a]">Koneksi Supabase sudah aktif. Langsung gas.</p>
        </header>

        {/* INPUT AREA */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[30px] blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#121217] p-2 rounded-[28px] border border-[#27272a] flex items-center shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Masukkan prompt atau ide SaaS..."
              className="flex-1 bg-transparent p-4 outline-none text-white text-lg placeholder-[#3f3f46]"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-white text-black h-14 px-6 rounded-2xl hover:bg-[#d4d4d8] transition disabled:opacity-50 flex items-center gap-2 font-bold"
            >
              {loading ? <div className="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full" /> : <><Send className="w-4 h-4" /> Generate</>}
            </button>
          </div>
        </div>

        {/* HASIL / RESULT CARD */}
        {result && (
          <div className="bg-[#0d0d10] border border-[#27272a] p-8 rounded-[32px] mb-10 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-6 tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4" /> Artificial Intelligence Result
            </div>
            <div className="text-[18px] leading-relaxed text-[#e4e4e7] whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}

        {/* LOG HISTORY - DARI SUPABASE */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#3f3f46] uppercase tracking-[0.2em] text-[10px]">Database History</h3>
            <div className="h-px flex-1 bg-[#1f1f23] ml-4"></div>
          </div>
          
          <div className="space-y-3">
            {history.length > 0 ? history.map((h) => (
              <div key={h.id} className="bg-[#0d0d10]/50 border border-[#1f1f23] p-5 rounded-2xl flex justify-between items-center group hover:border-blue-500/30 transition-all">
                <div className="flex-1 pr-4">
                  <p className="text-sm text-[#d4d4d8] font-medium line-clamp-1 italic">"{h.prompt}"</p>
                  <p className="text-[10px] text-[#52525b] mt-1 font-mono">{new Date(h.created_at).toLocaleString()}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition">
                  <Shield className="w-4 h-4 text-[#3f3f46]" />
                </div>
              </div>
            )) : (
              <p className="text-center py-10 text-[#3f3f46] text-sm italic border-2 border-dashed border-[#1f1f23] rounded-3xl">
                Belum ada data di tabel 'ai_generations'.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
