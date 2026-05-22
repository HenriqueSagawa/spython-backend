import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY! });
  }

  private cleanMarkdownCodeBlocks(rawText: string): string {
    const markdownRegex = /^```[a-zA-Z]*\n([\s\S]*?)\n```$/gm;
    const match = markdownRegex.exec(rawText.trim());

    if (match && match[1]) {
      return match[1].trim();
    }

    return rawText.replace(/^```[a-zA-Z]*\n|```$/g, "").trim();
  }

  async generateCode(userPrompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction:
          "Você é um compilador e gerador de código estrito. Sua resposta deve conter APENAS o código solicitado. " +
          "É terminantemente proibido incluir qualquer texto explicativo, introduções, saudações, conclusões ou " +
          "comentários explicativos fora do código. Não formate a resposta usando blocos de código Markdown (```). " +
          "Retorne apenas as linhas de código brutas.",
        temperature: 0.1,
      },
    });

    const rawResponseText = response.text;
    
    if (!rawResponseText) {
        throw new Error("Resposta da IA está vazia.");
    }

    return this.cleanMarkdownCodeBlocks(rawResponseText);
  }
}
