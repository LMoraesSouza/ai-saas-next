import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageProps } from '@/app/(dashboard)/(routes)/conversation/page';

const configuration = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});



export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth()
        const body = await req.json()
        const { messages } = await body
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!configuration.apiKey) {
            return new NextResponse("OpenAI API key not configured", { status: 500 })
        }

        console.log(body.messages)
        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 })
        }
        const apiKey: string = process.env.GEMINI_API_KEY || 'whatever default'

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const promptTeste = messages.map((message: MessageProps) => { return message.role === 'user' ? `user: ${message.message}` : `chat: ${message.message}` })

        console.log(promptTeste.flat())

        const result = await model.generateContent(promptTeste);
        const returning = {
            role: 'chat',
            message: result.response.text()
        }

        console.log(returning)

        return NextResponse.json(returning);

        // const response = await configuration.chat.completions.create({
        //     model: 'gpt-3.5-turbo',
        //     messages,
        // })

        // console.log(response)

        // (response.choices[0].message)


    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}