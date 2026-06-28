import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get, set, onValue, off, update, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { normalizeActiveStatus } from './database.js';
import { buildAppManifest, checkAppPermission, createLaunchToken, recordSecureExecution } from './security.js';

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
const dashboardQuickLaunchBtn = document.getElementById('dashboardQuickLaunchBtn');
const storeFeaturedLaunchBtn = document.getElementById('storeFeaturedLaunchBtn');
const userTotalApps = document.getElementById('userTotalApps');
const userTotalRuns = document.getElementById('userTotalRuns');
const userRecentApp = document.getElementById('userRecentApp');
const userApprovalCard = document.getElementById('userApprovalCard');
const globalSearchInput = document.getElementById('globalSearchInput');
const storeSearchInput = document.getElementById('storeSearchInput');
const notificationToggleBtn = document.getElementById('notificationToggleBtn');
const notificationBadge = document.getElementById('notificationBadge');
const notificationPanel = document.getElementById('notificationPanel');
const notificationList = document.getElementById('notificationList');
const dashboardNotificationList = document.getElementById('dashboardNotificationList');
const profileToggleBtn = document.getElementById('profileToggleBtn');
const profilePanel = document.getElementById('profilePanel');
const profileInitial = document.getElementById('profileInitial');
const profileEmailText = document.getElementById('profileEmailText');
const profileRoleText = document.getElementById('profileRoleText');
const recentActivityList = document.getElementById('recentActivityList');
const fullActivityList = document.getElementById('fullActivityList');
const activityRefreshBtn = document.getElementById('activityRefreshBtn');
const favoriteCountWidget = document.getElementById('favoriteCountWidget');
const favoriteWidgetBody = document.getElementById('favoriteWidgetBody');
const applyReason = document.getElementById('applyReason');

let appsUnsubscribeRef = null;
let cachedApps = [];
let currentUser = null;
let currentApprovalStatus = 'none';
let currentIsAdmin = false;
let searchKeyword = '';
let favoriteIds = new Set();
let cachedActivities = [];

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


function favoriteStorageKey() {
  return currentUser ? `masterAppFavorites:${currentUser.uid}` : 'masterAppFavorites:guest';
}

async function loadFavorites() {
  try {
    if (currentUser) {
      const snap = await get(ref(db, `userFavorites/${currentUser.uid}`));
      const raw = snap.val() || {};
      favoriteIds = new Set(Object.keys(raw).filter(appId => raw[appId] === true || raw[appId]?.active === true));
      localStorage.setItem(favoriteStorageKey(), JSON.stringify([...favoriteIds]));
      return;
    }
    favoriteIds = new Set(JSON.parse(localStorage.getItem(favoriteStorageKey()) || '[]'));
  } catch {
    try {
      favoriteIds = new Set(JSON.parse(localStorage.getItem(favoriteStorageKey()) || '[]'));
    } catch {
      favoriteIds = new Set();
    }
  }
}

function saveFavorites() {
  localStorage.setItem(favoriteStorageKey(), JSON.stringify([...favoriteIds]));
}

async function syncFavorite(appId, enabled) {
  if (!currentUser || !appId) return;
  const updates = {};
  updates[`userFavorites/${currentUser.uid}/${appId}`] = enabled ? true : null;
  updates[`users/${currentUser.uid}/favoriteApps/${appId}`] = enabled ? true : null;
  updates[`users/${currentUser.uid}/favoriteUpdatedAt`] = new Date().toISOString();
  await update(ref(db), updates);
}

function updateFavoriteCount() {
  setText(favoriteCountWidget, `${favoriteIds.size}개`);
}

function renderFavoriteWidget(apps = cachedApps) {
  if (!favoriteWidgetBody) return;
  const favorites = apps.filter(app => favoriteIds.has(app.id));
  if (!favorites.length) {
    favoriteWidgetBody.innerHTML = '<p>즐겨찾기한 앱이 아직 없습니다.</p><span class="widget-badge">아직 없음</span>';
    return;
  }
  favoriteWidgetBody.innerHTML = favorites.slice(0, 3).map(app => `
    <div class="favorite-widget-app">
      <span>${escapeHtml(app.icon || '📦')}</span>
      <div><strong>${escapeHtml(app.name || '이름 없는 앱')}</strong><small>${escapeHtml(app.path || '-')}</small></div>
      <button type="button" class="favorite-widget-launch" data-app-id="${escapeHtml(app.id)}">실행</button>
    </div>
  `).join('') + (favorites.length > 3 ? `<small class="favorite-more">외 ${favorites.length - 3}개 더 있음</small>` : '');
}

function buildNotifications(apps = [], approvalStatus = 'none') {
  const notices = [];
  notices.push({ icon: '✅', title: `승인 상태 ${statusLabel(approvalStatus)}`, text: approvalStatus === 'approved' ? '현재 플랫폼 앱 실행이 가능합니다.' : '승인 완료 후 앱 실행 권한이 열립니다.' });
  notices.push({ icon: '📦', title: `사용 가능 앱 ${apps.length}개`, text: apps.length ? 'App Store에서 앱을 실행할 수 있습니다.' : '관리자가 앱을 등록하면 이곳에 표시됩니다.' });
  if (favoriteIds.size) notices.push({ icon: '⭐', title: `즐겨찾기 ${favoriteIds.size}개`, text: '자주 쓰는 앱을 빠르게 찾을 수 있습니다.' });
  return notices;
}

function renderNotifications(apps = cachedApps, approvalStatus = currentApprovalStatus) {
  const notices = buildNotifications(apps, approvalStatus);
  if (notificationBadge) notificationBadge.textContent = String(notices.length);
  const html = notices.map(item => `<article class="notice-item"><span>${item.icon}</span><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)}</small></div></article>`).join('');
  if (notificationList) notificationList.innerHTML = html;
  if (dashboardNotificationList) dashboardNotificationList.innerHTML = html;
}

function filterApps(apps = []) {
  const keyword = searchKeyword.trim().toLowerCase();
  if (!keyword) return apps;
  return apps.filter(app => [app.name, app.description, app.version, app.path, app.id].join(' ').toLowerCase().includes(keyword));
}

function renderActivityList(target, activities = cachedActivities, compact = false) {
  if (!target) return;
  if (!activities.length) {
    target.innerHTML = '<p class="empty-line">아직 실행 기록이 없습니다.</p>';
    return;
  }
  const limited = compact ? activities.slice(0, 4) : activities;
  target.innerHTML = limited.map(item => `
    <article class="activity-item">
      <span class="activity-dot"></span>
      <div><strong>${escapeHtml(item.appName || '이름 없는 앱')}</strong><small>${formatDate(item.launchedAt)} · ${escapeHtml(item.launchMode || 'router')}</small></div>
    </article>
  `).join('');
}

async function loadActivityLogs() {
  if (!currentUser) {
    cachedActivities = [];
    renderActivityList(recentActivityList, [], true);
    renderActivityList(fullActivityList, [], false);
    return;
  }
  try {
    const snap = await get(ref(db, `appRunLogs/${currentUser.uid}`));
    const raw = snap.val() || {};
    const list = [];
    Object.values(raw).forEach(group => {
      Object.values(group || {}).forEach(item => list.push(item));
    });
    cachedActivities = list.sort((a, b) => new Date(b.launchedAt || 0) - new Date(a.launchedAt || 0));
    renderActivityList(recentActivityList, cachedActivities, true);
    renderActivityList(fullActivityList, cachedActivities, false);
  } catch (error) {
    const message = `<p class="empty-line">활동 로그 오류: ${escapeHtml(error.message)}</p>`;
    if (recentActivityList) recentActivityList.innerHTML = message;
    if (fullActivityList) fullActivityList.innerHTML = message;
  }
}

function renderEmptyApps(message) {
  if (!dashboardApps) return;
  dashboardApps.innerHTML = `<div class="dashboard-empty">${escapeHtml(message)}</div>`;
}

function updateUserStats(apps = [], approvalStatus = 'none') {
  const totalRuns = apps.reduce((sum, app) => sum + Number(app.runCount || 0), 0);
  const recent = apps
    .filter(app => app.lastRunAt)
    .sort((a, b) => new Date(b.lastRunAt) - new Date(a.lastRunAt))[0];

  setText(userTotalApps, String(apps.length));
  setText(userTotalRuns, String(totalRuns));
  setText(userRecentApp, recent?.name || '-');
  setText(userApprovalCard, statusLabel(approvalStatus));
}

function setLaunchButtonsEnabled(enabled) {
  [dashboardOpenFirstAppBtn, dashboardQuickLaunchBtn, storeFeaturedLaunchBtn].forEach((button) => {
    if (button) button.disabled = !enabled;
  });
}

function getPrimaryApp() {
  if (!cachedApps.length) return null;
  return cachedApps.find(app => String(app.id || '').includes('baby-care'))
    || cachedApps.find(app => String(app.name || '').includes('생활관리'))
    || cachedApps[0];
}

function moveToRuntime() {
  if (window.MasterWorkspace?.showRoute) {
    window.MasterWorkspace.showRoute('runtime');
  }
}


function canLaunchFromStore(app, approvalStatus = currentApprovalStatus) {
  if (currentIsAdmin) return true;
  if (!normalizeActiveStatus(app?.isActive)) return false;
  const mode = app.permissionMode || 'approved';
  if (mode === 'public') return true;
  if ((mode === 'approved' || mode === 'official') && approvalStatus === 'approved') return true;
  if (app.allowedUsers?.[currentUser?.uid] === true || app.allowedUsers?.[currentUser?.uid]?.active === true) return true;
  return false;
}

function moveToRequest(app) {
  const appName = app?.name || '선택한 앱';
  if (applyReason) {
    applyReason.value = `${appName} 사용 신청`;
    applyReason.dataset.requestAppId = app?.id || '';
    applyReason.dataset.requestAppName = appName;
  }
  if (window.MasterWorkspace?.showRoute) window.MasterWorkspace.showRoute('request');
  const result = document.getElementById('applyResult');
  if (result) result.innerText = `${appName} 사용 신청 사유를 확인한 뒤 신청하기를 누르세요.`;
}

function renderApps(apps, approvalStatus) {
  if (!dashboardApps) return;
  cachedApps = apps;
  currentApprovalStatus = approvalStatus;
  updateUserStats(apps, approvalStatus);
  updateFavoriteCount();
  renderFavoriteWidget(apps);
  renderNotifications(apps, approvalStatus);
  const visibleApps = filterApps(apps);


  if (!apps.length) {
    renderEmptyApps('현재 활성화된 서브 애플리케이션이 없습니다. 관리자가 STEP6에서 앱을 등록해야 합니다.');
    setLaunchButtonsEnabled(false);
    return;
  }

  if (!visibleApps.length) {
    renderEmptyApps('검색 결과에 맞는 앱이 없습니다.');
    setLaunchButtonsEnabled(false);
    return;
  }

  dashboardApps.innerHTML = visibleApps.map(app => {
    const launchMode = resolveLaunchMode(app);
    const runCount = Number(app.runCount || 0);
    const lastRunText = formatDate(app.lastRunAt);
    const canLaunch = canLaunchFromStore(app, approvalStatus);
    const actionLabel = canLaunch ? '실행' : '사용 신청';
    const actionClass = canLaunch ? 'launch-app-btn' : 'request-app-btn';
    return `
      <article class="user-app-card step8-app-card app-card-v2">
        <div class="app-card-visual"><div class="user-app-icon">${escapeHtml(app.icon || '📦')}</div><span class="app-glow-dot"></span></div>
        <div class="user-app-body">
          <div class="user-app-headline">
            <h4>${escapeHtml(app.name || '이름 없는 앱')}</h4>
            <span class="user-app-status active">활성</span>
          </div>
          <p>${escapeHtml(app.description || '앱 설명이 등록되지 않았습니다.')}</p>
          <div class="user-app-meta">
            <span>${escapeHtml(app.version || 'version 미등록')}</span>
            <span>${app.official === true ? '✅ Platform Verified' : 'General App'}</span>
            <span>${escapeHtml(app.category || 'General')}</span>
            <span>${escapeHtml(app.path || '-')}</span>
            <span>${launchMode === 'router' ? '플랫폼 내부 실행' : launchMode === 'sameTab' ? '현재 창 이동' : '새 탭 실행'}</span>
          </div>
          <div class="user-app-run-info">
            <span>실행 ${runCount}회</span>
            <span>최근 실행 ${lastRunText}</span>
          </div>
        </div>
        <div class="app-card-actions app-card-actions-v4">
          <div class="secure-launch-label">SECURE LAUNCH · TOKEN</div>
          <button type="button" class="favorite-app-btn compact-favorite-btn ${favoriteIds.has(app.id) ? 'is-favorite' : ''}" data-app-id="${escapeHtml(app.id)}" title="즐겨찾기" ${canLaunch ? '' : 'disabled'}>${favoriteIds.has(app.id) ? '★' : '☆'}</button>
          <button type="button" class="user-app-open ${actionClass} compact-launch-btn" data-app-id="${escapeHtml(app.id)}">${actionLabel}</button>
        </div>
      </article>
    `;
  }).join('');

  setLaunchButtonsEnabled(visibleApps.some(app => canLaunchFromStore(app, approvalStatus)));
}

async function recordAppLaunch(app, tokenInfo) {
  await recordSecureExecution(app, tokenInfo);
  loadActivityLogs();
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

  const launchMode = resolveLaunchMode(app);
  let openedTab = null;

  if (launchMode === 'newTab') {
    openedTab = window.open('about:blank', '_blank');
  }

  let tokenInfo = null;
  try {
    const permission = await checkAppPermission(app);
    if (!permission.allowed) {
      alert(permission.reason);
      if (openedTab) openedTab.close();
      return;
    }
    tokenInfo = await createLaunchToken(app, launchMode);
    await recordAppLaunch(app, tokenInfo);
  } catch (error) {
    console.warn('앱 보안 실행 준비 실패:', error);
    alert('앱 실행 보안 검증 실패: ' + error.message);
    if (openedTab) openedTab.close();
    return;
  }

  const launchUrl = app.entryUrl && tokenInfo?.token
    ? `${app.entryUrl}${app.entryUrl.includes('?') ? '&' : '?'}masterLaunchToken=${encodeURIComponent(tokenInfo.token)}&appId=${encodeURIComponent(app.id)}`
    : app.entryUrl;

  if (launchMode === 'newTab') {
    if (openedTab) {
      openedTab.opener = null;
      openedTab.location.href = launchUrl;
    } else {
      alert('팝업이 차단되었습니다. 브라우저에서 팝업 허용 후 다시 실행하세요.');
    }
    return;
  }

  if (launchMode === 'sameTab') {
    window.location.href = launchUrl;
    return;
  }

  moveToRuntime();
  window.MasterOSLastManifest = buildAppManifest(app.id, app);
  const targetHash = app.path || '/';
  if (window.location.hash === `#${targetHash}` && window.AppRouter?.resolveRoute) {
    window.AppRouter.resolveRoute(window.location.hash);
  } else {
    window.location.hash = targetHash;
  }
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
    updateUserStats([], 'none');
    favoriteIds = new Set();
    updateFavoriteCount();
    renderFavoriteWidget([]);
    renderNotifications([], 'none');
    renderEmptyApps('로그인이 필요합니다.');
    setLaunchButtonsEnabled(false);
    return;
  }

  setText(dashboardLoginState, '로그인 확인 완료');
  setText(dashboardEmail, user.email || '-');
  setText(dashboardUid, user.uid || '-');
  setText(profileEmailText, user.email || '-');
  if (profileInitial) profileInitial.textContent = (user.email || 'U').charAt(0).toUpperCase();
  await loadFavorites();
  loadActivityLogs();

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
    setText(profileRoleText, isAdmin ? '관리자 계정' : '일반 사용자');
    setText(dashboardApproval, statusLabel(approvalStatus));
    setText(dashboardSubmitted, formatDate(applicationData?.submittedAt));
    setText(dashboardReviewed, applicationData?.reviewedAt ? formatDate(applicationData.reviewedAt) : '심사 대기 또는 미처리');

    if (appsUnsubscribeRef) off(appsUnsubscribeRef);
    appsUnsubscribeRef = ref(db, 'apps');
    onValue(appsUnsubscribeRef, (snapshot) => {
      const appsData = snapshot.val() || {};
      const activeApps = Object.keys(appsData)
        .map(appId => ({ id: appId, ...appsData[appId] }))
        .filter(app => normalizeActiveStatus(app.isActive) && app.publicVisible !== false)
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

function launchFirstCachedApp() {
  const app = getPrimaryApp();
  if (!app) return;
  launchApp(app);
}

if (dashboardOpenFirstAppBtn) {
  dashboardOpenFirstAppBtn.addEventListener('click', launchFirstCachedApp);
}
if (dashboardQuickLaunchBtn) {
  dashboardQuickLaunchBtn.addEventListener('click', launchFirstCachedApp);
}
if (storeFeaturedLaunchBtn) {
  storeFeaturedLaunchBtn.addEventListener('click', launchFirstCachedApp);
}

if (dashboardApps) {
  dashboardApps.addEventListener('click', async (event) => {
    const favoriteButton = event.target.closest('.favorite-app-btn');
    if (favoriteButton) {
      const id = favoriteButton.dataset.appId;
      const willEnable = !favoriteIds.has(id);
      willEnable ? favoriteIds.add(id) : favoriteIds.delete(id);
      saveFavorites();
      renderApps(cachedApps, currentApprovalStatus);
      try {
        await syncFavorite(id, willEnable);
      } catch (error) {
        console.warn('즐겨찾기 Firebase 저장 실패:', error);
        alert('즐겨찾기 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      return;
    }
    const requestButton = event.target.closest('.request-app-btn');
    if (requestButton) {
      const app = cachedApps.find(item => item.id === requestButton.dataset.appId);
      moveToRequest(app);
      return;
    }
    const button = event.target.closest('.launch-app-btn');
    if (!button) return;
    const app = cachedApps.find(item => item.id === button.dataset.appId);
    launchApp(app);
  });
}


if (favoriteWidgetBody) {
  favoriteWidgetBody.addEventListener('click', (event) => {
    const button = event.target.closest('.favorite-widget-launch');
    if (!button) return;
    const app = cachedApps.find(item => item.id === button.dataset.appId);
    launchApp(app);
  });
}

function applySearch(value) {
  searchKeyword = value || '';
  if (globalSearchInput && globalSearchInput.value !== searchKeyword) globalSearchInput.value = searchKeyword;
  if (storeSearchInput && storeSearchInput.value !== searchKeyword) storeSearchInput.value = searchKeyword;
  renderApps(cachedApps, currentApprovalStatus);
}

[globalSearchInput, storeSearchInput].forEach((input) => {
  if (!input) return;
  input.addEventListener('input', () => applySearch(input.value));
});

if (notificationToggleBtn && notificationPanel) {
  notificationToggleBtn.addEventListener('click', () => notificationPanel.classList.toggle('workspace-hidden'));
}
if (profileToggleBtn && profilePanel) {
  profileToggleBtn.addEventListener('click', () => profilePanel.classList.toggle('workspace-hidden'));
}
if (activityRefreshBtn) {
  activityRefreshBtn.addEventListener('click', loadActivityLogs);
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  loadUserDashboard(user);
});
