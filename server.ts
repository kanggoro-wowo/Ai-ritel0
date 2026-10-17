import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      node: "X3XQ+HG2 Alfamart Tanjung Bungin",
      location: "Karawang, Jawa Barat"
    });
  });

  // API endpoint for Gemini retail analytics / sidak recommendations
  app.post("/api/analyze-inventory", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured in server environment" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const { nodeInfo, filteredSkus } = req.body;

      // Privacy Guard: Heavily strip any payload to strictly 3 numeric variables: sku_id, stok_sistem, avg_sales
      const sanitizedSkus = Array.isArray(filteredSkus)
        ? filteredSkus.map((s: any) => ({
            sku_id: String(s.sku_id || ""),
            stok_sistem: Number(s.stok_sistem || 0),
            avg_sales: Number(s.avg_sales || s.avg_sales_harian || 0),
          }))
        : [];

      const systemInstruction = `Identitas: Retail Data Architect untuk Node X3XQ+HG2 Alfamart Tanjung Bungin.
Objektif: Analisis Phantom Inventory berbasis data masked 3 variabel numerik (sku_id, stok_sistem, avg_sales).
Aturan Privasi Data: Data produk telah di-masking secara otomatis. Tidak ada nama barang atau harga yang dikirim ke AI.
Tugas: Berikan analisis taktis sidak fisik berdasarkan kode SKU ID dan pola numerik sisa stok vs rata-rata penjualan.`;

      const prompt = `Node Toko: ${nodeInfo?.name || "Alfamart Tanjung Bungin"} (${nodeInfo?.nodeId || "X3XQ+HG2"})

Daftar SKU Target Sidak (Masked Data - 3 Variabel Numerik: sku_id, stok_sistem, avg_sales):
${JSON.stringify(sanitizedSkus, null, 2)}

Mohon berikan laporan taktis singkat:
1. Evaluasi Pola Anomali Stok vs Rata-rata Penjualan
2. Rekomendasi Langkah Sidak Fisik Prioritas (Lokasi Rak vs Gudang Belakang vs Cek Kasir)
3. Instruksi Auto-Replenishment (Prosedur Eksekusi Nolkan Stok di POS/ERP)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.1,
        },
      });

      return res.json({ analysis: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate AI analysis" });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
