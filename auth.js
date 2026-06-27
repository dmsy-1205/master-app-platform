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

signupBtn.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
    alert("회원가입 성공");
  } catch (error) {
    alert("회원가입 실패\n" + error.message);
  }
};

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    alert("로그인 성공");
  } catch (error) {
    alert("로그인 실패\n" + error.message);
  }
};

logoutBtn.onclick = async () => {
  try {
    await signOut(auth);
    alert("로그아웃 성공");
  } catch (error) {
    alert("로그아웃 실패\n" + error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    userStatus.textContent = "로그인 중: " + user.email;
  } else {
    userStatus.textContent = "로그인 안됨";
  }
});
