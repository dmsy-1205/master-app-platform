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

function moveByUserStatus(userData) {
  if (!userData) return;

  if (userData.role === "admin") {
    return;
  }

  if (userData.status === "new" || userData.status === "rejected") {
    window.location.href = "./pages/apply.html";
    return;
  }

  if (userData.status === "pending") {
    window.location.href = "./pages/pending.html";
    return;
  }

  if (userData.status === "approved") {
    window.location.href = "./pages/dashboard.html";
    return;
  }
}

if (signupBtn) {
  signupBtn.onclick = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail.value,
        signupPassword.value
      );

      const user = userCredential.user;

      await set(ref(database, "users/" + user.uid), {
        uid: user.uid,
        email: user.email,
        role: "user",
        status: "new",
        createdAt: new Date().toISOString()
      });

      alert("회원가입 성공\n기본 권한은 일반 사용자이며 상태는 new 입니다.");
    } catch (error) {
      alert("회원가입 실패\n" + error.message);
    }
  };
}

if (loginBtn) {
  loginBtn.onclick = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
      alert("로그인 성공\n회원 상태를 확인합니다.");
    } catch (error) {
      alert("로그인 실패\n" + error.message);
    }
  };
}

if (logoutBtn) {
  logoutBtn.onclick = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 성공");
    } catch (error) {
      alert("로그아웃 실패\n" + error.message);
    }
  };
}

onAuthStateChanged(auth, async (user) => {
  try {
    if (!user) {
      if (userStatus) userStatus.textContent = "로그인 안됨";
      return;
    }

    const userRef = ref(database, "users/" + user.uid);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const role = userData.role || "user";
      const status = userData.status || "new";

      if (userStatus) {
        userStatus.textContent =
          "로그인 중: " + user.email + " / 권한: " + role + " / 상태: " + status;
      }

      moveByUserStatus({ ...userData, role, status });
    } else {
      if (userStatus) {
        userStatus.textContent = "로그인 중: " + user.email + " / 사용자 정보 없음";
      }
    }
  } catch (error) {
    if (userStatus) {
      userStatus.textContent = "로그인 상태 확인 실패: " + error.message;
    }
    console.error(error);
  }
});
