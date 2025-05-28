import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB61yehJ-iEMaLnan9mRU7WsFf-w5GCJKI",
  authDomain: "smartsahayak1.firebaseapp.com",
  projectId: "smartsahayak1",
  storageBucket: "smartsahayak1.firebasestorage.app",
  messagingSenderId: "676964634362",
  appId: "1:676964634362:web:0c9c0531fc53c2d7238343",
  measurementId: "G-NN41HG1C4H",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
