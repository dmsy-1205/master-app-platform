import { db, auth } from './firebase.js';
import { ref, onValue, update, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const qaCriticalCount = document.getElementById('qaCriticalCount');
const qaWarningCount = document.getElementById('qaWarningCount');
const qaNormalCount = document.getElementById('qaNormalCount');
const qaPlatformState = document.getElementById('qaPlatformState');
const qaChecklist = document.getElementById('qaChecklist');
const notificationCenterList = document.getElementById('notificationCenterList');
const notificationRefreshBtn = document.getElementById('notificationRefreshBtn');
const versionManagerList = document.getElementById('versionManagerList');

let apps = {};
let applications = {};
let history = {};
let feedback = {};
let users = {};
let executionLogs = {};
let currentIsAdmin = false;
let currentUser = null;

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

function buildNotifications() {
  const myUid = currentUser?.uid;
  const list = [];
  Object.entries(applications || {}).forEach(([uid, item]) => {
    if (!currentIsAdmin && uid !== myUid) return;
    list.push({ level: 'warning', title: `${item.requestedAppName || '앱'} ${statusLabel(item.status || 'pending')}`, text: item.email || uid, at: item.submittedAt || item.requestedAt });
  });
  Object.values(history || {}).forEach(item => {
    if (!currentIsAdmin && item.uid !== myUid) return;
    list.push({ level: item.status === 'approved' ? 'normal' : 'warning', title: `${item.requestedAppName || '앱'} ${statusLabel(item.status)}`, text: item.reason || item.email || '', at: item.reviewedAt || item.processedAt || item.archivedAt });
  });
  Object.values(feedback || {}).forEach(item => {
    if (!currentIsAdmin && item.uid !== myUid && item.type !== 'notice') return;
    list.push({ level: item.type === 'bug' ? 'critical' : 'normal', title: `${typeLabel(item.type)} · ${item.title || '제목 없음'}`, text: `${statusLabel(item.status || 'open')} ${item.adminReply ? '· 관리자 답변 있음' : ''}`, at: item.updatedAt || item.createdAt });
  });
  Object.values(apps || {}).forEach(app => {
    if (app.updateNote) list.push({ level: 'normal', title: `${app.name || '앱'} 업데이트`, text: `${app.version || 'v1.0'} · ${app.updateNote}`, at: app.updatedAt });
  });
  return list.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0)).slice(0, 30);
}

function renderNotifications() {
  if (!notificationCenterList) return;
  const notices = buildNotifications();
  if (!notices.length) {
    notificationCenterList.innerHTML = '<p class="placeholder-text">표시할 알림이 없습니다.</p>';
    return;
  }
  notificationCenterList.innerHTML = notices.map(item => `
    <article class="op-notice level-${escapeHtml(item.level)}">
      <span>${item.level === 'critical' ? '🚨' : item.level === 'warning' ? '⚠️' : '🔔'}</span>
      <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)} · ${fmt(item.at)}</small></div>
    </article>
  `).join('');
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

function refreshAll() {
  renderQa();
  renderNotifications();
  renderVersions();
}

window.addEventListener('master-auth-role-changed', (event) => {
  currentIsAdmin = Boolean(event.detail?.isAdmin);
  refreshAll();
});

auth.onAuthStateChanged(user => {
  currentUser = user;
  refreshAll();
});

onValue(ref(db, 'apps'), snap => { apps = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'applications'), snap => { applications = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'applicationHistory'), snap => { history = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'feedbackBoard'), snap => { feedback = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'users'), snap => { users = snap.val() || {}; refreshAll(); });
onValue(ref(db, 'executionLogs'), snap => { executionLogs = snap.val() || {}; refreshAll(); });

if (notificationRefreshBtn) notificationRefreshBtn.addEventListener('click', refreshAll);
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
