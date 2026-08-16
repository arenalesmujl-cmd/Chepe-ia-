import { GoogleGenAI } from '@google/genai';

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
    const { audioBase64, mimeType } = req.body || {};

    if (!audioBase64) {
      res.status(400).json({ error: 'No se proporcionó audio para transcribir.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Clave GEMINI_API_KEY no configurada en el servidor.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const cleanBase64 = audioBase64.replace(/^data:audio\/[a-zA-Z0-9_-]+;base64,/, '');

    const modelsToTry = [
      'gemini-3.7-flash',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest'
    ];

    let transcript = '';
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || 'audio/webm',
                    data: cleanBase64
                  }
                },
                {
                  text: 'Transcribe este audio con máxima exactitud en español. Devuelve única y exclusivamente las palabras habladas por el usuario, sin introducciones, sin comillas y sin comentarios adicionales.'
                }
              ]
            }
          ]
        });

        if (response && response.text) {
          transcript = response.text.trim();
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Transcription] Model ${modelName} failed:`, err?.message || err);
      }
    }

    if (!transcript) {
      throw lastError || new Error('No se pudo transcribir el audio.');
    }

    res.json({
      success: true,
      transcript: transcript
    });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({
      error: error?.message || 'Error al procesar la transcripción de audio.'
    });
  }
}
