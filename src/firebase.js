import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBqh7m9W2LoaRH1aqbjhauu903DWCPTSfk",
    authDomain: "chatx-89f5a.firebaseapp.com",
    projectId: "chatx-89f5a",
    storageBucket: "chatx-89f5a.appspot.com",
    messagingSenderId: "99883093067",
    appId: "1:99883093067:web:9c3934020a9d7c2d0291ce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();