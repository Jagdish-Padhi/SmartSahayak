import express from "express";
import Groq from "groq-sdk";
import { marked } from "marked";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//_______________ Get session history____________________________________________________

router.get("/history", (req, res) => {
  res.json({ history: req.session.doubts || [] });
});

//__________________ Clearing chat________________________________________________________

router.post("/clear", (req, res) => {
  req.session.doubts = [];
  res.json({ message: "History cleared" });
});

//___________________ Handling new doubt__________________________________________________

router.post("/ask", async (req, res) => {
  const { question, subject } = req.body;
  if (!question || !subject)
    return res.status(400).json({ error: "Missing input" });

  if (!req.session.doubts) req.session.doubts = [];

  req.session.doubts.push({ role: "user", content: question });

  try {
    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Tum  ${subject} ke expert teacher ho. Rural students ke doubt solve karne me help karo in simple chating language example ke sath!`,
        },
        ...req.session.doubts,
      ],
      model: "llama3-8b-8192",
    });

    const markdownReply = result.choices[0].message.content;
    const aiReply = marked(markdownReply);

    req.session.doubts.push({ role: "assistant", content: aiReply });

    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
