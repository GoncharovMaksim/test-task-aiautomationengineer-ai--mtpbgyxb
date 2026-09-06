import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
    return NextResponse.json(
      {
        success: false,
        status: "missing_api_keys",
        message: "Neither GEMINI_API_KEY nor GROQ_API_KEY are configured in environment variables.",
        geminiConfigured: false,
        groqConfigured: false,
      },
      { status: 503 }
    );
  }

  const startTime = Date.now();

  if (geminiKey) {
    try {
      const prompt = `You are the Metacritic AI Analyzer engine. Return valid JSON only with exact structure:
{"status": "operational", "model": "gemini-2.5-flash", "testVerdict": "Google Gemini 2.5 Flash is actively processing review analytics."}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(10000),
      });

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json(
          {
            success: false,
            status: "api_error",
            provider: "Google Gemini",
            model: "gemini-2.5-flash",
            statusCode: res.status,
            latencyMs,
            error: errText,
          },
          { status: res.status }
        );
      }

      const json = await res.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      let parsed = null;
      try {
        parsed = rawText ? JSON.parse(rawText.trim()) : null;
      } catch {
        parsed = rawText;
      }

      return NextResponse.json({
        success: true,
        status: "operational",
        provider: "Google Gemini",
        model: "gemini-2.5-flash",
        apiKeyConfigured: true,
        apiKeyMasked: `${geminiKey.slice(0, 6)}...${geminiKey.slice(-4)}`,
        latencyMs,
        aiResponse: parsed,
        verifiedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          status: "exception",
          provider: "Google Gemini",
          model: "gemini-2.5-flash",
          error: err.message,
          latencyMs: Date.now() - startTime,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: false,
    status: "gemini_key_not_configured",
    groqConfigured: Boolean(groqKey),
  });
}
