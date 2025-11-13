// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { registerUser } = require("./registerUser"); // your backend function

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// API route: /api/register
app.post("/api/register", async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userRecord = await registerUser(email, password, nickname);
    return res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (err) {
    console.error("❌ Error in /api/register:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ Server running. Try POST /api/register");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
