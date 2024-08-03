// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAcUfCoqbSOaJGoewzdV-19DTM8IxQKNO0",
    authDomain: "inventory-management-54937.firebaseapp.com",
    projectId: "inventory-management-54937",
    storageBucket: "inventory-management-54937.appspot.com",
    messagingSenderId: "296265251124",
    appId: "1:296265251124:web:8df4f40ef6473db1968d61",
    measurementId: "G-NV7497MG8Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };