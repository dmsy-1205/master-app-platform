import { db, auth } from './firebase.js';
import { ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { registerSubApp, listenSubApps, updateAppStatus, normalizeActiveStatus, deleteSubApp } from './database.js';

const makeAdminBtn = document.getElementById('makeAdminBtn');
const checkAdminBtn = document.getElementById('checkAdminBtn');
const adminResult = document.getElementById('adminResult');
const adminDashboardSection = document.getElementById('adminDashboardSection');
const loadAppsBtn = document.getElementById('loadAppsBtn');
const appsDashboardList = document.getElementById('appsDashboardList');

if (makeAdminBtn) {
  makeAdminBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인이 필요합니다.');
    try {
      await set(ref(db, `admins/${user.uid}`), true);
      await update(ref(db, `users/${user.uid}`), { role: 'admin', updatedAt: new Date().toISOString() });
      adminResult.innerText = `현재 계정(${user.email})을 시스템 관리자로 등록 완료! 로그아웃 후 재로그인해도 관리자 권한이 유지됩니다.`;
      document.querySelectorAll('[data-auth="admin"]').forEach(el => { el.style.display = ''; });
      if (adminDashboardSection) adminDashboardSection.style.display = '';
      window.dispatchEvent(new CustomEvent('master-auth-role-refresh-request'));
    } catch (e) { adminResult.innerText = "에러: " + e.message; }
  });
}

if (checkAdminBtn) {
  checkAdminBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인이 필요합니다.');
    try {
      const [adminSnap, userSnap] = await Promise.all([
        get(ref(db, `admins/${user.uid}`)),
        get(ref(db, `users/${user.uid}`))
      ]);
      const userData = userSnap.exists() ? userSnap.val() : {};
      const isAdmin = (adminSnap.exists() && adminSnap.val() === true) || userData.role === 'admin';
      if (isAdmin) {
        adminResult.innerText = "권한 검증 결과: [최고 관리자 권한 확인됨]";
        document.querySelectorAll('[data-auth="admin"]').forEach(el => { el.style.display = ''; });
        if (adminDashboardSection) adminDashboardSection.style.display = '';
      } else {
        adminResult.innerText = "권한 검증 결과: [일반 사용자 계정 - 권한 없음]";
        document.querySelectorAll('[data-auth="admin"]').forEach(el => { el.style.display = 'none'; });
        if (adminDashboardSection) adminDashboardSection.style.display = 'none';
      }
    } catch (e) { adminResult.innerText = "검증 에러: " + e.message; }
  });
}

if (loadAppsBtn) {
  loadAppsBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user) return alert('관리자 세션이 만료되었습니다.');

    onValue(ref(db, 'applications'), (snapshot) => {
      if (!appsDashboardList) return;
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
}

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
export function initAdminSubAppManager() {
    const registerForm = document.getElementById('subapp-register-form');
    const appListContainer = document.getElementById('admin-subapp-list');
    const fillFinancePresetBtn = document.getElementById('fillFinancePresetBtn');
    const fillExternalPresetBtn = document.getElementById('fillExternalPresetBtn');
    const appNameInput = document.getElementById('app-name');
    const appIdInput = document.getElementById('app-id');
    const appPathInput = document.getElementById('app-path');
    const appEntryInput = document.getElementById('app-entry');
    const appIconInput = document.getElementById('app-icon');
    const appVersionInput = document.getElementById('app-version');
    const appLaunchModeInput = document.getElementById('app-launch-mode');
    const appDescInput = document.getElementById('app-desc');
    const appRegisterPreview = document.getElementById('appRegisterPreview');

    function slugifyAppName(value = '') {
        const cleaned = value.toLowerCase().trim()
            .replace(/[^a-z0-9가-힣\s-]/g, '')
            .replace(/[가-힣]+/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return cleaned || 'my-app';
    }

    function updateRegisterPreview() {
        if (!appRegisterPreview) return;
        const id = appIdInput?.value.trim() || 'app-id';
        const name = appNameInput?.value.trim() || '앱 이름';
        const path = appPathInput?.value.trim() || '/app-path';
        const entry = appEntryInput?.value.trim() || './apps/app.html';
        const mode = appLaunchModeInput?.value || 'router';
        appRegisterPreview.innerHTML = `미리보기: <strong>${name}</strong> / ID <code>${id}</code> / 경로 <code>${path}</code> / Entry <code>${entry}</code> / 실행방식 <strong>${mode}</strong>`;
    }

    function fillPreset(data) {
        if (appIdInput) appIdInput.value = data.id;
        if (appNameInput) appNameInput.value = data.name;
        if (appPathInput) appPathInput.value = data.path;
        if (appEntryInput) appEntryInput.value = data.entry;
        if (appIconInput) appIconInput.value = data.icon;
        if (appVersionInput) appVersionInput.value = data.version;
        if (appLaunchModeInput) appLaunchModeInput.value = data.launchMode;
        if (appDescInput) appDescInput.value = data.description;
        updateRegisterPreview();
    }

    if (fillFinancePresetBtn && !fillFinancePresetBtn.dataset.bound) {
        fillFinancePresetBtn.dataset.bound = 'true';
        fillFinancePresetBtn.addEventListener('click', () => fillPreset({
            id: 'finance-app',
            name: '자금 관리 앱',
            path: '/finance',
            entry: './apps/finance.html',
            icon: '💰',
            version: 'v1.0',
            launchMode: 'router',
            description: '수입 지출 손익을 확인하는 자금 관리 서브 앱'
        }));
    }

    if (fillExternalPresetBtn && !fillExternalPresetBtn.dataset.bound) {
        fillExternalPresetBtn.dataset.bound = 'true';
        fillExternalPresetBtn.addEventListener('click', () => fillPreset({
            id: 'external-tool',
            name: '외부 업무 도구',
            path: '/external-tool',
            entry: 'https://example.com',
            icon: '🌐',
            version: 'v1.0',
            launchMode: 'newTab',
            description: '외부 웹 서비스를 새 탭으로 연결하는 앱'
        }));
    }

    [appNameInput, appIdInput, appPathInput, appEntryInput, appIconInput, appVersionInput, appLaunchModeInput, appDescInput].forEach(input => {
        if (!input || input.dataset.previewBound) return;
        input.dataset.previewBound = 'true';
        input.addEventListener('input', () => {
            if (input === appNameInput) {
                const slug = slugifyAppName(appNameInput.value);
                if (appIdInput && !appIdInput.value.trim()) appIdInput.value = slug;
                if (appPathInput && !appPathInput.value.trim()) appPathInput.value = `/${slug}`;
            }
            updateRegisterPreview();
        });
    });
    updateRegisterPreview();

    if (appListContainer && !appListContainer.dataset.toggleBound) {
        appListContainer.dataset.toggleBound = 'true';
        appListContainer.addEventListener('click', async (e) => {
            const toggleTarget = e.target.closest('.toggle-status-btn');
            const deleteTarget = e.target.closest('.delete-app-btn');

            if (deleteTarget) {
                const id = deleteTarget.dataset.id;
                const name = deleteTarget.dataset.name || id;
                const confirmed = confirm(`[${name}] 앱을 삭제하시겠습니까?\n\n삭제하면 App Store와 라우팅 테이블에서 제거됩니다.`);
                if (!confirmed) return;

                deleteTarget.disabled = true;
                deleteTarget.textContent = '삭제 중...';

                try {
                    await deleteSubApp(id);
                    alert(`[${name}] 앱 삭제 완료`);
                } catch (error) {
                    console.error('서브 앱 삭제 실패:', error);
                    alert('앱 삭제 처리 오류: ' + error.message);
                    deleteTarget.disabled = false;
                    deleteTarget.textContent = '삭제';
                }
                return;
            }

            if (!toggleTarget) return;

            const id = toggleTarget.dataset.id;
            const currentStatus = toggleTarget.dataset.status === 'true';
            toggleTarget.disabled = true;
            toggleTarget.textContent = '처리 중...';

            try {
                await updateAppStatus(id, !currentStatus);
                console.log(`서브 앱 상태 변경 완료: ${id} -> ${!currentStatus}`);
            } catch (error) {
                console.error('서브 앱 상태 변경 실패:', error);
                alert('활성화/비활성화 처리 오류: ' + error.message);
                toggleTarget.disabled = false;
                toggleTarget.textContent = currentStatus ? '비활성화' : '활성화';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const appId = document.getElementById('app-id').value.trim();
            const entryUrl = document.getElementById('app-entry').value.trim();
            const appPath = document.getElementById('app-path').value.trim();
            if (!/^[a-z0-9-]+$/.test(appId)) {
                alert('앱 ID는 영문 소문자 숫자 하이픈만 사용하는 것을 권장합니다. 예: finance-app');
                return;
            }
            if (!appPath.startsWith('/')) {
                alert('라우팅 경로는 / 로 시작해야 합니다. 예: /finance');
                return;
            }
            if (!entryUrl.startsWith('./') && !entryUrl.startsWith('/') && !/^https?:\/\//i.test(entryUrl)) {
                alert('Entry URL은 ./apps/app.html 또는 https://주소 형식으로 입력하세요.');
                return;
            }
            const appData = {
                name: document.getElementById('app-name').value.trim(),
                path: appPath,
                entryUrl: entryUrl,
                icon: document.getElementById('app-icon').value.trim() || '📦',
                version: document.getElementById('app-version')?.value.trim() || 'v1.0',
                launchMode: document.getElementById('app-launch-mode')?.value || 'router',
                description: document.getElementById('app-desc').value.trim(),
                runCount: 0,
                lastRunAt: '',
                isActive: true
            };

            try {
                await registerSubApp(appId, appData);
                alert(`서브 앱 [${appData.name}] 등록 및 라우팅 메타데이터 동기화 완료`);
                registerForm.reset();
                updateRegisterPreview();
            } catch (error) {
                console.error("서브 앱 등록 실패:", error);
                alert("등록 실패: " + error.message);
            }
        });
    }

    // 실시간 라우팅 메타데이터 목록 렌더링
    listenSubApps((apps) => {
        if (!appListContainer) return;
        appListContainer.innerHTML = '';

        const keys = Object.keys(apps);
        if (keys.length === 0) {
            appListContainer.innerHTML = '<tr><td colspan="6" class="text-center text-muted">등록된 서브 애플리케이션이 없습니다.</td></tr>';
            return;
        }

        keys.forEach(appId => {
            const app = apps[appId];
            const isActive = normalizeActiveStatus(app.isActive);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.icon || '📦'} <strong>${app.name || '이름 없음'}</strong> (${appId})</td>
                <td><code>${app.path || '-'}</code></td>
                <td><small>${app.entryUrl || '-'}</small><br><span class="text-muted">${app.version || 'v1.0'} · ${app.launchMode || 'router'}</span></td>
                <td>
                    <span class="badge ${isActive ? 'bg-success' : 'bg-secondary'}">
                        ${isActive ? '활성화' : '비활성화'}
                    </span>
                </td>
                <td>
                    <div class="admin-row-actions">
                        <button type="button" class="btn btn-sm ${isActive ? 'btn-warning' : 'btn-success'} toggle-status-btn" data-id="${appId}" data-status="${isActive}">
                            ${isActive ? '비활성화' : '활성화'}
                        </button>
                        <button type="button" class="btn btn-sm btn-danger delete-app-btn" data-id="${appId}" data-name="${(app.name || appId).replace(/"/g, '&quot;')}">
                            삭제
                        </button>
                    </div>
                </td>
            `;
            appListContainer.appendChild(tr);
        });
    });
}

// DOM 준비 완료 시 구동
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('subapp-register-form')) {
        initAdminSubAppManager();
    }
});