import type { Request, Response, NextFunction } from "express";
import { GeminiService } from "../services/geminiService.js";

const geminiService = new GeminiService();

export async function handleCodeGeneration(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res
        .status(400)
        .json({
          error:
            "Requisição inválida. O campo 'prompt' é obrigatório e deve ser uma string.",
        });
      return;
    }

    const codeResult = await geminiService.generateCode(prompt);

    res.status(200).json({ code: codeResult });
  } catch (error) {
    next(error);
  }
}
