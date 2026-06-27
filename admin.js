import { db, auth } from './firebase.js';
import { ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const makeAdminBtn = document.getElementById('makeAdminBtn');
const checkAdminBtn = document.getElementById('checkAdminBtn');
const adminResult = document.getElementById('adminResult');
const adminDashboardSection = document.getElementById('adminDashboardSection');
const loadAppsBtn = document.getElementById('loadAppsBtn');
const appsDashboardList = document.getElementById('appsDashboardList');

makeAdminBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert('로그인이 필요합니다.');
  try {
    await set(ref(db, `admins/${user.uid}`), true);
    adminResult.innerText = `현재 계정(${user.email})을 시스템 관리자로 임시 등록 완료!`;
    adminDashboardSection.style.display = 'block';
  } catch (e) { adminResult.innerText = "에러: " + e.message; }
});

checkAdminBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return alert('로그인이 필요합니다.');
  try {
    const snapshot = await get(ref(db, `admins/${user.uid}`));
    if (snapshot.exists() && snapshot.val() === true) {
      adminResult.innerText = "권한 검증 결과: [최고 관리자 권한 확인됨]";
      adminDashboardSection.style.display = 'block';
    } else {
      adminResult.innerText = "권한 검증 결과: [일반 사용자 계정 - 권한 없음]";
      adminDashboardSection.style.display = 'none';
    }
  } catch (e) { adminResult.innerText = "검증 에러: " + e.message; }
});

loadAppsBtn.addEventListener('click', () => {
  const user = auth.currentUser;
  if (!user) return alert('관리자 세션이 만료되었습니다.');

  onValue(ref(db, 'applications'), (snapshot) => {
    appsDashboardList.innerHTML = '';
    const data = snapshot.val();
    if (!data) {
      appsDashboardList.innerHTML = '<p class="placeholder-text">현재 대기 중인 승인 신청 데이터가 존재하지 않습니다.</p>';
      return;
    }

    Object.keys(data).forEach(uid => {
      const item = data[uid];
      const appCard = document.createElement('div');
      appCard.className = 'app-dashboard-card';
      appCard.innerHTML = `
        <div class="app-info">
          <p><strong>신청자 이메일:</strong> ${item.email || '알 수 없음'}</p>
          <p><strong>사유:</strong> ${item.reason || '입력 누락'}</p>
          <p><strong>현재 상태:</strong> <span class="badge status-${item.status}">${item.status}</span></p>
          <p class="small-uid">UID: ${uid}</p>
        </div>
        <div class="app-control-btns">
          <button class="btn-approve" data-uid="${uid}">승인 처리</button>
          <button class="btn-reject" data-uid="${uid}">거절 처리</button>
        </div>`;
      appsDashboardList.appendChild(appCard);
    });

    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', (e) => processApplication(e.target.dataset.uid, 'approved'));
    });
    document.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', (e) => processApplication(e.target.dataset.uid, 'rejected'));
    });
  });
});

async function processApplication(targetUid, statusAction) {
  try {
    const updates = {};
    updates[`applications/${targetUid}/status`] = statusAction;
    updates[`applications/${targetUid}/reviewedAt`] = new Date().toISOString();
    updates[`users/${targetUid}/userStatus`] = statusAction;

    await update(ref(db), updates);
    alert(`정상적으로 해당 유저의 신청 내역을 [${statusAction}] 처리하였습니다.`);
  } catch (error) { alert('상태 제어 처리 오류: ' + error.message); }
}