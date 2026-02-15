"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";
import { Sparkles, Send, RefreshCw, Cpu, Cloud, Terminal, Zap, AlertCircle } from "lucide-react";

// --- 1. DEFINISI TIPE DATA (BIAR VS CODE GAK MARAH) ---
interface AIHistory {
  id: number;
  prompt: string;
  response: string;
  created_at: string;
}

// --- 2. KREDENSIAL CLOUD ---
const supabase = createClient(
  "https://nhmmocpypgsofihbltpi.supabase.co", 
  "sb_publishable_SNq_Hd5hGbzaAFJGli6Dgw_0bKNAwDF"
);

// GANTI PAKAI API KEY GROQ LU DI SINI!!
const GROQ_API_KEY = "GANTI_PAKE_KEY_GROQ_LU"; 

const groq = new Groq({ 
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

export default function GeminiSaaSFinal() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  // Kasih tau TS kalau ini adalah Array dari AIHistory
  const [history, setHistory] = useState<AIHistory[]>([]); 
  const [errorStatus, setErrorStatus] = useState("");

  const fetchCloud = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_generations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      setHistory((data as AIHistory[]) || []);
    } catch (err: any) {
      setErrorStatus("Sync Error: Cek database cloud lu.");
    }
  };

  useEffect(() => { fetchCloud(); }, []);

  const handleExecute = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setErrorStatus("");

    try {
      const chat = await groq.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama3-8b-8192",
      });

      const aiResponse = chat.choices[0]?.message?.content || "";

      const { error: syncError } = await supabase.from("ai_generations").insert([
        { prompt: input, response: aiResponse }
      ]);

      if (syncError) throw syncError;

      setResult(aiResponse);
      setInput("");
      fetchCloud(); 
    } catch (err: any) {
      setErrorStatus(err.message || "Gagal koneksi ke Groq/Cloud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans flex">
      {/* Sidebar - Gemini Dark */}
      <aside className="w-72 h-screen bg-[#0d0d10] border-r border-[#1f1f23] p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 font-bold text-xl mb-10 text-white tracking-tighter">
          <Cloud className="w-5 h-5 text-blue-500" />
          <span>SyncEngine</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="p-3 bg-[#1c1c21] rounded-xl flex items-center gap-3 border border-[#2d2d33] text-sm">
            <Terminal className="w-4 h-4 text-blue-400" /> System Active
          </div>
        </nav>

        {errorStatus && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-xl text-[10px] text-red-400 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        <div className="p-4 bg-[#121217] border border-[#1f1f23] rounded-2xl text-center">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap className="w-3 h-3 fill-blue-400" /> Cloud Connected
          </p>
        </div>
      </aside>

      {/* Main UI */}
      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12">
        <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">Ultra SaaS.</h1>
        <p className="text-xl text-[#71717a] mb-12 font-light tracking-wide">Syncing your brain to the cloud.</p>

        {/* Input Box */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[30px] blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
          <div className="relative bg-[#121217] p-2 rounded-[28px] border border-[#27272a] flex items-center shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apa aja ke AI..."
              className="flex-1 bg-transparent p-4 outline-none text-white text-lg placeholder-[#3f3f46]"
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            />
            <button 
              onClick={handleExecute}
              disabled={loading}
              className="bg-white text-black h-14 px-8 rounded-2xl hover:bg-[#e4e4e7] transition-all disabled:opacity-50 font-extrabold"
            >
              {loading ? <RefreshCw className="animate-spin w-5 h-5" /> : "EXECUTE"}
            </button>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className="bg-[#0d0d10] border border-[#27272a] p-8 rounded-[32px] mb-10 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-6 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> AI Generated Content
            </div>
            <div className="text-[17px] leading-relaxed text-[#e4e4e7] whitespace-pre-wrap">{result}</div>
          </div>
        )}

        {/* History Area - TYPESCRIPT SAFE */}
        <section>
          <h3 className="font-bold text-[#3f3f46] uppercase tracking-[0.2em] text-[10px] mb-4">Cloud Data Logs</h3>
          <div className="space-y-2">
            {history.length > 0 ? (
              history.map((h) => (
                <div key={h.id} className="bg-[#121217]/50 border border-[#1f1f23] p-4 rounded-xl flex justify-between items-center group hover:border-blue-500/40 transition">
                  <p className="text-sm text-[#d4d4d8] truncate max-w-md italic opacity-60 group-hover:opacity-100 font-light">"{h.prompt}"</p>
                  <span className="text-[10px] text-[#3f3f46] font-mono tracking-tighter uppercase">Synced</span>
                </div>
              ))
            ) : (
              <div className="py-10 border border-dashed border-[#1f1f23] rounded-3xl text-center text-[#3f3f46] text-xs">History is clear.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
