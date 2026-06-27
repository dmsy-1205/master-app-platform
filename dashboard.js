import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get, onValue, off, update, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { normalizeActiveStatus } from './database.js';

const dashboardLoginState = document.getElementById('dashboardLoginState');
const dashboardEmail = document.getElementById('dashboardEmail');
const dashboardUid = document.getElementById('dashboardUid');
const dashboardRole = document.getElementById('dashboardRole');
const dashboardApproval = document.getElementById('dashboardApproval');
const dashboardSubmitted = document.getElementById('dashboardSubmitted');
const dashboardReviewed = document.getElementById('dashboardReviewed');
const dashboardApps = document.getElementById('dashboardApps');
const dashboardRefreshBtn = document.getElementById('dashboardRefreshBtn');
const dashboardOpenFirstAppBtn = document.getElementById('dashboardOpenFirstAppBtn');

let appsUnsubscribeRef = null;
let cachedApps = [];
let currentUser = null;
let currentApprovalStatus = 'none';
let currentIsAdmin = false;

function setText(el, value) {
  if (el) el.textContent = value;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function statusLabel(status) {
  const map = {
    registered: '가입 완료',
    pending: '승인 대기',
    approved: '승인 완료',
    rejected: '승인 거절',
    none: '신청 없음'
  };
  return map[status] || status || '확인 불가';
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('ko-KR');
}

function isExternalUrl(url = '') {
  return /^https?:\/\//i.test(url);
}

function resolveLaunchMode(app) {
  if (app.launchMode) return app.launchMode;
  return isExternalUrl(app.entryUrl) ? 'newTab' : 'router';
}

function renderEmptyApps(message) {
  if (!dashboardApps) return;
  dashboardApps.innerHTML = `<div class="dashboard-empty">${escapeHtml(message)}</div>`;
}

function renderApps(apps, approvalStatus) {
  if (!dashboardApps) return;
  cachedApps = apps;
  currentApprovalStatus = approvalStatus;

  if (approvalStatus !== 'approved' && !currentIsAdmin) {
    renderEmptyApps('승인 완료 후 사용 가능한 앱 목록이 표시됩니다. 관리자는 테스트 목적으로 앱 목록을 확인할 수 있습니다.');
    if (dashboardOpenFirstAppBtn) dashboardOpenFirstAppBtn.disabled = true;
    return;
  }

  if (!apps.length) {
    renderEmptyApps('현재 활성화된 서브 애플리케이션이 없습니다. 관리자가 STEP6에서 앱을 등록해야 합니다.');
    if (dashboardOpenFirstAppBtn) dashboardOpenFirstAppBtn.disabled = true;
    return;
  }

  dashboardApps.innerHTML = apps.map(app => {
    const launchMode = resolveLaunchMode(app);
    const runCount = Number(app.runCount || 0);
    const lastRunText = formatDate(app.lastRunAt);
    return `
      <article class="user-app-card step8-app-card">
        <div class="user-app-icon">${escapeHtml(app.icon || '📦')}</div>
        <div class="user-app-body">
          <div class="user-app-headline">
            <h4>${escapeHtml(app.name || '이름 없는 앱')}</h4>
            <span class="user-app-status active">활성</span>
          </div>
          <p>${escapeHtml(app.description || '앱 설명이 등록되지 않았습니다.')}</p>
          <div class="user-app-meta">
            <span>${escapeHtml(app.version || 'version 미등록')}</span>
            <span>${escapeHtml(app.path || '-')}</span>
            <span>${launchMode === 'router' ? '플랫폼 내부 실행' : launchMode === 'sameTab' ? '현재 창 이동' : '새 탭 실행'}</span>
          </div>
          <div class="user-app-run-info">
            <span>실행 ${runCount}회</span>
            <span>최근 실행 ${lastRunText}</span>
          </div>
        </div>
        <button type="button" class="user-app-open launch-app-btn" data-app-id="${escapeHtml(app.id)}">실행</button>
      </article>
    `;
  }).join('');

  if (dashboardOpenFirstAppBtn) dashboardOpenFirstAppBtn.disabled = false;
}

async function recordAppLaunch(app) {
  if (!currentUser || !app?.id) return;

  const launchedAt = new Date().toISOString();
  const currentRunCount = Number(app.runCount || 0);
  const updates = {};
  updates[`apps/${app.id}/runCount`] = currentRunCount + 1;
  updates[`apps/${app.id}/lastRunAt`] = launchedAt;
  updates[`apps/${app.id}/lastRunBy`] = currentUser.uid;
  updates[`users/${currentUser.uid}/lastAppLaunch`] = {
    appId: app.id,
    appName: app.name || '',
    launchedAt
  };

  await update(ref(db), updates);
  await push(ref(db, `appRunLogs/${currentUser.uid}/${app.id}`), {
    appId: app.id,
    appName: app.name || '',
    entryUrl: app.entryUrl || '',
    launchMode: resolveLaunchMode(app),
    launchedAt
  });
}

async function launchApp(app) {
  if (!app) return;
  if (currentApprovalStatus !== 'approved' && !currentIsAdmin) {
    alert('승인 완료 사용자만 앱을 실행할 수 있습니다.');
    return;
  }
  if (!normalizeActiveStatus(app.isActive)) {
    alert('현재 비활성화된 앱입니다.');
    return;
  }
  if (!app.entryUrl && !app.path) {
    alert('앱 진입 URL 또는 라우팅 경로가 등록되지 않았습니다.');
    return;
  }

  try {
    await recordAppLaunch(app);
  } catch (error) {
    console.warn('앱 실행 기록 저장 실패:', error);
  }

  const launchMode = resolveLaunchMode(app);
  if (launchMode === 'newTab') {
    window.open(app.entryUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  if (launchMode === 'sameTab') {
    window.location.href = app.entryUrl;
    return;
  }
  window.location.hash = app.path || '/';
}

async function loadUserDashboard(user) {
  if (!user) {
    setText(dashboardLoginState, '로그인 후 사용자 Dashboard를 사용할 수 있습니다.');
    setText(dashboardEmail, '-');
    setText(dashboardUid, '-');
    setText(dashboardRole, '-');
    setText(dashboardApproval, '-');
    setText(dashboardSubmitted, '-');
    setText(dashboardReviewed, '-');
    currentApprovalStatus = 'none';
    currentIsAdmin = false;
    renderEmptyApps('로그인이 필요합니다.');
    if (dashboardOpenFirstAppBtn) dashboardOpenFirstAppBtn.disabled = true;
    return;
  }

  setText(dashboardLoginState, '로그인 확인 완료');
  setText(dashboardEmail, user.email || '-');
  setText(dashboardUid, user.uid || '-');

  try {
    const [adminSnap, userSnap, applicationSnap] = await Promise.all([
      get(ref(db, `admins/${user.uid}`)),
      get(ref(db, `users/${user.uid}`)),
      get(ref(db, `applications/${user.uid}`))
    ]);

    const userData = userSnap.exists() ? userSnap.val() : {};
    const isAdmin = (adminSnap.exists() && adminSnap.val() === true) || userData.role === 'admin';
    currentIsAdmin = isAdmin;
    const applicationData = applicationSnap.exists() ? applicationSnap.val() : null;
    const approvalStatus = applicationData?.status || userData.userStatus || 'none';
    currentApprovalStatus = approvalStatus;

    setText(dashboardRole, isAdmin ? '관리자' : '일반 사용자');
    setText(dashboardApproval, statusLabel(approvalStatus));
    setText(dashboardSubmitted, formatDate(applicationData?.submittedAt));
    setText(dashboardReviewed, applicationData?.reviewedAt ? formatDate(applicationData.reviewedAt) : '심사 대기 또는 미처리');

    if (appsUnsubscribeRef) off(appsUnsubscribeRef);
    appsUnsubscribeRef = ref(db, 'apps');
    onValue(appsUnsubscribeRef, (snapshot) => {
      const appsData = snapshot.val() || {};
      const activeApps = Object.keys(appsData)
        .map(appId => ({ id: appId, ...appsData[appId] }))
        .filter(app => normalizeActiveStatus(app.isActive))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      renderApps(activeApps, approvalStatus);
    });
  } catch (error) {
    setText(dashboardLoginState, 'Dashboard 데이터를 불러오는 중 오류가 발생했습니다.');
    renderEmptyApps(`오류: ${error.message}`);
  }
}

if (dashboardRefreshBtn) {
  dashboardRefreshBtn.addEventListener('click', () => loadUserDashboard(currentUser));
}

if (dashboardOpenFirstAppBtn) {
  dashboardOpenFirstAppBtn.addEventListener('click', () => {
    if (!cachedApps.length) return;
    launchApp(cachedApps[0]);
  });
}

if (dashboardApps) {
  dashboardApps.addEventListener('click', (event) => {
    const button = event.target.closest('.launch-app-btn');
    if (!button) return;
    const app = cachedApps.find(item => item.id === button.dataset.appId);
    launchApp(app);
  });
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  loadUserDashboard(user);
});
