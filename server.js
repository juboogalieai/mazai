const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory "database"
const jobs = {};

/**
 * POST /create-video
 * body: { prompt: string }
 */
app.post("/create-video", (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const id = uuidv4();

  jobs[id] = {
    id,
    prompt,
    status: "processing",
    createdAt: Date.now(),
    videoUrl: null,
  };

  // simulate video generation delay
  setTimeout(() => {
    jobs[id].status = "completed";
    jobs[id].videoUrl = `https://maz-ai.fake/videos/${id}.mp4`;
  }, 5000);

  res.json({
    message: "Video job created",
    jobId: id,
  });
});

/**
 * GET /status/:id
 */
app.get("/status/:id", (req, res) => {
  const job = jobs[req.params.id];

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
});

/**
 * GET /video/:id
 */
app.get("/video/:id", (req, res) => {
  const job = jobs[req.params.id];

  if (!job || job.status !== "completed") {
    return res.status(404).json({ error: "Video not ready" });
  }

  res.redirect(job.videoUrl);
});

app.listen(PORT, () => {
  console.log(`🚀 Maz AI server running on http://localhost:${PORT}`);
});
