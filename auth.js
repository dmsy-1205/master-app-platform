import { auth, database } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
    const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
    const user = userCredential.user;
    await set(ref(database, "users/" + user.uid), {
      uid: user.uid,
      email: user.email,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString()
    });
    alert("회원가입 성공\n기본 권한은 일반 사용자입니다.");
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

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    userStatus.textContent = "로그인 안됨";
    return;
  }
  try {
    const userRef = ref(database, "users/" + user.uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      userStatus.textContent = `로그인됨: ${data.email} (권한: ${data.role || "user"})`;
    } else {
      userStatus.textContent = `로그인됨: ${user.email} (DB 정보 없음)`;
    }
  } catch (error) {
    userStatus.textContent = `로그인됨: ${user.email} (권한 확인 실패)`;
  }
});