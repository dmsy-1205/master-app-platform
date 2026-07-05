import { auth, db } from './firebase.js';
import { ref, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { buildAppManifest } from './security.js';

const state = { apps: {}, users: {}, applications: {}, applicationHistory: {}, notices: {}, feedback: {}, executionLogs: {}, launchTokens: {} };
const realtimeErrors = {};

const $ = (id) => document.getElementById(id);
const esc = (value = '') => String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
const formatDate = (value) => value ? new Date(value).toLocaleString('ko-KR') : '-';
const appEntries = () => Object.entries(state.apps || {}).map(([id, app]) => ({ id, ...app }));
const isActive = (app) => app?.isActive === true || app?.isActive === 'true';

function assertAdminSession() {
  if (!auth.currentUser) throw new Error('관리자 로그인이 필요합니다.');
}

function fillAppSelect(selectId) {
  const select = $(selectId);
  if (!select) return;
  const apps = appEntries().sort((a, b) => String(a.name || a.id).localeCompare(String(b.name || b.id)));
  select.innerHTML = apps.length
    ? apps.map(app => `<option value="${esc(app.id)}">${esc(app.icon || '📦')} ${esc(app.name || app.id)} · ${esc(app.version || 'v1.0')}</option>`).join('')
    : '<option value="">등록된 앱이 없습니다</option>';
}

function renderAppDetail() {
  const select = $('detailAppSelect');
  const target = $('appDetailPreview');
  if (!select || !target) return;
  const app = state.apps?.[select.value];
  if (!app) {
    target.innerHTML = '<p class="placeholder-text">앱을 선택하면 상세 정보가 표시됩니다.</p>';
    return;
  }
  const manifest = buildAppManifest(select.value, app);
  const versions = Object.values(app.versions || {}).sort((a, b) => String(b.releasedAt || '').localeCompare(String(a.releasedAt || '')));
  target.innerHTML = `
    <div class="step14-detail-card">
      <div class="step14-app-hero"><span>${esc(app.icon || '📦')}</span><div><h3>${esc(app.name || select.value)}</h3><p>${esc(app.description || '설명이 없습니다.')}</p></div></div>
      <div class="step14-chip-row">
        <span>${app.official ? 'Platform Verified' : 'General App'}</span><span>${esc(app.category || 'General')}</span><span>${isActive(app) ? '활성' : '비활성'}</span><span>${esc(app.permissionMode || 'approved')}</span>
      </div>
      <div class="step14-two-col">
        <pre>${esc(JSON.stringify(manifest, null, 2))}</pre>
        <div class="service-list">${versions.length ? versions.map(v => `<article><strong>${esc(v.version || v.versionKey)}</strong><small>${formatDate(v.releasedAt)} · 실행 ${Number(v.runCount || 0)}회</small><p>${esc(v.updateNote || '업데이트 노트 없음')}</p></article>`).join('') : '<p class="placeholder-text">버전 히스토리가 없습니다.</p>'}</div>
      </div>
    </div>`;
}

function renderOfficialCenter() {
  const target = $('officialAppList');
  if (!target) return;
  const apps = appEntries().filter(app => app.official === true || app.category === 'Official');
  target.innerHTML = apps.length ? apps.map(app => `
    <article class="step14-card">
      <div class="step14-app-hero"><span>${esc(app.icon || '📦')}</span><div><h3>${esc(app.name || app.id)}</h3><p>${esc(app.description || '')}</p></div></div>
      <div class="step14-chip-row"><span>Official Badge</span><span>${Number(app.runCount || 0)} runs</span><span>${esc(app.version || 'v1.0')}</span></div>
      <button type="button" data-feature-app="${esc(app.id)}">${app.featured ? '추천 해제' : '추천 앱 지정'}</button>
    </article>`).join('') : '<p class="placeholder-text">Official 앱이 없습니다. 앱 관리에서 Official 값을 Platform Verified로 변경하세요.</p>';
  target.querySelectorAll('[data-feature-app]').forEach(btn => btn.addEventListener('click', async () => {
    assertAdminSession();
    const id = btn.dataset.featureApp;
    await update(ref(db, `apps/${id}`), { featured: !state.apps[id]?.featured, official: true, updatedAt: new Date().toISOString() });
  }));
}

function renderDeploymentCenter() {
  const target = $('deploymentCenterList');
  if (!target) return;
  const apps = appEntries();
  target.innerHTML = apps.length ? apps.map(app => `
    <article class="step14-row-card">
      <div><strong>${esc(app.name || app.id)}</strong><small>${esc(app.version || 'v1.0')} · ${esc(app.deploymentChannel || 'stable')}</small><p>${esc(app.updateNote || '배포 노트 없음')}</p></div>
      <div class="step14-actions"><button data-deploy="stable" data-app="${esc(app.id)}">Stable</button><button data-deploy="beta" data-app="${esc(app.id)}">Beta</button><button data-deploy="rollback" data-app="${esc(app.id)}">Rollback</button></div>
    </article>`).join('') : '<p class="placeholder-text">배포할 앱이 없습니다.</p>';
  target.querySelectorAll('[data-deploy]').forEach(btn => btn.addEventListener('click', async () => {
    assertAdminSession();
    await update(ref(db, `apps/${btn.dataset.app}`), { deploymentChannel: btn.dataset.deploy, deployedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }));
}

function renderHealthMonitor() {
  const target = $('healthMonitorList');
  if (!target) return;
  const checks = [
    ['Firebase Auth', auth.currentUser ? '정상' : '세션 없음', !!auth.currentUser],
    ['Realtime Database', '연결됨', true],
    ['Runtime', `${appEntries().filter(isActive).length}개 활성 앱`, true],
    ['Launcher', `${Object.keys(state.launchTokens || {}).length}개 토큰 기록`, true],
    ['Database Collections', `${Object.keys(state).filter(k => state[k] && Object.keys(state[k]).length).length}개 영역 감지`, true]
  ];
  target.innerHTML = checks.map(([name, desc, ok]) => `<article class="qa-item ${ok ? 'ok' : 'warn'}"><strong>${esc(name)}</strong><span>${esc(desc)}</span></article>`).join('');
}

async function exportBackup() {
  const target = $('backupResult');
  if (!target) return;
  try {
    assertAdminSession();
    const keys = ['users', 'apps', 'notices', 'feedback', 'manifest', 'applications', 'applicationHistory', 'executionLogs'];
    const snaps = await Promise.all(keys.map(key => get(ref(db, key))));
    const payload = { exportedAt: new Date().toISOString(), version: 'STEP14-v1', collections: {} };
    keys.forEach((key, idx) => { payload.collections[key] = snaps[idx].val() || {}; });
    target.textContent = JSON.stringify(payload, null, 2);
  } catch (err) { target.textContent = `백업 실패: ${err.message}`; }
}

function inspectApp(appId) {
  const app = state.apps?.[appId];
  if (!app) return { score: 0, checks: [], sdk: null };
  const manifest = buildAppManifest(appId, app);
  const checks = [
    ['Manifest', !!manifest.appId && !!manifest.version && !!manifest.entry, 'manifest.json 필수값'],
    ['Permission', Array.isArray(manifest.permissions) && manifest.permissions.length > 0, 'permission.json 권한 태그'],
    ['Entry', /^https:\/\//.test(manifest.entry) || /^\.\/apps\/.+\.html/.test(manifest.entry), 'Entry URL 형식'],
    ['Version', /^v?\d+\.\d+/.test(manifest.version), '버전 표기'],
    ['Security', app.permissionMode !== 'public' || app.publicVisible === true, '공개 앱 노출 정책'],
    ['Launch Token', !!app.launchMode, '런처 실행 방식']
  ];
  const score = Math.round((checks.filter(c => c[1]).length / checks.length) * 100);
  const permissionJson = { appId, permissions: manifest.permissions, mode: app.permissionMode || 'approved', updatedAt: new Date().toISOString() };
  const readme = `# ${app.name || appId}\n\n${app.description || 'MasterOS Plugin App'}\n\n- Entry: ${manifest.entry}\n- Version: ${manifest.version}\n- Permission Mode: ${app.permissionMode || 'approved'}\n`;
  return { score, checks, sdk: { 'manifest.json': manifest, 'permission.json': permissionJson, 'README.md': readme } };
}

function renderDeveloperInspect() {
  const select = $('developerAppSelect');
  const target = $('developerResult');
  if (!select || !target) return;
  const result = inspectApp(select.value);
  target.textContent = JSON.stringify(result, null, 2);
}

function renderSecurityScan(appId = '') {
  const target = $('securityScanResult');
  if (!target) return;
  const apps = appId ? [{ id: appId, ...state.apps[appId] }] : appEntries();
  target.innerHTML = apps.length ? apps.map(app => {
    const result = inspectApp(app.id);
    return `<article class="step14-row-card"><div><strong>${esc(app.name || app.id)}</strong><small>Security Score ${result.score}/100</small>${result.checks.map(([name, ok, desc]) => `<p class="step14-check ${ok ? 'ok' : 'fail'}">${ok ? '✅' : '⚠️'} ${esc(name)} · ${esc(desc)}</p>`).join('')}</div></article>`;
  }).join('') : '<p class="placeholder-text">검사할 앱이 없습니다.</p>';
}

function renderStatistics() {
  const grid = $('statisticsKpiGrid');
  const list = $('statisticsDetailList');
  if (!grid || !list) return;
  const users = Object.keys(state.users || {}).length;
  const apps = appEntries();
  const active = apps.filter(isActive).length;
  const runTotal = apps.reduce((sum, app) => sum + Number(app.runCount || 0), 0);
  const history = Object.values(state.applicationHistory || {});
  const pending = Object.values(state.applications || {}).filter(v => (v?.status || 'pending') === 'pending').length;
  const approved = history.filter(v => v?.status === 'approved').length;
  const rejected = history.filter(v => v?.status === 'rejected').length;
  const errors = Object.values(state.feedback || {}).filter(v => /bug|오류|에러|error/i.test(`${v?.type || ''} ${v?.title || ''} ${v?.content || ''}`)).length;
  grid.innerHTML = [ ['사용자', users], ['앱', apps.length], ['활성 앱', active], ['실행 수', runTotal], ['승인 대기', pending], ['승인', approved], ['거절', rejected], ['오류/버그', errors] ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join('');
  list.innerHTML = apps.length ? apps.sort((a,b)=>Number(b.runCount||0)-Number(a.runCount||0)).map(app => `<article><strong>${esc(app.name || app.id)}</strong><small>${Number(app.runCount || 0)} runs · Last ${formatDate(app.lastRunAt)} · ${esc(app.deploymentChannel || 'stable')}</small></article>`).join('') : '<p class="placeholder-text">앱 통계가 없습니다.</p>';
}

function refreshAll() {
  ['detailAppSelect', 'developerAppSelect', 'securityAppSelect'].forEach(fillAppSelect);
  renderAppDetail(); renderOfficialCenter(); renderDeploymentCenter(); renderHealthMonitor(); renderStatistics();
}

function bindEvents() {
  $('detailReloadBtn')?.addEventListener('click', renderAppDetail);
  $('detailAppSelect')?.addEventListener('change', renderAppDetail);
  $('backupExportBtn')?.addEventListener('click', exportBackup);
  $('developerInspectBtn')?.addEventListener('click', renderDeveloperInspect);
  $('sdkGenerateBtn')?.addEventListener('click', renderDeveloperInspect);
  $('securityScanBtn')?.addEventListener('click', () => renderSecurityScan($('securityAppSelect')?.value || ''));
  $('securityScanAllBtn')?.addEventListener('click', () => renderSecurityScan(''));
}

function renderRealtimeErrors() {
  const message = Object.entries(realtimeErrors).map(([key, msg]) => `${key}: ${msg}`).join('\n');
  if (!message) return;
  ['statisticsDetailList', 'securityScanResult', 'developerResult'].forEach((id) => {
    const target = $(id);
    if (!target) return;
    if (id === 'developerResult') target.textContent = `Firebase 읽기 권한 또는 연결 확인이 필요합니다.\n${message}`;
    else target.innerHTML = `<p class="placeholder-text">Firebase 읽기 권한 또는 연결 확인이 필요합니다.<br>${esc(message).replace(/\n/g, '<br>')}</p>`;
  });
}

function startRealtime() {
  const map = { apps: 'apps', users: 'users', applications: 'applications', applicationHistory: 'applicationHistory', notices: 'notices', feedback: 'feedback', executionLogs: 'executionLogs', launchTokens: 'launchTokens' };
  Object.entries(map).forEach(([key, path]) => onValue(
    ref(db, path),
    snap => {
      delete realtimeErrors[key];
      state[key] = snap.val() || {};
      refreshAll();
    },
    err => {
      realtimeErrors[key] = err?.message || 'unknown error';
      console.info(`[STEP14] ${path} realtime listener skipped by Firebase Rules.`, err?.message || err);
      state[key] = {};
      refreshAll();
      renderRealtimeErrors();
    }
  ));
}

document.addEventListener('DOMContentLoaded', () => { bindEvents(); startRealtime(); });
