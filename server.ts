import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { handleLeadGen, handleOutreachGen } from "./api/_lib/ai-logic";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { niche, location, count = 10, task = 'leads', lead } = req.body;

    try {
      if (task === 'leads') {
        const data = await handleLeadGen(niche, location, count);
        return res.json({ success: true, leads: data.leads });
      } else if (task === 'outreach' && lead) {
        const data = await handleOutreachGen(lead);
        return res.json({ success: true, ...data });
      } else {
        return res.status(400).json({ success: false, error: "Invalid task or missing lead data" });
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Legacy endpoints (forward to /api/chat)
  app.post("/api/leads", async (req, res) => {
    req.body.task = 'leads';
    const { niche, location, count = 10 } = req.body;
    try {
      const data = await handleLeadGen(niche, location, count);
      res.json({ success: true, leads: data.leads });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/outreach", async (req, res) => {
    const { lead } = req.body;
    try {
      const data = await handleOutreachGen(lead);
      res.json({ success: true, ...data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.all("/api/*", (req, res) => {
    res.status(404).json({ success: false, error: "API endpoint not found" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
