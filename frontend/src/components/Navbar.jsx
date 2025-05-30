import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  //_________________to close dropdwon of logout when clicking outside__________________

  useEffect(() => {
    function handleOutsideClicks(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false); //out clicked
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClicks);
    } else {
      document.removeEventListener("mousedown", handleOutsideClicks);
    }
  }, [dropdownOpen]);

  const profileImg = currentUser?.photoURL || "https://i.pravatar.cc/300";

  return (
    <header className="bg-[#4A7C59] text-[#FAF3E0] shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="text-xl font-bold">
            SmartSahayak
          </Link>

          {/*_____________________For Desktop________________________________________________ */}

          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/home" className="hover:text-yellow-300">
              Home
            </Link>
            <Link to="/schedules" className="hover:text-yellow-300">
              Timetable
            </Link>
            <Link to="/hw" className="block hover:text-yellow-300">
              Homework
            </Link>
            <Link to="/doubt" className="hover:text-yellow-300">
              Doubt Solver
            </Link>
            <Link to="/trainer" className="hover:text-yellow-300">
              Language Trainer
            </Link>

            {currentUser ?
              <div className="relative">
                <img
                  src={profileImg}
                  alt="profile"
                  className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-indigo-500"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-58 bg-white shadow-lg rounded-md overflow-hidden z-10 animate-dropdown">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {currentUser.email}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            : <Link to="/" className="text-indigo-600 hover:underline">
                Login
              </Link>
            }
          </div>

          {/* ______________Mobile Menu Toggle button ____________________*/}

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#FAF3E0] focus:outline-none"
            >
              {menuOpen ?
                <X size={24} />
              : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/*______________________ For Mobiles__________________________________________ */}

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 shadow">
          <Link to="/home" className="block hover:text-yellow-300">
            Home
          </Link>
   
          <Link to="/schedules" className="block hover:text-yellow-300">
            Schedule
          </Link>

          <Link to="/hw" className="block hover:text-yellow-300">
            Homework
          </Link>

          <Link to="/doubt" className="block hover:text-yellow-300">
            Doubt Solver
          </Link>

          {currentUser ?
            <button
              onClick={logout}
              className="block bg-red-600 px-3 py-1 rounded hover:scale-105 hover:bg-red-700"
            >
              Logout
            </button>
          : <Link to="/" className="block text-indigo-600 underline">
              Login
            </Link>
          }
        </div>
      )}
    </header>
  );
}
