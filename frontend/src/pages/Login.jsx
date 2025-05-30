import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ___________________________ EMAIL LOGIN HANDLER ___________________________________________

  async function handleEmailLogin(evt) {
    evt.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      // Error handling for login
      if (!email || !password) {
        setError("Email OR Password cannot be empty!");
      } else if (email.type !== email) {
        setError("Invalid email or password");
      } else {
        setError("Email not registered!");
      }
    }
  }

  // ____________________________GOOGLE LOGIN HANDLER ______________________________________________

  async function handleGoogleLogin() {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError("Koi baat nahi... Try again!");
    }
  }

  // ___________________________ PAGE KA LAYOUT AND DESIGN ____________________________________

  return (
    <div className="flex justify-center items-center h-screen bg-[#FAF3E0] font-[Poppins]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-[#A3B18A]">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img
            src={logo}
            alt="SmartSahayak Logo"
            className="h-36 rounded-2xl"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-[#4A7C59] mb-6 italic">
          Daro mat, Main hoon na!
        </h2>

        {error && (
          <p className="text-[#BC4749] text-sm text-center mb-3">{error}</p>
        )}

        {/*_______________________________LOGIN FORM_________________________________________________________________________________________________________________ */}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="📧 Email"
            className="w-full p-3 rounded-md border border-[#A3B18A] bg-[#E5E5E5] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒 Password"
            className="w-full p-3 rounded-md border border-[#A3B18A] bg-[#E5E5E5] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            onClick={handleEmailLogin}
            className="w-full bg-[#4A7C59] text-white p-3 rounded-md hover:bg-[#6c9b7d] transition-transform duration-200 hover:scale-[1.02]"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            New user? <i>Direct niche click karo!</i>
          </p>
        </form>

        {/* ________________________________________________SignUp with GOOGLE feature _______________________________________________________________________________________________ */}

        <div className="mt-5 text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-[#BC4749] text-white p-3 rounded-md hover:bg-[#a63c3e] transition-transform duration-200 hover:scale-[1.02]"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
