import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SmartHabitCard = () => {
  const [habit, setHabit] = useState(null);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);

  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  const fetchHabit = (forceNew = false) => {
    const url = forceNew ? "/api/habit/today?new=true" : "/api/habit/today";

    axios.get(url).then((res) => {
      setHabit(res.data);
      setDone(false);
    });
  };

  useEffect(() => {
    fetchHabit();
  }, []);

  const markDone = () => {
    axios.post("/api/habit/mark-done", { uid }).then((res) => {
      setDone(true);
      setStars(res.data.totalStars);
    });
  };

  return (
    <div className="card p-4 rounded-xl shadow-md max-w-md mx-auto mt-10 bg-yellow-50 border">
      <h2 className="text-xl font-bold mb-2">🧠 Aaj se ye zaroor karna....</h2>
      <p className="text-lg mb-4 whitespace-pre-line">
        {habit?.text || "Loading..."}
      </p>

      {!done ?
        <button
          onClick={markDone}
          className="bg-[#4A7C59] text-white px-4 py-2 rounded-xl mr-3  hover:bg-green-900 transition duration-300 hover:scale-105"
        >
          👍 Maine kiya!
        </button>
      : <p className="text-green-700 font-semibold">
          Very Good! Stars: ⭐ {stars}
        </p>
      }

      <button
        onClick={() => fetchHabit(true)}
        className="bg-[#BC4749]  text-white px-4 py-2 rounded-xl mt-2  hover:bg-red-800 transition duration-300 hover:scale-105"
      >
        🔄 New Task
      </button>
    </div>
  );
};

export default SmartHabitCard;
