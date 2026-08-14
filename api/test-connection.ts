import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Método no permitido' });
    return;
  }

  try {
    const { apiKey } = req.body || {};
    const keyToUse = apiKey?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!keyToUse) {
      res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna clave API de Gemini.'
      });
      return;
    }

    const testAi = new GoogleGenAI({ apiKey: keyToUse });
    const response = await testAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
    });

    if (response && response.text) {
      res.json({
        success: true,
        message: '¡Conexión exitosa! El motor de Gemini 2.5 Flash está activo y respondiendo.'
      });
    } else {
      res.json({
        success: false,
        message: 'Respuesta inesperada al probar la clave.'
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error al validar la clave API.'
    });
  }
}
