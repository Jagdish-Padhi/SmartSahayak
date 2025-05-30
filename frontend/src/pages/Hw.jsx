import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Msg from "../components/Msg";
import Chat from "../components/Chat";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";

export default function HomeworkPage() {
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  const [hwList, setHwList] = useState([]);
  const [file, setFile] = useState(null);
  const [subjectForUpload, setSubjectForUpload] = useState("");
  const [hwIdToSubmit, setHwIdToSubmit] = useState("");

  const [feedback, setFeedback] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  // ____________________________________For new HW generation - subjects will come from schedule__________________________________________________

  const [scheduledSubjectsForGeneration, setScheduledSubjectsForGeneration] =
    useState([]);
  const [selectedSubjectForGeneration, setSelectedSubjectForGeneration] =
    useState("");
  const [topicForGeneration, setTopicForGeneration] = useState("");

  const displayMessage = useCallback((text, type, duration = 3000) => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(""), duration);
  }, []);

  // ____________________________________Fetching subjects directly from the student's schedule for today__________________________________________

  const fetchScheduledSubjects = useCallback(async () => {
    if (!uid) {
      setScheduledSubjectsForGeneration([]);
      return;
    }
    try {
      const res = await axios.get(`/api/schedules/today-subjects?uid=${uid}`);
      setScheduledSubjectsForGeneration(res.data || []);
    } catch (err) {
      console.error("Error fetching scheduled subjects for generation:", err);
      displayMessage(
        "Could not load subjects for homework generation.",
        "error"
      );
      setScheduledSubjectsForGeneration([]);
    }
  }, [uid, displayMessage]);

  // _____________________________________Fetching existing homework items (Hw documents) for today_________________________________________________

  const fetchTodayHw = useCallback(async () => {
    if (!uid) {
      setHwList([]);
      return;
    }
    try {
      const res = await axios.get(`/api/hw/today?uid=${uid}`);
      setHwList(res.data || []);
    } catch (err) {
      console.error("Error fetching today's hw:", err);
      displayMessage(
        err.response?.data?.error || "Error fetching homework tasks.",
        "error"
      );
      setHwList([]);
    }
  }, [uid, displayMessage]);

  useEffect(() => {
    if (uid) {
      fetchScheduledSubjects();
      fetchTodayHw();
    } else {
      //Clear lists if no user
      setHwList([]);
      setScheduledSubjectsForGeneration([]);
      setSelectedSubjectForGeneration("");
      setSubjectForUpload("");
      setHwIdToSubmit("");
    }
  }, [uid, fetchScheduledSubjects, fetchTodayHw]); // to Re-run if uid or memoized fetchers change

  // ______________________________________Pre-select the first subject for generation when the list loads
  useEffect(() => {
    if (scheduledSubjectsForGeneration.length > 0) {
      // Only update if current selection is invalid or empty
      if (
        !selectedSubjectForGeneration ||
        !scheduledSubjectsForGeneration.includes(selectedSubjectForGeneration)
      ) {
        setSelectedSubjectForGeneration(scheduledSubjectsForGeneration[0]);
      }
    } else {
      setSelectedSubjectForGeneration(""); // Clear if no subjects
    }
  }, [scheduledSubjectsForGeneration, selectedSubjectForGeneration]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //____________________________________________at Upload time subject handling_____________________________________

  const handleSubjectForUploadChange = (e) => {
    const selectedSub = e.target.value;
    setSubjectForUpload(selectedSub);
    const pendingHw = hwList.find(
      (hw) => hw.subject === selectedSub && hw.status === "pending"
    );
    if (pendingHw) {
      setHwIdToSubmit(pendingHw._id);
    } else {
      setHwIdToSubmit("");
      if (selectedSub)
        displayMessage(
          `No pending homework found for ${selectedSub} to upload.`,
          "error"
        );
    }
  };

  //___________________________________________ handling submission in upload_______________________________________

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!file || !subjectForUpload || !hwIdToSubmit) {
      displayMessage(
        "Please select a subject with pending homework and upload a file!",
        "error"
      );
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("hwId", hwIdToSubmit);
    try {
      setLoadingUpload(true);
      setFeedback("");
      const res = await axios.post("/api/hw/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback(res.data.feedback || "Homework submitted.");
      displayMessage(
        "✅ Homework uploaded successfully! Feedback received.",
        "success"
      );
      fetchTodayHw(); // Refresh homework list
      setFile(null);
      const uploadForm = e.target; // Get the form element
      uploadForm.reset(); // Reset the form fields specifically
      setSubjectForUpload("");
      setHwIdToSubmit("");
    } catch (err) {
      console.error("Upload failed: ", err);
      const errorMsg =
        err.response?.data?.error || "Something went wrong! Try again.";
      setFeedback(errorMsg);
      displayMessage(`❌ ${errorMsg}`, "error");
    } finally {
      setLoadingUpload(false);
    }
  };

  //___________________________________________ handling new generation of hw_______________________________________

  const handleGenerateHw = async () => {
    if (!uid || !selectedSubjectForGeneration || !topicForGeneration) {
      displayMessage(
        "Please select a subject and enter a topic to generate homework.",
        "error"
      );
      return;
    }
    try {
      setLoadingGenerate(true);
      // The backend's /api/hw/new will create/update an Hw document
      await axios.post("/api/hw/new", {
        uid,
        subject: selectedSubjectForGeneration,
        topic: topicForGeneration,
      });
      displayMessage(
        `✅ Homework for ${selectedSubjectForGeneration} on '${topicForGeneration}' generated!`,
        "success"
      );
      fetchTodayHw(); // Refresh the homework list to show the new/updated task
      setTopicForGeneration("");
    } catch (err) {
      console.error("Error generating HW:", err);
      const errorMsg =
        err.response?.data?.error || "Failed to generate homework. Try again!";
      displayMessage(`❌ ${errorMsg}`, "error");
    } finally {
      setLoadingGenerate(false);
    }
  };

  // _________________________________________PAGE KA LAYOUT AND DESIGN_____________________________________________

  return (
    <>
      <Navbar />
      {msg && <Msg text={msg} type={msgType} />}

      <div className="p-4 bg-amber-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📘 Homework Manager
        </h1>

        {/*_____________________________________________ DISPLAYING HOMEWORK AS LIST FORM_______________________________________________ */}

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Today's Tasks
          </h2>
          <div className="space-y-4">
            {hwList && hwList.length > 0 ?
              hwList.map((item) => (
                <div
                  key={item._id}
                  className={`p-4 rounded-xl shadow-md ${
                    item.status === "completed" ?
                      "bg-green-100"
                    : "bg-orange-100"
                  } hover:shadow-xl transition hover:scale-102 transform duration-200`}
                >
                  <div className="font-semibold text-lg text-gray-800">
                    {item.subject}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    Topic:{" "}
                    {item.topic ||
                      (item.givenByAI ? "AI Generated" : "General")}
                  </p>

                  {/* ✅ Render Task as Markdown */}
                  <div className="prose prose-sm text-gray-800 mb-2">
                    <ReactMarkdown>{item.task || ""}</ReactMarkdown>
                  </div>

                  {item.status === "completed" ?
                    <div className="text-green-800">
                      ✅ Completed — Score: {item.score}/10
                      {item.feedback && (
                        <p className="mt-1 text-xs italic">
                          Feedback: {item.feedback}
                        </p>
                      )}
                    </div>
                  : <div className="text-orange-700">🕒 Pending Submission</div>
                  }
                </div>
              ))
            : <p className="text-gray-600 text-center py-4">
                {uid ?
                  "No homework tasks for today, or they are yet to be generated/assigned."
                : "Please log in to see your homework."}
              </p>
            }
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/*____________________________________________ UPLOAD HOMEWORK SECTION ____________________________________________________________________________________ */}

          <div className="bg-white rounded-xl p-6 shadow-md border-l-8 border-[#4A7C59] hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              📤 Upload Your Homework
            </h2>
            <p className="text-gray-700 mb-6 text-sm">
              Select a pending homework task, upload your work, and get AI
              feedback!
            </p>
            <form
              onSubmit={handleSubmitUpload}
              className="bg-[#e6fff2] p-6 rounded-lg shadow space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Select Subject (Pending Homework)
                </label>
                <select
                  value={subjectForUpload}
                  onChange={handleSubjectForUploadChange}
                  className="w-full mt-1 p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">-- Select Subject --</option>

                  {/*________________________________ Populating from hwList that are pending ___________________________________*/}

                  {hwList
                    .filter(
                      (hw) =>
                        hw.status === "pending" &&
                        hw.task &&
                        !hw.task
                          .toLowerCase()
                          .includes("no homework task assigned yet")
                    )
                    .map((hw) => (
                      <option key={hw._id} value={hw.subject}>
                        {hw.subject} {hw.topic ? `(${hw.topic})` : ""}
                      </option>
                    ))}
                </select>
              </div>

              {/* //___________________________________________ taking input from user as image for scanning _______________________________________ */}

              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Upload Image of Your Work
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700 mt-1
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100 transition duration-200 ease-in-out"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loadingUpload || !hwIdToSubmit}
                className="w-full bg-green-600 text-white px-4 py-2.5 mt-3 rounded-xl text-lg font-medium shadow-md hover:bg-green-700 transition duration-300 hover:scale-105 disabled:bg-gray-400"
              >
                {loadingUpload ? "Uploading...." : "Submit Homework"}
              </button>
            </form>

            {/* ____________________________________________Here smartSahayak will give feedback after scannning hw_____________________________________ */}

            {feedback && !loadingUpload && (
              <div className="mt-6 p-4 bg-blue-50 rounded shadow-md">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📋 AI Feedback:
                </h3>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {feedback}
                </p>
              </div>
            )}
          </div>

          {/*___________________________________________________ GENERATE NEW Homework SECTION______________________________________________________________________________________________________ */}

          <div className="bg-white rounded-xl p-6 shadow-md border-l-8 border-[#F0A500] hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              🧠 Generate Today's Homework
            </h2>
            <p className="text-gray-700 mb-6 text-sm">
              Select a subject from your daily schedule and provide a topic to
              get a new task.
            </p>
            <div className="bg-[#fff8e1] p-6 rounded-lg shadow space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Select Subject (from your schedule)
                </label>
                <select
                  value={selectedSubjectForGeneration}
                  onChange={(e) =>
                    setSelectedSubjectForGeneration(e.target.value)
                  }
                  className="w-full mt-1 p-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
                  required
                >
                  <option value="">-- Select Subject --</option>

                  {/* _____________________________________Populate from scheduledSubjectsForGeneration _____________________________________________________________*/}

                  {scheduledSubjectsForGeneration.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Enter Topic
                </label>
                <input
                  type="text"
                  value={topicForGeneration}
                  onChange={(e) => setTopicForGeneration(e.target.value)}
                  placeholder="e.g., Algebra, Photosynthesis, Tenses"
                  className="w-full mt-1 p-2 border rounded-md focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>
              <button
                onClick={handleGenerateHw}
                disabled={
                  loadingGenerate || scheduledSubjectsForGeneration.length === 0
                }
                className="w-full bg-amber-500 text-white px-4 py-2.5 mt-3 rounded-xl text-lg font-medium shadow-md hover:bg-amber-600 transition duration-300 hover:scale-105 disabled:bg-gray-400"
              >
                {loadingGenerate ? "Generating..." : "Generate Task"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Chat src={logo} onClick={""} />

      <Footer />
    </>
  );
}
