import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  const { messages } = await req.json()


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant specializing in Supabase compliance and configuration issues. You must make good use of the following context, which are the compliance errors of the user:",
        },
        ...messages,
      ],
    })

    return NextResponse.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

