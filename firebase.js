import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvTPf5UCzgaB4USvKZ8EyvVJMvO5dqp4A",
  authDomain: "master-app-platform.firebaseapp.com",
  databaseURL: "https://master-app-platform-default-rtdb.firebaseio.com",
  projectId: "master-app-platform",
  storageBucket: "master-app-platform.firebasestorage.app",
  messagingSenderId: "1037858420971",
  appId: "1:1037858420971:web:2782c5e9164e5d98a626ae",
  measurementId: "G-CWK0X4PNZY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };