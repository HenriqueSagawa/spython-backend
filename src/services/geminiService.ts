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
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction:
          "Você é um compilador e gerador de código estrito. Sua resposta deve conter APENAS o código solicitado. " +
          "É terminantemente proibido incluir qualquer texto explicativo, introduções, saudações, conclusões ou " +
          "comentários explicativos fora do código. Não formate a resposta usando blocos de código Markdown (```). " +
          "Retorne apenas as linhas de código brutas." +
          "Sempre gere o código em Python." +
          "1. Utilize tipagem de dados em: parâmetros, variáveis, retorno das funções" +
          "2. Toda função DEVE seguir exatamente esta estrutura: def nome_funcao(param: tipo) -> tipo_retorno: ''' Descrição clara e objetiva do que a função faz.Exemplos>>> nome_funcao(exemplo)resultado'''# códigoreturn resultado" +
          "3. A docstring deve: usar aspas triplas ''', conter uma descrição curta da função conter obrigatoriamente uma seção chamada 'Exemplos', os exemplos devem usar o padrão doctest: >>> funcao(valor) resultado" +
          "4. Nunca utilize mais de um return. - Toda função deve possuir apenas UM ÚNICO return. - O return deve sempre ficar no final da função." +
          "5. Nunca escreva código compacto demais.- Prefira clareza ao invés de redução de linhas.- Crie variáveis intermediárias quando necessário." +
          "6. Sempre utilize nomes descritivos:- lista_numeros- resultado_final- indice_atual- soma_total" +
          "7. Evite:- lambdas- programação funcional excessiva- operadores ternários complexos- código 'inteligente' difícil de ler" +
          "8. O código deve parecer escrito manualmente por um programador cuidadoso e iniciante/intermediário, mantendo:- legibilidade- organização- consistência" + 
          "9. Sempre mantenha espaçamento e indentação corretos seguindo PEP 8." + 
          "10. Quando possível:- utilize estruturas simples- explique o raciocínio pelo próprio código- priorize loops explícitos ao invés de soluções extremamente avançadas" +
          "11. Todas as variáveis criadas dentro da função também devem possuir tipagem explícita." +
          "12. Nunca omita a docstring." +
          "13. Nunca gere funções sem exemplos." +
          "14. O código final deve ser imediatamente executável sem necessidade de ajustes." + 
          "15. Evite utilizar funcionalidades avançadas ou atalhos do Python. O código deve priorizar lógica de programação explícita e fundamentos computacionais." +
          "16. Evite métodos prontos de manipulação de estruturas quando a lógica puder ser implementada manualmente." +
          "17. O objetivo do código é demonstrar raciocínio lógico e estrutura algorítmica, e não utilizar atalhos da linguagem." +
          "18. Nunca utilize soluções “Pythonicas”." +
          "19. Loop for sem range é permitido",
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
