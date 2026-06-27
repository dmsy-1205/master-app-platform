import { db, auth } from './firebase.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const applyReason = document.getElementById('applyReason');
const applyBtn = document.getElementById('applyBtn');
const checkApplyBtn = document.getElementById('checkApplyBtn');
const applyResult = document.getElementById('applyResult');

applyBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert('신청을 진행하려면 먼저 로그인을 완료해야 합니다.');
  if (!applyReason.value.trim()) return alert('신청 목적 사유를 명확히 기술해주세요.');

  try {
    await set(ref(db, `applications/${user.uid}`), {
      email: user.email,
      reason: applyReason.value,
      status: 'pending',
      submittedAt: new Date().toISOString()
    });
    applyResult.innerText = "플랫폼 이용 승인 신청서가 성공적으로 접수되었습니다. (대기 상태)";
  } catch (e) { applyResult.innerText = "신청서 접수 실패: " + e.message; }
});

checkApplyBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert('로그인 세션 정보가 없습니다.');
  try {
    const snapshot = await get(ref(db, `applications/${user.uid}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      applyResult.innerText = `[실시간 신청 현황 수신 결과]\n\n· 신청 상태: ${data.status.toUpperCase()}\n· 사유 내용: ${data.reason}\n· 처리 일시: ${data.reviewedAt || '심사 대기 중'}`;
    } else { applyResult.innerText = "현재 해당 계정으로 접수된 권한 신청 이력이 전무합니다."; }
  } catch (e) { applyResult.innerText = "조회 중 예외 발생: " + e.message; }
});