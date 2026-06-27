import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const userStatus = document.getElementById('userStatus');
const logoutBtn = document.getElementById('logoutBtn');
const adminDashboardSection = document.getElementById('adminDashboardSection');

signupBtn.addEventListener('click', async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
    await set(ref(db, `users/${userCredential.user.uid}`), {
      email: userCredential.user.email,
      createdAt: new Date().toISOString(),
      userStatus: 'registered' 
    });
    alert('회원가입 성공!');
  } catch (error) { alert('회원가입 실패: ' + error.message); }
});

loginBtn.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    alert('로그인 성공!');
  } catch (error) { alert('로그인 실패: ' + error.message); }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('로그아웃 성공!');
  } catch (error) { alert('로그아웃 실패: ' + error.message); }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userStatus.innerText = `로그인 상태: ${user.email} (${user.uid})`;
    const adminSnap = await get(ref(db, `admins/${user.uid}`));
    adminDashboardSection.style.display = (adminSnap.exists() && adminSnap.val() === true) ? 'block' : 'none';
  } else {
    userStatus.innerText = '로그아웃됨 (인증 세션 없음)';
    adminDashboardSection.style.display = 'none';
  }
});