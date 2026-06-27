import { auth, database } from "./firebase.js";
import {
  ref,
  set,
  get,
  update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const makeAdminBtn = document.getElementById("makeAdminBtn");
const checkAdminBtn = document.getElementById("checkAdminBtn");
const adminResult = document.getElementById("adminResult");

function requireLogin() {
  const user = auth.currentUser;
  if (!user) {
    adminResult.textContent = "먼저 로그인해야 합니다.";
    return null;
  }
  return user;
}

makeAdminBtn.onclick = async () => {
  const user = requireLogin();
  if (!user) return;
  try {
    const userRef = ref(database, "users/" + user.uid);
    const adminRef = ref(database, "admins/" + user.uid);
    await update(userRef, {
      uid: user.uid,
      email: user.email,
      role: "admin",
      status: "active",
      updatedAt: new Date().toISOString()
    });
    await set(adminRef, {
      uid: user.uid,
      email: user.email,
      role: "admin",
      createdAt: new Date().toISOString()
    });
    adminResult.textContent = "관리자 등록 성공\n현재 계정이 테스트용 관리자로 등록되었습니다.\n새로고침하면 로그인 상태에 권한이 admin으로 표시됩니다.";
  } catch (error) {
    adminResult.textContent = "관리자 등록 실패\n" + error.message;
  }
};

checkAdminBtn.onclick = async () => {
  const user = requireLogin();
  if (!user) return;
  try {
    const adminRef = ref(database, "admins/" + user.uid);
    const snapshot = await get(adminRef);
    if (snapshot.exists()) {
      adminResult.textContent = "관리자 확인 성공\n" + JSON.stringify(snapshot.val(), null, 2);
    } else {
      adminResult.textContent = "일반 사용자\n관리자 데이터베이스(admins/)에 존재하지 않습니다.";
    }
  } catch (error) {
    adminResult.textContent = "관리자 확인 실패\n" + error.message;
  }
};