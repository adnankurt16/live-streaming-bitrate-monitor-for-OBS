import express from "express";
import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// __dirname'i ES module içinde tanımlama (Node.js 14+ için)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Statik dosyaları sun (index.html ve diğerlerini)
app.use(express.static(__dirname));

// 📌 Bitrate bilgisini JSON formatında dönen API
app.get("/stats", async (req, res) => {
  try {
    const STATS_URL = req.query.statsUrl;
    const TYPE = req.query.type;
    const STREAM_ID = req.query.streamId;
    if (!STATS_URL || !TYPE || !STREAM_ID) {
      res.status(400).json({ error: "statsUrl, type ve streamId parametrelerini belirtmelisiniz" });
      return;
    }
    const response = await fetch(STATS_URL);
    if (TYPE == "rtmp") {
      const text = await response.text();
      const parser = new XMLParser();
      const xml = parser.parse(text);
      const bitrate = xml.rtmp.server.application.live.stream.find((stream) => stream.name == STREAM_ID).bw_video / 1024;
      res.json({ bitrate });
      return;
    } else if (TYPE == "srt") {
      const json = await response.json();
      const bitrate = json.publishers[STREAM_ID].bitrate;
      res.json({ bitrate });
      return;
    } else {
      res.status(400).json({ error: "Invalid type" });
    }
  } catch (error) {
    res.status(500).json({ error: "Bitrate alınamadı: " + error.message });
  }
});

// 📌 Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Server çalışıyor: http://localhost:${PORT}`);
});
