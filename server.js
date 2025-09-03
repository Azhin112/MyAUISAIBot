import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route: chatbot
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // lightweight, fast
        messages: [
          { role: "system", content: "You are a helpful AUIS chatbot answering questions about registration and scholarships." },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response.";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("AUIS Chatbot backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
