import { auth, database } from "./firebase.js";
import {
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const applyReason = document.getElementById("applyReason");
const applyBtn = document.getElementById("applyBtn");
const checkApplyBtn = document.getElementById("checkApplyBtn");
const applyResult = document.getElementById("applyResult");

function requireLogin() {
  const user = auth.currentUser;
  if (!user) {
    applyResult.textContent = "먼저 로그인해야 합니다.";
    return null;
  }
  return user;
}

applyBtn.onclick = async () => {
  const user = requireLogin();
  if (!user) return;

  const reason = applyReason.value.trim();
  if (!reason) {
    alert("신청 사유를 입력해주세요.");
    return;
  }

  try {
    const applyRef = ref(database, "applications/" + user.uid);
    await set(applyRef, {
      uid: user.uid,
      email: user.email,
      reason: reason,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    applyResult.textContent = "신청 성공\n회원 신청이 완료되었습니다.\n상태: 대기중 (pending)";
    applyReason.value = "";
  } catch (error) {
    applyResult.textContent = "신청 실패\n" + error.message;
  }
};

checkApplyBtn.onclick = async () => {
  const user = requireLogin();
  if (!user) return;

  try {
    const applyRef = ref(database, "applications/" + user.uid);
    const snapshot = await get(applyRef);
    if (snapshot.exists()) {
      applyResult.textContent = "조회 성공\n" + JSON.stringify(snapshot.val(), null, 2);
    } else {
      applyResult.textContent = "조회 성공\n제출된 신청 내역이 없습니다. 사유를 적고 신청을 먼저 진행하세요.";
    }
  } catch (error) {
    applyResult.textContent = "조회 실패\n" + error.message;
  }
};