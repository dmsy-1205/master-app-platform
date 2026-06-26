import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupBtn = document.getElementById("signupBtn");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const logoutBtn = document.getElementById("logoutBtn");
const userStatus = document.getElementById("userStatus");

signupBtn.addEventListener("click", async () => {
  try {
    const email = signupEmail.value;
    const password = signupPassword.value;

    await createUserWithEmailAndPassword(auth, email, password);

    alert("회원가입 성공");
  } catch (error) {
    alert("회원가입 실패: " + error.message);
  }
});

loginBtn.addEventListener("click", async () => {
  try {
    const email = loginEmail.value;
    const password = loginPassword.value;

    await signInWithEmailAndPassword(auth, email, password);

    alert("로그인 성공");
  } catch (error) {
    alert("로그인 실패: " + error.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("로그아웃 성공");
  } catch (error) {
    alert("로그아웃 실패: " + error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    userStatus.textContent = "로그인 중: " + user.email;
  } else {
    userStatus.textContent = "로그인 안 됨";
  }
});