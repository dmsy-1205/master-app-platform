import { database, auth } from "./firebase.js";
import {
  ref,
  set,
  get,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const writeTestBtn = document.getElementById("writeTestBtn");
const readTestBtn = document.getElementById("readTestBtn");
const deleteTestBtn = document.getElementById("deleteTestBtn");
const dbResult = document.getElementById("dbResult");

function checkLogin() {
  const user = auth.currentUser;
  if (!user) {
    dbResult.textContent = "먼저 로그인해야 합니다.";
    return null;
  }
  return user;
}

writeTestBtn.onclick = async () => {
  const user = checkLogin();
  if (!user) return;
  try {
    const testRef = ref(database, "step2Test/" + user.uid);
    await set(testRef, {
      message: "Hello Master App Platform",
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });
    dbResult.textContent = "쓰기 성공\nFirebase Realtime Database에 테스트 데이터가 저장되었습니다.";
  } catch (error) {
    dbResult.textContent = "쓰기 실패\n" + error.message;
  }
};

readTestBtn.onclick = async () => {
  const user = checkLogin();
  if (!user) return;
  try {
    const testRef = ref(database, "step2Test/" + user.uid);
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      dbResult.textContent = "읽기 성공\n" + JSON.stringify(snapshot.val(), null, 2);
    } else {
      dbResult.textContent = "읽기 성공\n하지만 저장된 데이터가 없습니다. 먼저 쓰기 테스트를 하세요.";
    }
  } catch (error) {
    dbResult.textContent = "읽기 실패\n" + error.message;
  }
};

deleteTestBtn.onclick = async () => {
  const user = checkLogin();
  if (!user) return;
  try {
    const testRef = ref(database, "step2Test/" + user.uid);
    await remove(testRef);
    dbResult.textContent = "삭제 성공\nFirebase Realtime Database에서 테스트 데이터가 삭제되었습니다.";
  } catch (error) {
    dbResult.textContent = "삭제 실패\n" + error.message;
  }
};