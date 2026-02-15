"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import { Sparkles, Send, RefreshCw, Cpu, Cloud, Terminal, Zap } from "lucide-react";

// --- KREDENSIAL CLOUD SYNC ---
const supabase = createClient(
  "https://nhmmocpypgsofihbltpi.supabase.co", 
  "sb_publishable_SNq_Hd5hGbzaAFJGli6Dgw_0bKNAwDF"
);

// PAKE API KEY GROQ LU DI SINI ANJING!
const groq = new Groq({ 
  apiKey: "GANTI_DENGAN_API_KEY_GROQ_LU", 
  dangerouslyAllowBrowser: true 
});

export default function GeminiGroqSaaS() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // AMBIL DATA DARI CLOUD SUPABASE
  const fetchCloudData = async () => {
    const { data } = await supabase
      .from("ai_generations") 
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setHistory(data);
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  // PROSES AI GROQ + AUTO SYNC KE SUPABASE
  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    try {
      // 1. Eksekusi Groq (Llama 3 8B - Kenceng Parah)
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama3-8b-8192",
      });

      const responseText = completion.choices[0]?.message?.content || "";

      // 2. Cloud Sync ke Supabase
      const { error } = await supabase.from("ai_generations").insert([
        { prompt: input, response: responseText }
      ]);

      if (error) throw error;

      setResult(responseText);
      setInput("");
      fetchCloudData(); // Update history otomatis
    } catch (err: any) {
      console.error("ERROR NYET:", err.message);
      alert("Cek API Key Groq atau Tabel Supabase lu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans flex">
      
      {/* SIDEBAR - GEMINI DARK MODE */}
      <aside className="w-72 h-screen sticky top-0 bg-[#0d0d10] border-r border-[#1f1f23] p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 font-bold text-xl mb-10">
          <div className="bg-orange-600 p-2 rounded-xl">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span>GroqSync</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <div className="p-3 bg-[#1c1c21] text-white rounded-xl flex items-center gap-3 border border-[#2d2d33]">
            <Terminal className="w-4 h-4 text-orange-400" /> AI Terminal
          </div>
          <div className="p-3 text-[#a1a1aa] hover:bg-[#15151a] rounded-xl flex items-center gap-3 transition cursor-pointer">
            <Cloud className="w-4 h-4" /> Cloud Storage
          </div>
        </nav>

        <div className="p-4 bg-[#121217] border border-[#1f1f23] rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-orange-400 uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-orange-400" /> Groq Engine Active
          </div>
          <p className="text-[11px] text-[#71717a]">Syncing to Supabase...</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 tracking-tighter">SaaS AI Engine.</h1>
          <p className="text-xl text-[#71717a]">Gak usah capek apdet, kodingan udah fix cloud sync.</p>
        </header>

        {/* INPUT AREA */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-[30px] blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
          <div className="relative bg-[#121217] p-2 rounded-[28px] border border-[#27272a] flex items-center shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apa aja ke Llama 3..."
              className="flex-1 bg-transparent p-4 outline-none text-white text-lg placeholder-[#3f3f46]"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-white text-black h-14 px-8 rounded-2xl hover:bg-[#d4d4d8] transition-all disabled:opacity-50 font-black tracking-tighter"
            >
              {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : "EXECUTE"}
            </button>
          </div>
        </div>

        {/* AI RESULT */}
        {result && (
          <div className="bg-[#0d0d10] border border-[#27272a] p-8 rounded-[32px] mb-10 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs mb-6 tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4" /> Groq AI Intelligence
            </div>
            <div className="text-[18px] leading-relaxed text-[#e4e4e7] font-light">
              {result}
            </div>
          </div>
        )}

        {/* LOG CLOUD */}
        <section>
          <h3 className="font-bold text-[#3f3f46] uppercase tracking-[0.2em] text-[10px] mb-4">Cloud Data Sync (Last 5)</h3>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="bg-[#121217]/50 border border-[#1f1f23] p-4 rounded-xl flex justify-between items-center group hover:border-orange-500/30 transition-all">
                <p className="text-sm text-[#d4d4d8] truncate max-w-md opacity-60 group-hover:opacity-100 transition italic">"{h.prompt}"</p>
                <span className="text-[10px] text-[#3f3f46] font-mono">Stored</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
