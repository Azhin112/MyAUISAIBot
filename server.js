import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an expert AUIS assistant specialized in registration, enrollment, scholarships, financial aid, course selection, and academic policies.
Only answer questions related to AUIS. Be concise, polite, and helpful.
If the question is unrelated, respond with: "Sorry, I can only answer AUIS registration or scholarship questions."
            `
          },
          { role: "user", content: message }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
