import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//____________________________STUDENT KO FEEDBACK DENE KE LIYE____________________________________________________________________

export const getGroqFeedback = async (text) => {
  const prompt = `Student's homework answer: ${text}. 
  Check this in simple language suitable for rural students in hinglish. 
  State if it's correct, what's missing, and give suggestions for improvement
  in friendly hinglish language. Also suggest an estimated score out of 10 and why.`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant evaluating rural student homework. Provide feedback in clear, simple Hinglish and suggest a score out of 10. Format the score suggestion clearly, for example: 'Aapka score: 8/10'.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama3-8b-8192",
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error getting Groq feedback:", error);
    return "AI feedback currently unavailable.";
  }
};

// ___________________________________FOR NEW HW GENERATION_______________________________________________________________

export const getGroqHw = async (subject, topic) => {
  const prompt = `Generate a single, clear homework task for a rural student on the subject: "${subject}". 
  The specific topic is: "${topic}". 
  The task should be suitable for daily homework and clearly actionable. Provide the task in simple English.`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant creating one specific homework task for rural students. Keep the language simple, clear, and the task relevant and concise. Provide only the homework task itself.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama3-8b-8192",
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error getting Groq homework:", error);
    return `Could not generate homework for ${subject} on ${topic}. Please try again.`;
  }
};
