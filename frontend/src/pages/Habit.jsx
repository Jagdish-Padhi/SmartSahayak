import HabitCard from "../components/HabitCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Habit() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-center">
        <h1 className="text-3xl font-bold mt-4">Good Habits Builder</h1>
        <HabitCard />
      </div>
      <Footer />
    </>
  );
}

export default Habit;
