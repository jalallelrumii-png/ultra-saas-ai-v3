import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { masterData, pertanyaan } = await req.json();
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `Analisis data ini: ${masterData}` },
        { role: "user", content: pertanyaan }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ jawaban: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Gagal Bos!" }, { status: 500 });
  }
}