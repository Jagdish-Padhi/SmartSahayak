import DailyHabit from "../models/dailyHabit.js";
import UserHabit from "../models/userHabits.js";
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const today = new Date().toISOString().slice(0, 10);

const prompt = `"Har din ek chhota, acha aur simple real-life task do jo ek rural Indian student asaani se kar sake. Task friendly aur simple Hinglish me ho (English letters me Hindi), jaise ki ghar ke kaam me madad karna, school me kisi friend ki help karna, ya padhai me discipline banana. Har task ke niche uske 2-3 simple fayde bhi point-wise batao taaki student ko motivation mile.

Format hamesha yeh hona chahiye:

koi acha kaam karne ka task
(Simple daily task in Hinglish)

Fayde:

(Fayda 1)

(Fayda 2)

(Fayda 3) (agar ho to)

Tone hamesha positive, respectful aur relatable honi chahiye. Neeche kuch examples diye gaye hain jise follow karo:

🧠 Example:
"Aaj school me kisi ek friend ka doubt solve karo."

Fayde:

Tumhara concept bhi clear hoga.

Dosti aur trust banega.

Tum confident feel karoge.

"Aaj 15 minute bina mobile ke sirf padhai pe dhyan do."

Fayde:

Dhyan lagana aayega.

Mind fresh lagega.

Result achha ho sakta hai.

"Aaj mummy ko khaana banane ke baad bartan dhone me help karo."

Fayde:

Mummy ko aaram milega.

Tumhe responsibility ka ehsaas hoga.

Ghar me pyar badhega.

"Aaj kisi chhote bhai-behen ko likhne ya padhne me madad karo."

Fayde:

Tumhare patience me sudhaar aayega.

Unka future better banega.

Tum role model banoge.

"Aaj school jaane se pehle bag check karo ki sab kuch hai ya nahi."

Fayde:

Kuch bhoolne ka chance kam hoga.

Tum disciplined feel karoge.

Tension-free rahoge school me.

"Aaj bina chillaye mummy-papa ki baat dhyan se suno."

Fayde:

Ghar ka mahaul shaant rahega.

Tumhe samajhne ki aadat lagegi.

Respect badhega.

Bas isi pattern me har din ek naya task do. Task realistic, useful aur rural student ke daily life se connected hona chahiye."`;

// ___________________To Get and Update Habit task each day________________________________________________________________________________

export const getTodayHabit = async (req, res) => {
  try {
    const forceNew = req.query.new;

    let habit = await DailyHabit.findOne({ date: today });

    if (!habit || forceNew) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: "Aaj ke liye ek naya daily habit task batao.",
          },
        ],
      });

      const generatedHabit = response.choices[0].message.content;

      if (habit && forceNew) {
        habit.text = generatedHabit;
        await habit.save();
      } else {
        habit = await DailyHabit.create({ date: today, text: generatedHabit });
      }
    }

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// __________________________Marking as DONE after student clicks maine kiya______________________

export const markHabitDone = async (req, res) => {
  const { uid } = req.body;

  try {
    const existing = await UserHabit.findOne({ uid, date: today });

    if (!existing) {
      await UserHabit.create({ uid, date: today, done: true });
    }

    const count = await UserHabit.countDocuments({ uid, done: true });
    res.json({ message: "Marked as done!", totalStars: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
