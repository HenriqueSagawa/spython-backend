import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY não definida.");
    }

    this.ai = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  private cleanMarkdownCodeBlocks(rawText: string): string {
    const markdownRegex: RegExp =
      /^```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```$/;

    const match: RegExpExecArray | null = markdownRegex.exec(
      rawText.trim(),
    );

    let cleanedText: string = rawText;

    if (match && match[1]) {
      cleanedText = match[1].trim();
    } else {
      cleanedText = rawText
        .replace(/^```[a-zA-Z]*\n/, "")
        .replace(/\n```$/, "")
        .trim();
    }

    return cleanedText;
  }

  async generateCode(userPrompt: string): Promise<string> {
    const optimizedPrompt: string = `Aja como um assistente de programação especialista para a disciplina de Fundamentos de Algoritmos (UEM). Sua tarefa é resolver o exercício fornecido no final deste prompt, seguindo rigorosamente o paradigma de Design de Programas, as boas práticas de um programador iniciante/intermediário cuidadoso e atendendo a TODAS as restrições de formatação e lógica de código abaixo.

Se falhar em qualquer uma das regras, a resposta será considerada incorreta.

---

### 🚨 REGRAS CRÍTICAS DE OUTPUT E FORMATAÇÃO

1. Bloco Único: A sua resposta inteira DEVE estar contida dentro de um ÚNICO bloco de código Markdown em Python (\`\`\`python ... \`\`\`).
2. Zero Texto Externo: É terminantemente proibido gerar qualquer texto, explicação, introdução, saudação ou conclusão fora desse bloco de código. Retorne apenas as linhas de código brutas dentro do bloco.
3. Comentários para os Passos: Todas as descrições, títulos e textos explicativos dos passos do projeto de programas devem ser formatados como comentários em Python, utilizando \`#\` no início de cada linha.

---

### 📋 REGRAS DOS PASSOS DO PROJETO DE PROGRAMAS (DESIGN DE PROGRAMAS)

Você deve estruturar o código seguindo exatamente os passos abaixo, mantendo a numeração e os títulos indicados:

* # 1) Análise: Identifique o problema central de forma puramente objetiva, curta e direta, sem descrições longas ou redundâncias.
* # 2) Definição dos tipos de dados: Liste as informações diretamente no formato de comentário \`# variavel : tipo\` (ex: \`# nome : str\`).
  - Todas as variáveis criadas/utilizadas no escopo global ou funções devem ser mapeadas aqui.
  - Tipos Compostos e Enumerados: Devem ser declarados e implementados em código Python real dentro do Passo 2 (abaixo da listagem de tipos simples).
  - Para Tipos Enumerados: Importe e use obrigatoriamente \`from enum import Enum, auto\`.
  - Para Tipos Compostos: Importe e use obrigatoriamente \`from dataclasses import dataclass\` e o decorador \`@dataclass\`.
  - Regra de Ouro para Classes: NUNCA escreva comentários didáticos dentro da classe. Adicione apenas uma docstring breve e direta.
* # 3 e 4) Especificação e Implementação: Agrupe ambos os passos sob este único título de comentário. Desenvolva as funções necessárias aqui.
* # 5) Verificação: Você deve escrever EXATAMENTE as linhas abaixo como comentário, sem alteração:
# 5) Verificação
# A verificação foi realizada através dos exemplos na especificação.
* # 6) Revisão: Você deve escrever EXATAMENTE as linhas abaixo como comentário, sem alteração:
# 6) Revisão
# O código está testado e funcionando.

---

### 💻 REGRAS E PARADIGMAS DE CÓDIGO ESTREITO (SEM ATALHOS)

* Entrada por Parâmetros: É PROIBIDO o uso da função \`input()\`. Todas as entradas de dados do usuário deverão ser passadas estritamente por parâmetros das funções.
* Retorno Único: Toda e qualquer função DEVE possuir apenas UM ÚNICO \`return\`, obrigatoriamente posicionado na última linha da função.
* Proibido break: Não use a palavra-chave \`break\` ou \`continue\` em hipótese alguma. Controle o fluxo dos laços estritamente através da condição do \`while\`.
* Compatibilidade com Analisadores Educacionais (UEM):
  - NÃO utilize \`_\` como variável de descarte em laços \`for\`.
  - Se a variável do laço (ex: \`i\`) não for usada na lógica interna do \`for\`, force o analisador a reconhecê-la inserindo a instrução \`i = i\` dentro do bloco para evitar erros de "variável não utilizada".
  - NÃO utilize comparações encadeadas como \`1 <= x <= 10\`. Separe-as obrigatoriamente utilizando o operador \`and\` (ex: \`1 <= x and x <= 10\`).
* Funções Embutidas e Métodos Proibidos: É permitido usar APENAS as funções nativas \`assert\`, \`append\`, \`round\` e \`len\`. Qualquer outra função utilitária ou método pronto (como \`sum\`, \`max\`, \`min\`, \`sort\`, \`split\`, etc.) está PROIBIDO e a lógica correspondente deve ser implementada manualmente através de loops explícitos.
* Estilo de Código e Tipagem:
  - Utilize tipagem explícita de dados em todos os parâmetros, tipos de retorno e também em TODAS as variáveis criadas dentro das funções.
  - O código deve priorizar a lógica pura e fundamentos computacionais. Evite soluções "Pythonicas" avançadas, lambdas, programação funcional excessiva ou operadores ternários complexos. Prefira criar variáveis intermediárias com nomes descritivos (ex: \`soma_total\`, \`indice_atual\`) para garantir clareza absoluta.
  - Siga rigorosamente o espaçamento e a indentação da PEP 8.

---

### 📝 ESTRUTURA OBRIGATÓRIA DA DOCSTRING (DOCTEST)

Toda função deve conter uma docstring utilizando aspas triplas (''') estruturada exatamente assim:
'''
Descrição clara e objetiva do que a função faz.

Exemplos
>>> nome_funcao(exemplo)
resultado
'''

Inclua obrigatoriamente no máximo 4 exemplos válidos de doctest.

---

### EXERCÍCIO A SER RESOLVIDO:
${userPrompt}`;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: optimizedPrompt,
      config: {
        temperature: 0.1,
        systemInstruction:
          "Você é um compilador e gerador de código estrito baseado rigorosamente nas regras e passos fornecidos no prompt do usuário. Sua resposta deve conter APENAS um único bloco de código Markdown em Python solicitado. É terminantemente proibido incluir qualquer texto explicativo, introduções, saudações, conclusões ou comentários fora do bloco de código Markdown.",
      },
    });

    const rawResponseText: string | undefined = response.text;

    if (!rawResponseText) {
      throw new Error("Resposta da IA está vazia.");
    }

    const cleanedCode: string =
      this.cleanMarkdownCodeBlocks(rawResponseText);

    return cleanedCode;
  }
}
