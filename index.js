import express from "express";
import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const RTMP_STATS_URL = "http://localhost/stats"; // RTMP stats.xml URL'ni buraya yaz

// __dirname'i ES module içinde tanımlama (Node.js 14+ için)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Statik dosyaları sun (index.html ve diğerlerini)
app.use(express.static(__dirname));

// 📌 Bitrate bilgisini JSON formatında dönen API
app.get("/stats", async (req, res) => {
    try {
        const response = await fetch(RTMP_STATS_URL);
        const text = await response.text();
        const parser = new XMLParser();
        const xml = parser.parse(text);

        const bitrate = xml.rtmp.server.application.live.stream.bw_in; // XML yapısına göre ayarla
        res.json({ bitrate });
    } catch (error) {
        res.status(500).json({ error: "Bitrate alınamadı" });
    }
});


// 📌 Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`✅ Server çalışıyor: http://localhost:${PORT}`);
});
