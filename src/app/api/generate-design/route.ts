import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI fashion designer. You interpret user fashion prompts and return ONLY a structured JSON object representing the design. 
Do not output any markdown, explanations, or extra text. Only valid JSON.
The JSON must have the following structure:
{
  "type": "hoodie" | "tshirt" | "jacket" | "dress",
  "color": "hex color code (e.g. #000000)",
  "pattern": "description of the pattern or 'none'",
  "fit": "regular" | "oversized" | "slim",
  "sleeve_length": "short" | "long" | "none",
  "fabric": "cotton" | "denim" | "silk" | "leather",
  "confidence_score": 1-100
}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant", // Fast and reliable model
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Failed to generate design");
    }

    const design = JSON.parse(responseContent);

    return NextResponse.json({ design });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: "Failed to generate design" },
      { status: 500 }
    );
  }
}
