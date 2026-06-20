import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCKngcsdhj5Tw4cVgdIUnYQrBnnpbhyirE",
  authDomain: "my-project-1eb65.firebaseapp.com",
  projectId: "my-project-1eb65",
  storageBucket: "my-project-1eb65.firebasestorage.app",
  messagingSenderId: "285192811484",
  appId: "1:285192811484:web:d26b42782cfe850d519519",
  measurementId: "G-M3CJ24M7SZ"
};

const app = initializeApp(firebaseConfig);

// 👇 THIS IS WHAT YOU WERE MISSING
export const auth = getAuth(app);

// optional
export const analytics = getAnalytics(app);