import express from "express";
import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Define __dirname in an ES module (for Node.js 14+)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Serve the public directory
app.use(express.static(__dirname + "/public"));

// 📌 API that returns bitrate information in JSON format
app.get("/stats", async (req, res) => {
  try {
    const STATS_URL = req.query.statsUrl;
    const TYPE = req.query.type;
    const STREAM_ID = req.query.streamId;
    if (!STATS_URL || !TYPE || !STREAM_ID) {
      res.status(400).json({ error: "You must specify statsUrl, type, and streamId parameters" });
      return;
    }
    const response = await fetch(STATS_URL);
    console.log(response);
    if (!response.ok) {
      res.status(500).json({ error: "Failed to retrieve stats" });
      return;
    }
    if (TYPE == "rtmp") {
      const text = await response.text();
      const parser = new XMLParser();
      const xml = parser.parse(text);
      const stream = xml.rtmp.server.application.live.stream.find((stream) => stream.name == STREAM_ID);
      if (!stream) {
        res.status(400).json({ error: "Stream not found" });
        return;
      }
      const bitrate = stream.bw_video / 1024;
      res.json({ bitrate });
      return;
    } else if (TYPE == "srt") {
      const json = await response.json();
      if (!json.publishers[STREAM_ID]) {
        res.status(400).json({ error: "Stream not found" });
        return;
      }
      const bitrate = json.publishers[STREAM_ID].bitrate;
      res.json({ bitrate });
      return;
    } else {
      res.status(400).json({ error: "Invalid type" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bitrate: " + error.message });
  }
});

// 📌 Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running: http://localhost:${PORT}`);
});
