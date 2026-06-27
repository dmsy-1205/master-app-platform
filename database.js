import { db, auth } from './firebase.js';
import { ref, set, get, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const writeTestBtn = document.getElementById('writeTestBtn');
const readTestBtn = document.getElementById('readTestBtn');
const deleteTestBtn = document.getElementById('deleteTestBtn');
const dbResult = document.getElementById('dbResult');

writeTestBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert('로그인이 필요합니다.');
  try {
    await set(ref(db, `tests/${user.uid}`), { message: "STEP 2 테스트 성공", timestamp: new Date().toISOString() });
    dbResult.innerText = "데이터 쓰기 완료!";
  } catch (e) { dbResult.innerText = "에러: " + e.message; }
});

readTestBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert('로그인이 필요합니다.');
  try {
    const snapshot = await get(ref(db, `tests/${user.uid}`));
    dbResult.innerText = snapshot.exists() ? JSON.stringify(snapshot.val(), null, 2) : "데이터가 없습니다.";
  } catch (e) { dbResult.innerText = "에러: " + e.message; }
});

deleteTestBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert('로그인이 필요합니다.');
  try {
    await remove(ref(db, `tests/${user.uid}`));
    dbResult.innerText = "데이터 삭제 완료!";
  } catch (e) { dbResult.innerText = "에러: " + e.message; }
});