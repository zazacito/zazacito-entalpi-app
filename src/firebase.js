import React, { useState, useEffect, Fragment } from 'react';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDvHpm98oy8dxVPalpC6pU3U4PdxDiHzFs",
  authDomain: "zazacitotechxentalpi.firebaseapp.com",
  projectId: "zazacitotechxentalpi",
  storageBucket: "zazacitotechxentalpi.appspot.com",
  messagingSenderId: "1066287961020",
  appId: "1:1066287961020:web:9dc4072b1676c0aee211b9",
  measurementId: "G-X11N30WJP7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export default app;

