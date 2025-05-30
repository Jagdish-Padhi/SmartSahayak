import Hw from "../models/hw.js";
import Schedule from "../models/schedules.js";
import dayjs from "dayjs";
import Tesseract from "tesseract.js";
import { getGroqFeedback, getGroqHw } from "../utils/hwHelper.js";

//_____________get Scheduled subjects for TODAY to update in select field of generate______________________

export const getScheduledSubjectsForToday = async (req, res) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ error: "User ID (uid) is required." });
  }

  const todayDayName = dayjs().format("dddd");

  try {
    const schedules = await Schedule.find({ uid, day: todayDayName });

    if (!schedules || schedules.length === 0) {
      return res.json([]);
    }

    // Extract unique subject names
    const uniqueSubjects = Array.from(
      new Set(schedules.map((entry) => entry.subject))
    );
    res.json(uniqueSubjects);
  } catch (err) {
    console.error("Error fetching scheduled subjects for today:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch scheduled subjects for today." });
  }
};

//_____________________ Utility to parse score from feedback text_____________________________

const parseScoreFromFeedback = (feedbackText) => {
  const scoreMatch = feedbackText.match(
    /Estimated score:\s*(\d{1,2})\s*\/\s*10/
  ); // "Estimated score: X/10"
  if (scoreMatch && scoreMatch[1]) {
    return parseInt(scoreMatch[1], 10);
  }
  // Fallback or default score if not found in feedback
  const commonScoreWords = feedbackText.toLowerCase();
  if (commonScoreWords.includes("excellent")) return 9;
  if (commonScoreWords.includes("perfect")) return 10;
  if (commonScoreWords.includes("good")) return 7;
  if (commonScoreWords.includes("average")) return 5;
  return 5; //by Default
};

//________________________________________Get HW details__________________________________________

export const getTodayHw = async (req, res) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ error: "User ID (uid) is required." });
  }

  const today = dayjs().format("dddd");
  const todayDate = dayjs().startOf("day").toDate();

  try {
    const schedules = await Schedule.find({ uid, day: today });

    if (!schedules.length) {
      return res.json([]);
    }

    const hws = await Promise.all(
      schedules.map(async (entry) => {
        const existingHw = await Hw.findOne({
          uid,
          subject: entry.subject,
          date: {
            $gte: todayDate,
            $lt: dayjs(todayDate).endOf("day").toDate(),
          },
        });

        if (existingHw) return existingHw;

        const newHw = new Hw({
          uid,
          subject: entry.subject,
          date: todayDate,
          task: `No homework task assigned yet for ${entry.subject}. Click 'Generate' to create one.`,
          status: "pending",
          givenByAI: false,
        });
        return await newHw.save();
      })
    );
    res.json(hws);
  } catch (err) {
    console.error("Error in getTodayHw:", err);
    res.status(500).json({ error: err.message });
  }
};

//___________________________________________Uploading Homework!__________________________________

export const uploadHw = async (req, res) => {
  const { hwId } = req.body;
  const imgPath = req.file?.path;

  if (!hwId) {
    return res.status(400).json({ error: "Homework ID (hwId) is required." });
  }
  if (!imgPath) {
    return res.status(400).json({ error: "Image file is required." });
  }

  try {
    const {
      data: { text: extractedText },
    } = await Tesseract.recognize(imgPath, "eng", {
      logger: (m) => console.log(m),
    });

    const aiFeedbackText = await getGroqFeedback(extractedText);
    const calculatedScore = parseScoreFromFeedback(aiFeedbackText);

    const updatedHw = await Hw.findByIdAndUpdate(
      hwId,
      {
        imageURL: imgPath,
        extractedText,
        feedback: aiFeedbackText,
        status: "completed",
        score: calculatedScore,
        submissionDate: new Date(),
      },
      { new: true }
    );

    if (!updatedHw) {
      return res.status(404).json({ error: "Homework not found." });
    }
    res.json(updatedHw);
  } catch (err) {
    console.error("Error in uploadHw:", err);
    res.status(500).json({ error: `Upload failed: ${err.message}` });
  }
};

//_______________________________Generate new Homeworks______________________________________

export const generateNewHw = async (req, res) => {
  const { uid, subject, topic } = req.body;

  if (!uid || !subject || !topic) {
    return res
      .status(400)
      .json({ error: "UID, subject, and topic are required." });
  }

  try {
    const generatedTask = await getGroqHw(subject, topic || "general topics");
    const todayDate = dayjs().startOf("day").toDate();

    //_____________Try to find an existing pending homework for this subject and date to update______________

    let hw = await Hw.findOneAndUpdate(
      {
        uid,
        subject,
        date: {
          $gte: todayDate,
          $lt: dayjs(todayDate).endOf("day").toDate(),
        },
      },
      {
        task: generatedTask,
        givenByAI: true,
        status: "pending",
        feedback: "",
        score: 0,
        imageURL: "",
        extractedText: "",
        topic: topic,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(hw);
  } catch (err) {
    console.error("Error in generateNewHw:", err);
    res.status(500).json({ error: err.message });
  }
};
