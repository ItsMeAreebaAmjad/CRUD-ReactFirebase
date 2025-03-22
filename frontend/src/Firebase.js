// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaP-1J8qVhyDtaZ2mibtDaIplS1eCbWC0",
  authDomain: "fir-crud-e5442.firebaseapp.com",
  projectId: "fir-crud-e5442",
  storageBucket: "fir-crud-e5442.firebasestorage.app",
  messagingSenderId: "810142167997",
  appId: "1:810142167997:web:3bc80b4de5a1f0aa6fd8d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);