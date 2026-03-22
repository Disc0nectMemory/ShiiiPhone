import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy endpoint to bypass CORS
  app.post("/api/proxy/models", async (req, res) => {
    try {
      const { baseUrl, apiKey } = req.body;
      if (!baseUrl) {
        return res.status(400).json({ error: "Missing baseUrl" });
      }

      let urlStr = baseUrl.trim();
      if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
        urlStr = 'https://' + urlStr;
      }
      
      // If the user already included /models, don't add it again.
      const url = urlStr.endsWith('/models') || urlStr.endsWith('models') 
        ? urlStr 
        : (urlStr.endsWith('/') ? `${urlStr}models` : `${urlStr}/models`);

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: `HTTP error! status: ${response.status}` });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Proxy error fetching models:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch models via proxy' });
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
