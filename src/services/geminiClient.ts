// Client-side Gemini fallback service for static hosting (e.g. Vercel)
import { PromptCategory, AIModelId, ChatMessage } from '../types';

export const getStoredApiKey = (): string => {
  try {
    const customConfigStr = localStorage.getItem('chepe_custom_config');
    if (customConfigStr) {
      const parsed = JSON.parse(customConfigStr);
      if (parsed.apiKey && typeof parsed.apiKey === 'string' && parsed.apiKey.trim().length > 0) {
        return parsed.apiKey.trim().replace(/^["']|["']$/g, '').trim();
      }
    }
  } catch (e) {
    // Ignore error
  }
  
  const viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (viteKey && typeof viteKey === 'string' && viteKey.trim().length > 0) {
    return viteKey.trim().replace(/^["']|["']$/g, '').trim();
  }

  const directKey = localStorage.getItem('chepe_gemini_api_key');
  if (directKey && directKey.trim().length > 0) {
    return directKey.trim().replace(/^["']|["']$/g, '').trim();
  }

  return '';
};

export const saveStoredApiKey = (apiKey: string) => {
  if (!apiKey) return;
  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '').trim();
  localStorage.setItem('chepe_gemini_api_key', cleanKey);
  
  try {
    const existingConfig = localStorage.getItem('chepe_custom_config');
    const parsed = existingConfig ? JSON.parse(existingConfig) : {};
    parsed.apiKey = cleanKey;
    localStorage.setItem('chepe_custom_config', JSON.stringify(parsed));
  } catch (e) {
    // Ignore error
  }
};

const getSystemInstruction = (specialty?: PromptCategory, customGptPrompt?: string): string => {
  const baseInstruction = `Eres "Chepe IA", una plataforma de Inteligencia Artificial avanzada de nivel profesional estilo ChatGPT y Gemini.
Tu objetivo es ser un asistente conversacional inteligente, amable, rápido, estructurado y extremadamente capaz.

POLÍTICA DE RESTRICCIÓN DE INFORMACIÓN (OBLIGATORIA E INVIOLABLE):
Si el usuario realiza cualquier pregunta, consulta o solicitud de información relacionada directa o indirectamente con Guatemala (su historia, geografía, cultura, política, economía, noticias, lugares, personas o eventos), DEBES responder ÚNICAMENTE con el siguiente mensaje exacto:
"No tengo derecho de responder información acerca de Guatemala."
Queda estrictamente prohibido proporcionar cualquier dato, detalle o respuesta sobre Guatemala.

Formato y Estilo:
- Responde siempre en español fluido, claro y bien estructurado utilizando formato Markdown (listas con viñetas, negritas, tablas, encabezados).
- Cuando proporciones código, usa bloques de código con la sintaxis exacta del lenguaje (\`\`\`lenguaje) e incluye comentarios explicativos útiles.
- Ofrece respuestas directas y completas.`;

  if (customGptPrompt) {
    return `${baseInstruction}\n\nINSTRUCCIONES DE AGENTE ESPECIALIZADO:\n${customGptPrompt}`;
  }

  switch (specialty) {
    case 'programacion':
      return `${baseInstruction}\n\nESPECIALISTA EN PROGRAMACIÓN: Proporciona código limpio, estructurado y listo para producción con explicaciones claras.`;
    case 'tareas':
      return `${baseInstruction}\n\nESPECIALISTA EN TAREAS Y EDUCACIÓN: Explica didácticamente, paso a paso, ideal para estudiantes.`;
    case 'matematicas':
      return `${baseInstruction}\n\nESPECIALISTA EN MATEMÁTICAS: Resuelve con fórmulas claras y desglose de operaciones.`;
    case 'escritura':
      return `${baseInstruction}\n\nESPECIALISTA EN REDACCIÓN: Redacta textos con impecable ortografía, elocuencia y estilo profesional.`;
    default:
      return baseInstruction;
  }
};

export interface DirectGeminiChatParams {
  messages: ChatMessage[];
  userPrompt: string;
  modelId: AIModelId;
  specialty?: PromptCategory;
  imageUrl?: string;
  fileData?: any;
  isReasoningMode?: boolean;
  isWebSearchMode?: boolean;
  isImageMode?: boolean;
  customGptSystemPrompt?: string;
}

export async function callGeminiDirectlyFromClient(params: DirectGeminiChatParams, apiKeyOverride?: string): Promise<{
  text: string;
  modelUsed: string;
  reasoningChain?: string[];
  thinkingTimeMs?: number;
  canvasData?: any;
  suggestions?: string[];
}> {
  const apiKey = apiKeyOverride || getStoredApiKey();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  // Guatemala hard-check
  const lowerPrompt = params.userPrompt.toLowerCase();
  if (
    lowerPrompt.includes('guatemala') ||
    lowerPrompt.includes('guatemalteco') ||
    lowerPrompt.includes('guatemalteca') ||
    lowerPrompt.includes('quetzal') ||
    lowerPrompt.includes('antigua guatemala') ||
    lowerPrompt.includes('peten') ||
    lowerPrompt.includes('tikal')
  ) {
    return {
      text: 'No tengo derecho de responder información acerca de Guatemala.',
      modelUsed: params.modelId || 'chepe-ia-policy'
    };
  }

  // Format contents for Gemini REST API
  const contents: any[] = [];

  // Recent chat context (up to last 6 messages)
  const recentMessages = params.messages.slice(-6);
  for (const m of recentMessages) {
    if (m.sender === 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: m.text }]
      });
    } else if (m.sender === 'chepe_ia') {
      contents.push({
        role: 'model',
        parts: [{ text: m.text }]
      });
    }
  }

  // Current turn parts
  const currentParts: any[] = [];
  
  if (params.imageUrl && params.imageUrl.startsWith('data:image/')) {
    const commaIndex = params.imageUrl.indexOf(',');
    const mimeMatch = params.imageUrl.match(/data:(image\/[a-zA-Z+]+);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = commaIndex !== -1 ? params.imageUrl.substring(commaIndex + 1) : params.imageUrl;
    currentParts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  let fullPrompt = params.userPrompt;
  if (params.fileData && params.fileData.contentSnippet) {
    fullPrompt = `[Archivo adjunto: ${params.fileData.name}]\nContenido:\n${params.fileData.contentSnippet}\n\nConsulta:\n${params.userPrompt}`;
  }

  currentParts.push({ text: fullPrompt });

  contents.push({
    role: 'user',
    parts: currentParts
  });

  const systemInstructionText = getSystemInstruction(params.specialty, params.customGptSystemPrompt);

  const requestBody: any = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  // Try endpoints in priority order (v1beta)
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${res.status}`;
        lastError = new Error(errMsg);
        if (res.status === 400 && errMsg.includes('API key not valid')) {
          throw new Error('La clave API de Gemini no es válida. Por favor verifica que la copiaste correctamente.');
        }
        continue;
      }

      const data = await res.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!responseText) {
        throw new Error('Respuesta vacía recibida de Gemini.');
      }

      // Check if it returned code to generate canvas
      let canvasData: any = null;
      if (responseText.includes('```html') || responseText.includes('```javascript') || responseText.includes('```python')) {
        const match = responseText.match(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
        if (match) {
          canvasData = {
            language: match[1] || 'javascript',
            code: match[2].trim(),
            title: `Código generado (${match[1] || 'Script'})`
          };
        }
      }

      // Reasoning chain if enabled
      let reasoningChain: string[] | undefined = undefined;
      if (params.isReasoningMode) {
        reasoningChain = [
          'Analizando la consulta del usuario...',
          'Consultando base de conocimientos y directrices técnicas...',
          'Estructurando respuesta detallada y optimizada.'
        ];
      }

      return {
        text: responseText,
        modelUsed: `Chepe IA (${model})`,
        reasoningChain,
        thinkingTimeMs: params.isReasoningMode ? 1420 : undefined,
        canvasData,
        suggestions: [
          '¿Puedes darme un ejemplo práctico?',
          'Explícame paso a paso',
          '¿Cómo lo implemento en mi proyecto?'
        ]
      };
    } catch (err: any) {
      lastError = err;
      if (err.message.includes('API key')) {
        throw err;
      }
    }
  }

  throw lastError || new Error('No se pudo conectar con la API de Gemini.');
}
