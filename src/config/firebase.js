// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth , GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW6yBzmeyZN0nD9T0Z9239pgodfRJiFHs",
  authDomain: "react-auth-248c2.firebaseapp.com",
  projectId: "react-auth-248c2",
  storageBucket: "react-auth-248c2.appspot.com",
  messagingSenderId: "1029004630023",
  appId: "1:1029004630023:web:8a141d393c44f47d9ff2a2",
  measurementId: "G-VTHG1CJR75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export  const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app);
export const db = getFirestore(app)
export const storage = getStorage(app)