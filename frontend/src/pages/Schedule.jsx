import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Msg from "../components/Msg";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SchedulePage() {
  //to show popup
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  //to get UID of user
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  const [schedules, setSchedules] = useState({});
  const [showDay, setShowDay] = useState({});
  const [formData, setFormData] = useState({
    day: "",
    subject: "",
    from: "",
    to: "",
    uid: "",
  });

  // Fetching schedules from backend
  useEffect(() => {
    if (!uid) return;

    fetch(`/api/schedules?uid=${uid}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = {};

        data.forEach((s) => {
          if (!mapped[s.day]) mapped[s.day] = [];
          mapped[s.day].push(s);
        });

        //to sort as per from time

        Object.keys(mapped).forEach((day) => {
          mapped[day].sort((a, b) => a.from.localeCompare(b.from));
        });

        setSchedules(mapped);
      });
  }, [uid]);

  function toggleDay(dayIndex) {
    setShowDay((prev) => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
  }

  // To Delete a schedule by ID
  async function handleDelete(day, id) {
    try {
      await fetch(`/api/schedules/${id}`, { method: "DELETE" });

      const filtered = schedules[day].filter((s) => s._id !== id);
      setSchedules({ ...schedules, [day]: filtered });

      setMsg("✅Schedule deleted successfully!");
      setMsgType("success");
    } catch (error) {
      setMsg("❌Something went wrong!");
      setMsgType("error");
    }
  }

  // Reset timetable
  async function handleReset() {
    if (window.confirm("Are you sure to delete all schedules?")) {
      await fetch(`/api/schedules?uid=${uid}`, { method: "DELETE" });
      setSchedules({});

      setMsg("🚨Whole timetable deleted!");
      setMsgType("warning");
    }
  }

  // Add new schedule
  async function handleAddSchedule(e) {
    try {
      e.preventDefault();

      const formToSend = { ...formData, uid };

      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToSend),
      });

      const saved = await response.json();
      const updated = {
        ...schedules,
        [formData.day]: [...(schedules[formData.day] || []), saved],
      };
      setSchedules(updated);

      setMsg("✅Schedule added successfully!");
      setMsgType("success");

      setFormData({ uid: "", day: "", subject: "", from: "", to: "" });
    } catch (error) {
      setMsg("❌Failed to add schedule. Please try again");
      setMsgType("error");
    }
  }

  return (
    <>
      <Navbar />

      <Msg text={msg} type={msgType} />

      <div className="max-w-5xl mx-auto bg-[#FAF3E0] shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Apna weekly Timetable banao pahle!
        </h1>

        <h2 className="text-2xl  text-center mb-6 text-[gray-600]">
          <i>disciplined rahoge tabhi SMART banoge na....</i>😎
        </h2>

        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="mb-4 border border-green-900 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleDay(index)}
              className="w-full text-left bg-[#9ACD8A] hover:bg-[#c0ffad] px-4 py-2 font-semibold text-gray-800 flex justify-between items-center"
            >
              <span>{day}</span>
              <span>▼</span>
            </button>

            {showDay[index] && (
              <div className="p-4 bg-[#e8ffe1] space-y-3">
                {schedules[day]?.length === 0 || !schedules[day] ?
                  <p className="text-gray-500">No schedules for this day.</p>
                : schedules[day].map((s) => (
                    <div
                      key={s._id}
                      className="bg-white p-3 rounded shadow flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-700">
                          {s.subject}
                        </p>
                        <p className="text-sm text-gray-700">
                          From {s.from} to {s.to}
                        </p>
                      </div>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(day, s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        ))}

        <div className="text-center">
          <button
            className="bg-[#BC4749] hover:bg-red-800 hover:scale-105 text-white px-6 py-2 rounded shadow"
            onClick={handleReset}
          >
            Reset Timetable
          </button>
        </div>

        <form
          onSubmit={handleAddSchedule}
          className="mt-10 bg-[#c0ffad] p-6 rounded-lg shadow space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="day"
              value={formData.day}
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
              required
              className="p-2 rounded border border-green-500"
            >
              <option disabled value="">
                Select Day
              </option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="p-2 rounded border border-green-500"
              required
            />

            <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-800 mb-1">From</label>
                <input
                  type="time"
                  name="from"
                  value={formData.from}
                  onChange={(e) =>
                    setFormData({ ...formData, from: e.target.value })
                  }
                  className="p-2 rounded border border-green-500"
                  required
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-800 mb-1">To</label>
                <input
                  type="time"
                  name="to"
                  value={formData.to}
                  onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                  }
                  className="p-2 rounded border border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#4A7C59] hover:scale-105 hover:bg-[#34563e]  text-white px-6 py-2 rounded shadow"
            >
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
