import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase 구성 환경 변수 설정 명세
const firebaseConfig = {
    apiKey: "AIzaSyDummyKey_PleaseReplaceWithYourOwn",
    authDomain: "dummy-project-auth.firebaseapp.com",
    databaseURL: "https://dummy-project-default-rtdb.firebaseio.com",
    projectId: "dummy-project",
    storageBucket: "dummy-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:dummyapp123"
};

// 앱 초기화 및 인스턴스 내보내기
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);