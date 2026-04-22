import type { Express } from "express";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export function registerAiRoutes(app: Express) {
  app.post("/api/generate-description", async (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    const category = String(req.body?.category ?? "").trim();
    const extra = String(req.body?.extra ?? "").trim();

    if (!name) {
      return res.status(400).json({ error: "Brak nazwy produktu" });
    }

    const prompt = [
      "Piszesz krótki opis produktu (repsy/reps) na sklep online.",
      "Zasady:",
      "- 2-3 krótkie zdania (max ~220 znaków razem)",
      "- ton: luzacki ale rzeczowy, NIE przesadnie młodzieżowy",
      "- proste, zrozumiałe słowa",
      "- KONIECZNIE wspomnij o konkretach: jakość materiału, wygoda, wykonanie, podobieństwo do oryginału (np. 'najlepszy materiał', 'super wygodne', 'solidne wykonanie', 'jak 1:1 z oryginałem', 'świetne szwy')",
      "- możesz delikatnie wpleść słowo typu 'legit' albo 'mocne', ale bez przesady",
      "- bez emoji, bez hashtagów, bez nagłówków, bez wstępów typu 'Oto opis'",
      "",
      `Produkt: ${name}`,
      category ? `Kategoria: ${category}` : "",
      extra ? `Wskazówki: ${extra}` : "",
      "",
      "Zwróć tylko sam opis.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { maxOutputTokens: 8192 },
      });
      const text = (response.text || "").trim();
      if (!text) {
        return res.status(500).json({ error: "AI nie zwróciło opisu" });
      }
      res.json({ description: text });
    } catch (err) {
      console.error("AI error:", err);
      res.status(500).json({ error: "Nie udało się wygenerować opisu" });
    }
  });
}
