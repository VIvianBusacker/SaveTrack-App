// Import the necessary Firebase modules from the new SDK
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyB6lpBOc0lfxZX07AaI8SSt6K87xjlr39s",
  authDomain: "savealot-db183.firebaseapp.com",
  projectId: "savealot-db183",
  storageBucket: "savealot-db183.appspot.com",
  messagingSenderId: "872432706076",
  appId: "1:872432706076:web:b1f6873b952c8b5492b5d9",
  measurementId: "G-F73G189VMS",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app); // Initialize Firestore
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Export the initialized services to be used in other parts of your app
export { app, auth, storage, firestore, analytics };

// Sign-in function
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Sign-out function
export const logout = () => {
  return signOut(auth);
};