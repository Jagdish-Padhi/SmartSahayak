import React from "react";
import Navbar from "../components/Navbar";
import robo from "../assets/robo.png";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return (
    <>
      <Navbar />

      {/* INTRO AND TAGLINE */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-16 bg-[#FAF3E0] \ space-y-10 md:space-y-0 rounded-b-3xl shadow-inner">
        <div className="md:w-1/2 space-y-6 animate-fade-in-left">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            😊Namaste! {currentUser.displayName} <br />
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 leading-tight tracking-tight">
            kaise ho? Koi ache se guide nahi kar raha?<br></br>
          </h2>

          <p className="text-gray-700 text-4lg leading-relaxed">
            Ab tum bhi sabki tarah SMART banoge dost, trust me... <br></br>
            <i>
              <b>MAIN HOON NA!🫱🏼‍🫲🏻</b>
            </i>
          </p>
          <div>
            <a
              href="/schedules"
              className="inline-block bg-[#BC4749] text-white px-6 py-3 rounded-xl text-lg font-medium shadow-md hover:bg-red-800 transition duration-300 hover:scale-110"
            >
              Start Kare?
            </a>
          </div>
        </div>

        {/* IMAGE OF ROBOT */}
        <div className="md:w-1/2 animate-fade-in-right w-320px">
          <img
            src={robo}
            alt="SmartSahayak Logo"
            className="h-96 rounded-2xl mr-0 left-0"
          />
        </div>
      </div>

      {/* FEATURES SECTION */}

      <section className="px-6 md:px-10 py-16 bg-[#FAF3E0] ">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features Designed for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up ">
          <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 transform duration-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">
              📅Homework Manager
            </h3>
            <p className="text-gray-600">
              Give each day home work as per timetable and check homework of last time!
            </p>
          </div>

          <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">
              🤖 Doubt Solver
            </h3>
            <p className="text-gray-600">
              Solve doubt of students in friendly Hinglish language to give comfort.
            </p>
          </div>



          <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">
              ✅Life Coach
            </h3>
            <p className="text-gray-600">
              To give emotional support to rural students and motivate to adapt good habits to be successful in life.
            </p>
          </div>

          <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">
              🔊 Bilingual voice reminder
            </h3>
            <p className="text-gray-600">
              GuruBuddy captures your lecture in real-time and generates a
              summary of your explanations.
            </p>
          </div>

          <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">
              💡 AI Powered Smart Helper
            </h3>
            <p className="text-gray-600">
              You can ask any query related to your life and get instant
              intelligent response.
            </p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">
              🌟Project idea expansion ?
            </h3>
            <p className="text-gray-600">
              How this basic product can be expanded with more advanced
              features? Please visit our{" "}
              <a
                href="/future"
                className="text-indigo-900 font-semibold  hover:text-indigo-600 hover:underline"
              >
                Upcoming Features
              </a>{" "}
              section.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
