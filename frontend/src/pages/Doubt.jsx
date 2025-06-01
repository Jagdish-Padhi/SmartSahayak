import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DOMPurify from "dompurify";

export default function Doubt() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // ___________________________FETCHING HISTORY TO SHOW CHATS_________________________________________

  const fetchHistory = async () => {
    const res = await axios.get("/api/doubts/history");
    setChatHistory(res.data.history);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    // Auto scroll to latest message
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ___________________________HANDLING ASKING PROCESS_________________________________________

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      await axios.post("/api/doubts/ask", { question, subject });
      setQuestion("");
      await fetchHistory();
    } catch (err) {
      alert("⚠️ Error asking doubt");
    }
    setLoading(false);
  };

  // _______________________________HANDLING CLEARING PROCESS_________________________________________

  const handleClear = async () => {
    await axios.post("/api/doubts/clear");
    await fetchHistory();
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-amber-50">
        <Navbar />

        <h1 className="text-3xl font-bold text-center text-gray-800 mt-3 mb-3">
          ✅ Doubt Solver❓
        </h1>

        {/*_____________________________CHATING AREA HAI YE ________________________________________*/}

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {chatHistory.map((entry, idx) => (
            <div
              key={idx}
              className={`max-w-xl p-3 rounded-lg shadow ${
                entry.role === "user" ?
                  "bg-indigo-100 self-end ml-auto text-right"
                : "bg-green-100 self-start mr-auto"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {entry.role === "user" ? "You" : "SmartSahayak"}
              </p>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(entry.content),
                }}
              />
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/*_______________________________________ Input Area for doubts _______________________________ */}

        <form
          onSubmit={handleAsk}
          className="p-4 bg-orange-100 border-t flex flex-col sm:flex-row gap-2"
        >
          <input
            placeholder="Enter subject ?"
            className="border p-2 rounded w-full sm:w-1/5"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          ></input>

          <input
            type="text"
            className="flex-1 border p-2 rounded"
            placeholder="Kya doubt hai pucho?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-[#4A7C59] hover:bg-green-700 transition-duration-300 hover:scale-102 text-white px-4 py-2 rounded "
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>

          <button
            type="button"
            className="bg-[#BC4749] hover:bg-red-800 hover:scale-102 transition duration-200 text-white px-4 py-2 rounded "
            onClick={handleClear}
          >
            Clear
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
