import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const AuthContext = createContext();

//Provider component (ye automatically check karta rhega ki jo page pe aaya hai vo logged in hai ya nahi)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track auth state change on rendering a component

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  //signUp

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  //login

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  //Sign in with Google

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google-sign-in-error", error);
      throw error;
    }
  }

  //logout

  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
