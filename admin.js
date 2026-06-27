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
// ==========================================
// [STEP 6] 서브 앱 등록 및 메타데이터 UI 제어
// ==========================================
import { registerSubApp, listenSubApps, updateAppStatus } from './database.js';

export function initAdminSubAppManager() {
    const registerForm = document.getElementById('subapp-register-form');
    const appListContainer = document.getElementById('admin-subapp-list');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const appId = document.getElementById('app-id').value.trim();
            const appData = {
                name: document.getElementById('app-name').value.trim(),
                path: document.getElementById('app-path').value.trim(),
                entryUrl: document.getElementById('app-entry').value.trim(),
                icon: document.getElementById('app-icon').value.trim() || '📦',
                description: document.getElementById('app-desc').value.trim(),
                isActive: true
            };

            try {
                await registerSubApp(appId, appData);
                alert(`서브 앱 [${appData.name}] 등록 및 라우팅 메타데이터 동기화 완료`);
                registerForm.reset();
            } catch (error) {
                console.error("서브 앱 등록 실패:", error);
            }
        });
    }

    // 실시간 라우팅 메타데이터 목록 렌더링
    listenSubApps((apps) => {
        if (!appListContainer) return;
        appListContainer.innerHTML = '';

        Object.keys(apps).forEach(appId => {
            const app = apps[appId];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.icon} <strong>${app.name}</strong> (${appId})</td>
                <td><code>${app.path}</code></td>
                <td><small>${app.entryUrl}</small></td>
                <td>
                    <span class="badge ${app.isActive ? 'bg-success' : 'bg-secondary'}">
                        ${app.isActive ? '활성화' : '비활성화'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm ${app.isActive ? 'btn-warning' : 'btn-success'} toggle-status-btn" data-id="${appId}" data-status="${app.isActive}">
                        ${app.isActive ? '비활성화' : '활성화'}
                    </button>
                </td>
            `;
            appListContainer.appendChild(tr);
        });

        // 상태 토글 이벤트 바인딩
        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const currentStatus = e.target.getAttribute('data-status') === 'true';
                updateAppStatus(id, !currentStatus);
            });
        });
    });
}

// 기존 도메인 초기화 로직에 결합 (자동 실행 방지 플래그 유연화)
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('subapp-register-form')) {
        initAdminSubAppManager();
    }
});
