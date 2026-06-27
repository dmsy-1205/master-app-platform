import { db, auth } from './firebase.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const applyReason = document.getElementById('applyReason');
const applyBtn = document.getElementById('applyBtn');
const checkApplyBtn = document.getElementById('checkApplyBtn');
const applyResult = document.getElementById('applyResult');

if (applyBtn) {
  applyBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('신청을 진행하려면 먼저 로그인을 완료해야 합니다.');
    if (!applyReason.value.trim()) return alert('신청 목적 사유를 명확히 기술해주세요.');

    try {
      await set(ref(db, `applications/${user.uid}`), {
        email: user.email,
        reason: applyReason.value.trim(),
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
      if(applyResult) applyResult.innerText = "플랫폼 이용 승인 신청서가 성공적으로 접수되었습니다. (대기 상태)";
    } catch (e) { if(applyResult) applyResult.innerText = "신청서 접수 실패: " + e.message; }
  });
}

if (checkApplyBtn) {
  checkApplyBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인 세션 정보가 없습니다.');
    try {
      const snapshot = await get(ref(db, `applications/${user.uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        if(applyResult) applyResult.innerText = `[실시간 신청 현황 수신 결과]\n\n· 신청 상태: [ ${data.status.toUpperCase()} ]\n· 신청 사유: ${data.reason}\n· 제출 일자: ${data.submittedAt}`;
      } else {
        if(applyResult) applyResult.innerText = "제출된 신청 내역이 존재하지 않습니다.";
      }
    } catch (e) { if(applyResult) applyResult.innerText = "조회 실패: " + e.message; }
  });
}