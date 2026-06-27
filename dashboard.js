import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

function setText(el, value) {
  if (el) el.textContent = value;
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

function renderEmptyApps(message) {
  if (!dashboardApps) return;
  dashboardApps.innerHTML = `<div class="dashboard-empty">${message}</div>`;
}

function renderApps(apps, approvalStatus) {
  if (!dashboardApps) return;
  cachedApps = apps;

  if (approvalStatus !== 'approved') {
    renderEmptyApps('승인 완료 후 사용 가능한 앱 목록이 표시됩니다.');
    if (dashboardOpenFirstAppBtn) dashboardOpenFirstAppBtn.disabled = true;
    return;
  }

  if (!apps.length) {
    renderEmptyApps('현재 활성화된 서브 애플리케이션이 없습니다. 관리자가 STEP6에서 앱을 등록해야 합니다.');
    if (dashboardOpenFirstAppBtn) dashboardOpenFirstAppBtn.disabled = true;
    return;
  }

  dashboardApps.innerHTML = apps.map(app => `
    <article class="user-app-card">
      <div class="user-app-icon">${app.icon || '📦'}</div>
      <div class="user-app-body">
        <h4>${app.name || '이름 없는 앱'}</h4>
        <p>${app.description || '앱 설명이 등록되지 않았습니다.'}</p>
        <span class="user-app-path">${app.path}</span>
      </div>
      <a class="user-app-open" href="#${app.path}">실행</a>
    </article>
  `).join('');

  if (dashboardOpenFirstAppBtn) dashboardOpenFirstAppBtn.disabled = false;
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

    const isAdmin = adminSnap.exists() && adminSnap.val() === true;
    const userData = userSnap.exists() ? userSnap.val() : {};
    const applicationData = applicationSnap.exists() ? applicationSnap.val() : null;
    const approvalStatus = applicationData?.status || userData.userStatus || 'none';

    setText(dashboardRole, isAdmin ? '관리자' : '일반 사용자');
    setText(dashboardApproval, statusLabel(approvalStatus));
    setText(dashboardSubmitted, applicationData?.submittedAt ? new Date(applicationData.submittedAt).toLocaleString('ko-KR') : '-');
    setText(dashboardReviewed, applicationData?.reviewedAt ? new Date(applicationData.reviewedAt).toLocaleString('ko-KR') : '심사 대기 또는 미처리');

    if (appsUnsubscribeRef) off(appsUnsubscribeRef);
    appsUnsubscribeRef = ref(db, 'apps');
    onValue(appsUnsubscribeRef, (snapshot) => {
      const appsData = snapshot.val() || {};
      const activeApps = Object.keys(appsData)
        .map(appId => ({ id: appId, ...appsData[appId] }))
        .filter(app => app.isActive === true)
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
    window.location.hash = cachedApps[0].path;
  });
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  loadUserDashboard(user);
});
