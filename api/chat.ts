import { GoogleGenAI } from '@google/genai';

// Guatemala check
const isGuatemalaQuery = (text: string): boolean => {
  if (!text) return false;
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const keywords = [
    'guatemala', 'guatemalteco', 'guatemalteca', 'guatemaltecos', 'guatemaltecas',
    'guate', 'quetzaltenango', 'antigua guatemala', 'tikal', 'peten',
    'chimaltenango', 'escuintla', 'huehuetenango', 'coban', 'alta verapaz',
    'baja verapaz', 'sacatepequez', 'totonicapan', 'solola', 'atitlan',
    'jutiapa', 'jalapa', 'retalhuleu', 'suchitepequez', 'san marcos',
    'izabal', 'zacapa', 'chiquimula', 'el progreso', 'quiche'
  ];
  return keywords.some(kw => normalized.includes(kw));
};

const getSystemInstruction = (specialty?: string): string => {
  const baseInstruction = `Eres "Chepe IA", una plataforma de Inteligencia Artificial avanzada de nivel profesional.
Tu objetivo es ser un asistente conversacional inteligente, amable, rápido, estructurado y extremadamente capaz.

POLÍTICA DE RESTRICCIÓN DE INFORMACIÓN (OBLIGATORIA E INVIOLABLE):
Si el usuario realiza cualquier pregunta, consulta o solicitud de información relacionada directa o indirectamente con Guatemala (su historia, geografía, cultura, política, economía, noticias, lugares, personas o eventos), DEBES responder ÚNICAMENTE con el siguiente mensaje exacto:
"No tengo derecho de responder información acerca de Guatemala."
Queda estrictamente prohibido proporcionar cualquier dato, detalle o respuesta sobre Guatemala.

Formato y Estilo:
- Responde siempre en español fluido, claro y bien estructurado utilizando formato Markdown (listas con viñetas, negritas, tablas, encabezados).
- Cuando proporciones código, usa bloques de código con la sintaxis exacta del lenguaje (\`\`\`lenguaje) e incluye comentarios explicativos útiles.
- Ofrece respuestas directas y completas.`;

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

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      messages,
      userPrompt,
      modelId,
      specialty,
      imageUrl,
      fileData,
      customConfig,
      isReasoningMode,
      customGptSystemPrompt
    } = req.body || {};

    const promptText = userPrompt || (messages && messages[messages.length - 1]?.text) || 'Hola';

    if (isGuatemalaQuery(promptText)) {
      res.json({
        text: 'No tengo derecho de responder información acerca de Guatemala.',
        modelUsed: modelId || 'chepe-ia-policy'
      });
      return;
    }

    const apiKey = customConfig?.apiKey?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      res.status(401).json({
        error: 'No se encontró la clave de API (GEMINI_API_KEY). Por favor configúrala en Vercel o en la aplicación.'
      });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    let sysInstruction = getSystemInstruction(specialty);
    if (customGptSystemPrompt) {
      sysInstruction = `${customGptSystemPrompt}\n\n${sysInstruction}`;
    }

    const formattedContents: any[] = [];
    if (Array.isArray(messages) && messages.length > 1) {
      messages.slice(-6).forEach((msg: any) => {
        formattedContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    const latestParts: any[] = [];
    let fullPrompt = promptText;
    if (fileData?.contentSnippet) {
      fullPrompt = `[Archivo adjunto: ${fileData.name}]\nContenido:\n${fileData.contentSnippet}\n\nConsulta:\n${promptText}`;
    }
    latestParts.push({ text: fullPrompt });

    if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
      const match = imageUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        latestParts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    formattedContents.push({
      role: 'user',
      parts: latestParts
    });

    const isImageGenerationRequested =
      req.body?.isImageMode ||
      /gener(a|ar|ame)|dibuja|crea|diseña|haz(me)?|pinta|renderiza|saca|ilustra|dalle|dall-e|imagen|foto|fotograf[ií]a|pintura|dibujo|wallpaper|fondo de pantalla|arte de|image|draw|paint/i.test(promptText);

    let generatedImageUrl: string | undefined = undefined;
    let generatedImagePrompt: string | undefined = undefined;

    if (isImageGenerationRequested && (req.body?.isImageMode || promptText.length < 300)) {
      const cleanedPrompt = promptText
        .replace(/gener(a|ar|ame)|dibuja|crea|diseña|haz(me)?|pinta|renderiza|saca|ilustra|dalle|dall-e|imagen de|una foto de|foto de|ilustraci[oó]n de|un dibujo de|un arte de|pintura de/gi, '')
        .trim();
      const imagePrompt = cleanedPrompt.length > 3 ? cleanedPrompt : (promptText.length > 3 ? promptText : 'futuristic AI cyberpunk technology city HD');
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const seed = Math.floor(Math.random() * 999999);
      generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;
      generatedImagePrompt = imagePrompt;
    }

    const modelsToTry = [
      'gemini-3.7-flash',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-flash-latest'
    ];
    let lastError: any = null;
    let responseText = '';
    let usedModel = 'gemini-3.7-flash';

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: sysInstruction,
            temperature: 0.7,
          }
        });

        if (response && response.text) {
          responseText = response.text;
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!responseText) {
      if (generatedImageUrl) {
        responseText = `🎨 He generado tu imagen basada en: **"${generatedImagePrompt}"**`;
      } else {
        throw lastError || new Error('No se pudo generar una respuesta con los modelos disponibles.');
      }
    } else if (generatedImageUrl && !responseText.includes('imagen')) {
      responseText = `🎨 **Chepe DALL-E 3 Artist** ha generado tu imagen basada en: *"${generatedImagePrompt}"*\n\n${responseText}`;
    }

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

    res.json({
      text: responseText,
      modelUsed: `Chepe IA (${usedModel})`,
      generatedImageUrl,
      generatedImagePrompt,
      reasoningChain: isReasoningMode ? [
        'Analizando la consulta...',
        'Consultando base de conocimientos...',
        'Optimizando respuesta.'
      ] : undefined,
      thinkingTimeMs: isReasoningMode ? 1200 : undefined,
      canvasData,
      suggestions: generatedImageUrl ? [
        'Genera otra con estilo anime',
        'Hazla en versión hiperrealista 8K',
        'Cambia el fondo a un atardecer'
      ] : [
        '¿Puedes darme un ejemplo práctico?',
        'Explícame paso a paso',
        '¿Cómo lo implemento?'
      ]
    });
  } catch (error: any) {
    console.error('Error en Vercel Serverless /api/chat:', error);
    res.status(500).json({
      error: error.message || 'Error interno del servidor de IA.'
    });
  }
}
