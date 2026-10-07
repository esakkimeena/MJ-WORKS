// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

// Firebase Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

// Cloud Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDdjZMc4k5NxqHjwXRyHwTl_VvAVlGgGoM",
    authDomain: "mj-works-admin.firebaseapp.com",
    projectId: "mj-works-admin",
    storageBucket: "mj-works-admin.firebasestorage.app",
    messagingSenderId: "15335454563",
    appId: "1:15335454563:web:e6cee9b60124272fd58556"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };