import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAaEj6IBGByUCsXmuh1VkXovLW239V5ldc",
    authDomain: "dental-clinic-9e276.firebaseapp.com",
    projectId: "dental-clinic-9e276",
    storageBucket: "dental-clinic-9e276.firebasestorage.app",
    messagingSenderId: "600677140247",
    appId: "1:600677140247:web:d36aa9812bdb5689c35952",
    measurementId: "G-5VGDBDDMZC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);