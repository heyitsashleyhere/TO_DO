// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjapM8Fwb_fiClLsaDmzyGn_uIygxd3RU",
  authDomain: "todo-list-fe01c.firebaseapp.com",
  databaseURL: "https://todo-list-fe01c-default-rtdb.firebaseio.com",
  projectId: "todo-list-fe01c",
  storageBucket: "todo-list-fe01c.appspot.com",
  messagingSenderId: "205175057806",
  appId: "1:205175057806:web:db7919dc26111ff21208df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();