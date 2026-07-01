import { db, auth } from './firebase.js';
import { ref, onValue, update, push, set, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const qaCriticalCount = document.getElementById('qaCriticalCount');
const qaWarningCount = document.getElementById('qaWarningCount');
const qaNormalCount = document.getElementById('qaNormalCount');
const qaPlatformState = document.getElementById('qaPlatformState');
const qaChecklist = document.getElementById('qaChecklist');
const notificationCenterList = document.getElementById('notificationCenterList');
const notificationRefreshBtn = document.getElementById('notificationRefreshBtn');
const versionManagerList = document.getElementById('versionManagerList');
const adminNoticeTitle = document.getElementById('adminNoticeTitle');
const adminNoticeContent = document.getElementById('adminNoticeContent');
const adminNoticeSubmitBtn = document.getElementById('adminNoticeSubmitBtn');
const adminNoticeResult = document.getElementById('adminNoticeResult');
const detailAppSelect = document.getElementById('detailAppSelect');
const detailReloadBtn = document.getElementById('detailReloadBtn');
const appDetailPreview = document.getElementById('appDetailPreview');
const officialAppList = document.getElementById('officialAppList');
const deploymentCenterList = document.getElementById('deploymentCenterList');
const healthMonitorList = document.getElementById('healthMonitorList');
const backupExportBtn = document.getElementById('backupExportBtn');
const backupResult = document.getElementById('backupResult');
const developerAppSelect = document.getElementById('developerAppSelect');
const developerInspectBtn = document.getElementById('developerInspectBtn');
const sdkGenerateBtn = document.getElementById('sdkGenerateBtn');
const developerResult = document.getElementById('developerResult');

let apps = {};
let applications = {};
let history = {};
let feedback = {};
let users = {};
let executionLogs = {};
let currentIsAdmin = false;
let currentUser = null;
let dismissedNotificationIds = new Set();
const NOTIFICATION_VISIBLE_LIMIT = 10;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function fmt(value) {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString('ko-KR');
}

function statusLabel(status = '') {
  return {
    pending: '승인 대기', approved: '승인 완료', rejected: '거절 완료', checking: '검토중',
    open: '접수', done: '완료', closed: '보류', suspended: '정지', expelled: '퇴출'
  }[status] || status || '-';
}

function typeLabel(type = '') {
  return { bug: '버그', request: '기능요청', question: '질문', improvement: '개선사항', notice: '공지', ui: '화면개선', etc: '기타' }[type] || type || '기타';
}

function flatValues(obj = {}) {
  return Object.values(obj || {}).flatMap(v => (v && typeof v === 'object') ? Object.values(v) : []);
}

function notificationStorageKey() {
  return `masterosDismissedNotifications:${currentUser?.uid || 'guest'}`;
}

function loadDismissedNotifications() {
  try {
    dismissedNotificationIds = new Set(JSON.parse(localStorage.getItem(notificationStorageKey()) || '[]'));
  } catch {
    dismissedNotificationIds = new Set();
  }
}

function saveDismissedNotifications() {
  try {
    localStorage.setItem(notificationStorageKey(), JSON.stringify([...dismissedNotificationIds]));
  } catch {
    // localStorage가 막힌 환경에서는 화면 갱신만 유지합니다.
  }
}

function makeNotificationId(source, key, at = '') {
  return `${source}:${key || 'item'}:${at || ''}`;
}

function buildNotifications() {
  const myUid = currentUser?.uid;
  const list = [];
  Object.entries(applications || {}).forEach(([uid, item]) => {
    if (!currentIsAdmin && uid !== myUid) return;
    const at = item.submittedAt || item.requestedAt || item.updatedAt || '';
    list.push({
      id: makeNotificationId('applications', uid, at),
      level: 'warning',
      title: `${item.requestedAppName || '앱'} ${statusLabel(item.status || 'pending')}`,
      text: item.email || uid,
      at
    });
  });
  Object.entries(history || {}).forEach(([id, item]) => {
    if (!currentIsAdmin && item.uid !== myUid) return;
    const at = item.reviewedAt || item.processedAt || item.archivedAt || item.updatedAt || '';
    list.push({
      id: makeNotificationId('applicationHistory', id, at),
      level: item.status === 'approved' ? 'normal' : 'warning',
      title: `${item.requestedAppName || '앱'} ${statusLabel(item.status)}`,
      text: item.reason || item.email || '',
      at
    });
  });
  Object.entries(feedback || {}).forEach(([id, item]) => {
    if (!currentIsAdmin && item.uid !== myUid && item.type !== 'notice') return;
    const at = item.updatedAt || item.createdAt || '';
    list.push({
      id: makeNotificationId('feedbackBoard', id, at),
      level: item.type === 'bug' ? 'critical' : 'normal',
      title: `${typeLabel(item.type)} · ${item.title || '제목 없음'}`,
      text: `${statusLabel(item.status || 'open')} ${item.adminReply ? '· 관리자 답변 있음' : ''}`,
      at
    });
  });
  Object.entries(apps || {}).forEach(([appId, app]) => {
    if (!app.updateNote) return;
    const at = app.updatedAt || app.createdAt || app.version || '';
    list.push({
      id: makeNotificationId('apps', appId, at),
      level: 'normal',
      title: `${app.name || '앱'} 업데이트`,
      text: `${app.version || 'v1.0'} · ${app.updateNote}`,
      at
    });
  });
  return list
    .filter(item => !dismissedNotificationIds.has(item.id))
    .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
}

function renderNotifications() {
  if (!notificationCenterList) return;
  const allNotices = buildNotifications();
  const notices = allNotices.slice(0, NOTIFICATION_VISIBLE_LIMIT);
  const hiddenCount = Math.max(0, allNotices.length - notices.length);
  if (!notices.length) {
    notificationCenterList.innerHTML = '<p class="placeholder-text">표시할 알림이 없습니다.</p>';
    return;
  }
  notificationCenterList.innerHTML = notices.map(item => `
    <article class="op-notice level-${escapeHtml(item.level)}">
      <span>${item.level === 'critical' ? '🚨' : item.level === 'warning' ? '⚠️' : '🔔'}</span>
      <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)} · ${fmt(item.at)}</small></div>
      <button type="button" class="mini-danger" data-notice-hide="${escapeHtml(item.id)}">삭제</button>
    </article>
  `).join('') + (hiddenCount ? `<p class="placeholder-text">최근 ${NOTIFICATION_VISIBLE_LIMIT}개만 표시합니다. 이전 알림 ${hiddenCount}개는 보관됩니다.</p>` : '');
}

function renderQa() {
  const activePending = Object.values(applications || {}).filter(v => (v?.status || 'pending') === 'pending');
  const bugOpen = Object.values(feedback || {}).filter(v => v?.type === 'bug' && !['done','closed'].includes(v?.status || 'open'));
  const checking = Object.values(feedback || {}).filter(v => v?.status === 'checking');
  const allFeedback = Object.values(feedback || {});
  const appCount = Object.keys(apps || {}).length;
  const userCount = Object.keys(users || {}).length;
  const runCount = flatValues(executionLogs).length;

  if (qaCriticalCount) qaCriticalCount.textContent = String(bugOpen.length);
  if (qaWarningCount) qaWarningCount.textContent = String(activePending.length + checking.length);
  if (qaNormalCount) qaNormalCount.textContent = String(Math.max(0, allFeedback.length - bugOpen.length) + appCount);
  if (qaPlatformState) qaPlatformState.textContent = 'OK';
  if (!qaChecklist) return;
  qaChecklist.innerHTML = `
    <article><strong>승인 대기</strong><span>${activePending.length}건</span><small>대기 목록은 pending만 남아야 정상입니다.</small></article>
    <article><strong>등록 앱</strong><span>${appCount}개</span><small>App Store와 Runtime 권한 동기화 대상입니다.</small></article>
    <article><strong>회원 수</strong><span>${userCount}명</span><small>Firebase users 기준입니다.</small></article>
    <article><strong>실행 로그</strong><span>${runCount}건</span><small>Secure Launcher 기록 기준입니다.</small></article>
    <article><strong>오픈 버그</strong><span>${bugOpen.length}건</span><small>완료 또는 보류 전까지 Critical로 관리합니다.</small></article>
  `;
}

function renderVersions() {
  if (!versionManagerList) return;
  const rows = Object.entries(apps || {}).sort((a,b)=> (a[1]?.name||a[0]).localeCompare(b[1]?.name||b[0]));
  if (!rows.length) {
    versionManagerList.innerHTML = '<p class="placeholder-text">등록된 앱이 없습니다.</p>';
    return;
  }
  versionManagerList.innerHTML = rows.map(([id, app]) => {
    const versions = Object.values(app.versions || {});
    const latest = versions.sort((a,b)=> new Date(b.releasedAt||0) - new Date(a.releasedAt||0))[0];
    return `
      <article class="version-item">
        <div><strong>${escapeHtml(app.icon || '📦')} ${escapeHtml(app.name || id)}</strong><small>ID ${escapeHtml(id)} · Owner ${escapeHtml(app.owner || 'MasterOS')}</small></div>
        <span>${escapeHtml(app.version || latest?.version || 'v1.0')}</span>
        <small>${escapeHtml(app.updateNote || latest?.updateNote || '업데이트 노트 없음')}</small>
        <button type="button" data-version-stable="${escapeHtml(id)}">Stable 표시</button>
      </article>`;
  }).join('');
}


function renderServiceAppSelectors() {
  const rows = Object.entries(apps || {}).sort((a,b)=>(a[1]?.name||a[0]).localeCompare(b[1]?.name||b[0]));
  const html = rows.length ? rows.map(([id, app]) => `<option value="${escapeHtml(id)}">${escapeHtml(app.icon || '📦')} ${escapeHtml(app.name || id)} (${escapeHtml(app.version || 'v1.0')})</option>`).join('') : '<option value="">등록된 앱 없음</option>';
  if (detailAppSelect) detailAppSelect.innerHTML = html;
  if (developerAppSelect) developerAppSelect.innerHTML = html;
}

function renderAppDetailCenter() {
  if (!appDetailPreview) return;
  const selectedId = detailAppSelect?.value || Object.keys(apps || {})[0];
  const app = selectedId ? apps[selectedId] : null;
  if (!app) {
    appDetailPreview.innerHTML = '<p class="placeholder-text">등록된 앱이 없습니다.</p>';
    return;
  }
  const versions = Object.values(app.versions || {}).sort((a,b)=>new Date(b.releasedAt||0)-new Date(a.releasedAt||0));
  appDetailPreview.innerHTML = `
    <article class="app-detail-card">
      <div class="app-detail-head"><span class="app-detail-icon">${escapeHtml(app.icon || '📦')}</span><div><h3>${escapeHtml(app.name || selectedId)}</h3><p>${escapeHtml(app.description || '소개글이 없습니다.')}</p></div></div>
      <div class="service-meta-grid">
        <p><strong>App ID</strong><br>${escapeHtml(selectedId)}</p>
        <p><strong>Version</strong><br>${escapeHtml(app.version || 'v1.0')}</p>
        <p><strong>Owner</strong><br>${escapeHtml(app.owner || 'MasterOS')}</p>
        <p><strong>Category</strong><br>${escapeHtml(app.category || 'General')}</p>
        <p><strong>Permission</strong><br>${escapeHtml(app.permissionMode || 'approved')}</p>
        <p><strong>Launch</strong><br>${escapeHtml(app.launchMode || 'router')}</p>
      </div>
      <div class="service-note"><strong>업데이트</strong><br>${escapeHtml(app.updateNote || '업데이트 노트가 없습니다.')}</div>
      <div class="service-note"><strong>버전 이력</strong><br>${versions.length ? versions.map(v=>`${escapeHtml(v.version||'-')} · ${escapeHtml(v.updateNote||'')}`).join('<br>') : '아직 별도 버전 이력이 없습니다.'}</div>
    </article>`;
}

function renderOfficialAppCenter() {
  if (!officialAppList) return;
  const rows = Object.entries(apps || {}).filter(([, app]) => app?.official === true || app?.category === 'Official');
  if (!rows.length) {
    officialAppList.innerHTML = '<p class="placeholder-text">공식 앱으로 지정된 앱이 없습니다.</p>';
    return;
  }
  officialAppList.innerHTML = rows.map(([id, app]) => `
    <article class="service-card">
      <span class="service-card-icon">${escapeHtml(app.icon || '📦')}</span>
      <h3>${escapeHtml(app.name || id)}</h3>
      <p>${escapeHtml(app.description || '')}</p>
      <small>ID ${escapeHtml(id)} · ${escapeHtml(app.version || 'v1.0')}</small>
      <span class="verified-badge">Platform Verified</span>
    </article>`).join('');
}

function renderDeploymentCenter() {
  if (!deploymentCenterList) return;
  const rows = Object.entries(apps || {}).sort((a,b)=>(a[1]?.name||a[0]).localeCompare(b[1]?.name||b[0]));
  if (!rows.length) {
    deploymentCenterList.innerHTML = '<p class="placeholder-text">배포 관리할 앱이 없습니다.</p>';
    return;
  }
  deploymentCenterList.innerHTML = rows.map(([id, app]) => `
    <article class="deployment-row">
      <div><strong>${escapeHtml(app.icon || '📦')} ${escapeHtml(app.name || id)}</strong><small>${escapeHtml(app.version || 'v1.0')} · ${escapeHtml(app.releaseChannel || 'stable')}</small></div>
      <div class="admin-row-actions">
        <button type="button" data-deploy-channel="stable" data-app-id="${escapeHtml(id)}">Stable</button>
        <button type="button" data-deploy-channel="beta" data-app-id="${escapeHtml(id)}">Beta</button>
        <button type="button" data-deploy-channel="rollback" data-app-id="${escapeHtml(id)}">Rollback</button>
      </div>
    </article>`).join('');
}

function renderHealthMonitor() {
  if (!healthMonitorList) return;
  const checks = [
    ['Firebase Auth', currentUser ? '정상' : '로그인 필요', currentUser ? 'normal' : 'warning'],
    ['Realtime Database', '정상', 'normal'],
    ['App Registry', `${Object.keys(apps || {}).length}개 앱`, Object.keys(apps || {}).length ? 'normal' : 'warning'],
    ['Approval Queue', `${Object.values(applications || {}).filter(v => (v?.status || 'pending') === 'pending').length}건 대기`, 'normal'],
    ['Feedback Board', `${Object.keys(feedback || {}).length}건`, 'normal'],
    ['Execution Log', `${flatValues(executionLogs).length}건`, 'normal'],
    ['Notification Center', '연결됨', 'normal']
  ];
  healthMonitorList.innerHTML = checks.map(([name, value, level]) => `<article class="health-${level}"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(value)}</span><small>${level === 'normal' ? '🟢 정상' : '🟡 확인 필요'}</small></article>`).join('');
}

function renderDeveloperInspector() {
  if (!developerResult) return;
  const id = developerAppSelect?.value || Object.keys(apps || {})[0];
  const app = id ? apps[id] : null;
  if (!app) {
    developerResult.textContent = '검사할 앱이 없습니다.';
    return;
  }
  const checks = [
    ['manifest.name', Boolean(app.name)],
    ['manifest.path', Boolean(app.path && app.path.startsWith('/'))],
    ['manifest.entryUrl', Boolean(app.entryUrl)],
    ['permission.mode', Boolean(app.permissionMode)],
    ['version', Boolean(app.version)],
    ['launcher.mode', Boolean(app.launchMode)],
    ['publicVisible', app.publicVisible !== undefined]
  ];
  developerResult.textContent = `MasterOS Developer Inspection

App ID: ${id}
App Name: ${app.name || '-'}

` + checks.map(([name, ok]) => `${ok ? 'PASS' : 'WARN'}  ${name}`).join('\n');
}

function renderSdkDraft() {
  const id = developerAppSelect?.value || Object.keys(apps || {})[0];
  const app = id ? apps[id] : null;
  if (!developerResult || !app) return;
  developerResult.textContent = JSON.stringify({
    manifest: {
      id,
      name: app.name || id,
      version: app.version || 'v1.0',
      owner: app.owner || 'MasterOS',
      category: app.category || 'General',
      entryUrl: app.entryUrl || './apps/app.html',
      launchMode: app.launchMode || 'router',
      permissions: app.permissions || ['approved-user'],
      official: app.official === true
    },
    permissions: { mode: app.permissionMode || 'approved' },
    runtime: { launcher: 'MasterOS Secure Launcher', tokenRequired: true }
  }, null, 2);
}

function renderServicePlatform() {
  renderServiceAppSelectors();
  renderAppDetailCenter();
  renderOfficialAppCenter();
  renderDeploymentCenter();
  renderHealthMonitor();
}

function refreshAll() {
  renderQa();
  renderNotifications();
  renderVersions();
  renderServicePlatform();
}

window.addEventListener('master-auth-role-changed', (event) => {
  currentIsAdmin = Boolean(event.detail?.isAdmin);
  refreshAll();
});

auth.onAuthStateChanged(user => {
  currentUser = user;
  loadDismissedNotifications();
  refreshAll();
});

onValue(ref(db, 'apps'), snap => { apps = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'applications'), snap => { applications = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'applicationHistory'), snap => { history = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'feedbackBoard'), snap => { feedback = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'users'), snap => { users = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'executionLogs'), snap => { executionLogs = snap.val() || {}; refreshAll(); });

if (notificationRefreshBtn) notificationRefreshBtn.addEventListener('click', refreshAll);
if (notificationCenterList) {
  notificationCenterList.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-notice-hide]');
    if (!btn) return;
    dismissedNotificationIds.add(btn.dataset.noticeHide);
    saveDismissedNotifications();
    renderNotifications();
  });
}
if (adminNoticeSubmitBtn) {
  adminNoticeSubmitBtn.addEventListener('click', async () => {
    if (!currentIsAdmin) return alert('관리자만 공지를 등록할 수 있습니다.');
    const title = adminNoticeTitle?.value.trim() || '';
    const content = adminNoticeContent?.value.trim() || '';
    if (!title || !content) return alert('공지 제목과 내용을 입력하세요.');
    try {
      const itemRef = push(ref(db, 'feedbackBoard'));
      await set(itemRef, {
        uid: currentUser?.uid || 'admin',
        email: currentUser?.email || 'admin',
        type: 'notice',
        title,
        content,
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      if (adminNoticeTitle) adminNoticeTitle.value = '';
      if (adminNoticeContent) adminNoticeContent.value = '';
      if (adminNoticeResult) adminNoticeResult.textContent = '공지 등록 완료';
    } catch (error) {
      if (adminNoticeResult) adminNoticeResult.textContent = '공지 등록 실패: ' + error.message;
    }
  });
}
if (detailReloadBtn) detailReloadBtn.addEventListener('click', renderAppDetailCenter);
if (detailAppSelect) detailAppSelect.addEventListener('change', renderAppDetailCenter);
if (developerInspectBtn) developerInspectBtn.addEventListener('click', renderDeveloperInspector);
if (sdkGenerateBtn) sdkGenerateBtn.addEventListener('click', renderSdkDraft);
if (backupExportBtn) backupExportBtn.addEventListener('click', () => {
  const snapshot = {
    exportedAt: new Date().toISOString(),
    apps,
    applications,
    applicationHistory: history,
    feedbackBoard: feedback,
    users,
    executionLogs
  };
  if (backupResult) backupResult.textContent = JSON.stringify(snapshot, null, 2);
});
if (deploymentCenterList) {
  deploymentCenterList.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-deploy-channel]');
    if (!btn || !currentIsAdmin) return;
    const appId = btn.dataset.appId;
    const channel = btn.dataset.deployChannel;
    try {
      await update(ref(db, `apps/${appId}`), { releaseChannel: channel, updatedAt: new Date().toISOString() });
      const noticeRef = push(ref(db, 'feedbackBoard'));
      await set(noticeRef, {
        uid: currentUser?.uid || 'system',
        email: currentUser?.email || 'system',
        type: 'notice',
        title: `${apps[appId]?.name || appId} ${channel} 배포 상태 변경`,
        content: `Deployment Center에서 ${channel} 채널로 표시되었습니다.`,
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      alert('배포 상태 변경 실패: ' + error.message);
    }
  });
}
if (versionManagerList) {
  versionManagerList.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-version-stable]');
    if (!btn || !currentIsAdmin) return;
    const appId = btn.dataset.versionStable;
    try {
      await update(ref(db, `apps/${appId}`), { releaseChannel: 'stable', updatedAt: new Date().toISOString() });
      await push(ref(db, 'feedbackBoard'), {
        uid: currentUser?.uid || 'system',
        email: currentUser?.email || 'system',
        type: 'notice',
        title: `${apps[appId]?.name || appId} Stable 배포 표시`,
        content: 'Version Manager에서 Stable 채널로 표시되었습니다.',
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      alert('버전 상태 변경 실패: ' + error.message);
    }
  });
}
