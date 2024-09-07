

import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge'

export async function POST(request:Request) {

    const prompt = "Generate three distinct, professional questions that can be asked to an unknown person about their career journey, focusing on their professional struggles, key achievements, and challenges they faced. Each question should be insightful, respectful, and designed to encourage the person to share meaningful experiences about their professional life. The questions should be separated by '||'. Avoid generic or overly broad questions."

    try {

        const ApiKey:any = process.env.GEMINI_API_KEY

        const genAI = new GoogleGenerativeAI(ApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        
        const result = await model.generateContent(prompt);
        
        if(!result){
            return Response.json(
                { 
                    success : false,
                    message : "Model didn't generate content/text"
                },
                {
                    status : 500
                }
            )
        }

        const finalResult = result?.response?.text()

        return Response.json(
            { 
                success : true,
                message : "Content/Text is successfully Genrated form the Gemini model",
                finalResult
            },
            {
                status : 500
            }
        )
        
    } catch (error) {
        console.error("An Error Occrured While Generating the Content from thr Gemini")

        return Response.json(
            {
                success : false,
                message : "An Error Occrured While Generating the Content from thr Gemini"
            },
            {
                status : 500
            }
        )
    }
}