// Minimal edit for testing
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // API route for Chat
  app.post("/api/chat", async (req, res) => {
    const { messages, context } = req.body;
    
    // The platform automatically injects a working free-tier GEMINI_API_KEY
    // into the environment as long as there are no overriding secrets.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "System API key missing. Please delete any manual GEMINI_API_KEY secret to restore default access." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = messages[messages.length - 1].content;
      
      const systemInstruction = `You are PayrollBot, an advanced, cheerful AI ChatBot. Use emojis tastefully. 
        Developer: Mohammed Affaan. 
        Context: The user currently has these employees: ${context?.map((e: any) => `${e.name} (${e.job}) - Net: ${e.netSalary}`).join(', ') || 'None'}.
        CRITICAL RULE: If the user asks a general knowledge question (like "what is a horse" or anything not related to payroll), you MUST answer their question fully, accurately, and politely. DO NOT decline to answer. HOWEVER, after you answer their question, playfully steer the conversation back to payroll and ask if they need help managing the payroll system or calculating salaries.
        FORMATTING RULE: When the user asks you to explain 'in points' or 'bullet points', you MUST answer in lists. When asked to be 'brief', you MUST provide a very short, concise response. 
        ALWAYS use markdown for bolding (** text **), bullet points, and headers.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction
        }
      });

      res.json({ text: result.text });
    } catch (err: any) {
      console.error("DEBUG: Detailed Chat error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      res.status(500).json({ 
        error: `Connection failed. Error: ${err.message || 'Unknown error'}. Try deleting your GEMINI_API_KEY secret.` 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
