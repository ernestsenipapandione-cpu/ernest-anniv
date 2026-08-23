import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCE9nRndAXA2E6_IE6n4PcpQEJqDDg2UbM",
  authDomain: "anniv-ernest.firebaseapp.com",
  projectId: "anniv-ernest",
  storageBucket: "anniv-ernest.firebasestorage.app",
  messagingSenderId: "712964863471",
  appId: "1:712964863471:web:8530745451d46f05eeb21a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);