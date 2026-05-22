import dotenv from 'dotenv';

dotenv.config();

export const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

if (!env.GEMINI_API_KEY) {
  console.warn('[Aviso]: GEMINI_API_KEY não foi configurada. As requisições à IA falharão.');
}