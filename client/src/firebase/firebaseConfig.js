import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockoraKeyForDevOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mockora.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mockora",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mockora.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:mockora",
};

let auth = null;
let googleProvider = null;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.warn("Firebase Auth config fallback:", e.message);
}

export { auth, googleProvider };
