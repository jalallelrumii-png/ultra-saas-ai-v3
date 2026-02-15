import { NextResponse } from "next/server";
import OpenAI from "openai";

// Inisialisasi Groq lewat OpenAI SDK
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { masterData, pertanyaan } = await req.json();

    // Pastiin data dikirim ke AI dalam bentuk teks string yang rapi
    const dataString = typeof masterData === 'object' ? JSON.stringify(masterData) : masterData;

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `Lu adalah asisten SaaS Engine. Analisis data berikut dan jawab pertanyaan user dengan singkat: ${dataString}` 
        },
        { role: "user", content: pertanyaan },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ 
      jawaban: completion.choices[0]?.message?.content || "Gak ada respon dari AI." 
    });

  } catch (error: any) {
    console.error("ERROR_API_CHAT:", error);
    return NextResponse.json(
      { error: "Gagal Bos!", detail: error.message }, 
      { status: 500 }
    );
  }
}
