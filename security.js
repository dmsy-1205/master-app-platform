import { auth, db } from './firebase.js';
import { ref, get, update, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { normalizeActiveStatus } from './database.js';

function sanitizeFirebaseKey(value, fallback = 'v1_0') {
  return String(value || fallback)
    .trim()
    .replace(/[.#$\[\]\/]/g, '_')
    .replace(/\s+/g, '_')
    || fallback;
}

export function buildAppManifest(appId, app = {}) {
  return {
    appId,
    version: app.version || 'v1.0',
    owner: app.owner || 'MasterOS',
    category: app.category || 'General',
    icon: app.icon || '📦',
    entry: app.entryUrl || app.entry || '',
    launchType: app.launchMode || app.launchType || 'router',
    permissions: Array.isArray(app.permissions) ? app.permissions : String(app.permissions || 'approved-user').split(',').map(v => v.trim()).filter(Boolean),
    publicVisible: app.publicVisible !== false,
    official: app.official === true || app.isOfficial === true,
    updatedAt: app.updatedAt || ''
  };
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return { user: null, userData: {}, isAdmin: false, approvalStatus: 'none' };
  const [adminSnap, userSnap, appSnap] = await Promise.all([
    get(ref(db, `admins/${user.uid}`)),
    get(ref(db, `users/${user.uid}`)),
    get(ref(db, `applications/${user.uid}`))
  ]);
  const userData = userSnap.exists() ? userSnap.val() : {};
  const appData = appSnap.exists() ? appSnap.val() : {};
  const isAdmin = (adminSnap.exists() && adminSnap.val() === true) || userData.role === 'admin';
  return { user, userData, isAdmin, approvalStatus: appData.status || userData.userStatus || 'none' };
}

export async function checkAppPermission(app, profile = null) {
  const current = profile || await getCurrentUserProfile();
  if (!current.user) return { allowed: false, reason: '로그인이 필요합니다.' };
  if (!normalizeActiveStatus(app?.isActive)) return { allowed: false, reason: '현재 비활성화된 앱입니다.' };
  if (current.isAdmin) return { allowed: true, reason: '관리자 권한' };
  const permissionMode = app.permissionMode || 'approved';
  const access = app.allowedUsers?.[current.user.uid] === true || app.allowedUsers?.[current.user.uid]?.active === true;
  if (permissionMode === 'public') return { allowed: true, reason: '공개 앱' };
  if (permissionMode === 'official' && (app.official === true || app.isOfficial === true) && current.approvalStatus === 'approved') return { allowed: true, reason: 'Official App 승인 사용자 권한' };
  if (permissionMode === 'custom' && access) return { allowed: true, reason: '사용자별 접근 권한' };
  if (permissionMode === 'approved' && current.approvalStatus === 'approved') return { allowed: true, reason: '승인 사용자 권한' };
  return { allowed: false, reason: '이 앱을 실행할 권한이 없습니다.' };
}

export async function createLaunchToken(app, launchMode = 'router') {
  const profile = await getCurrentUserProfile();
  const permission = await checkAppPermission(app, profile);
  if (!permission.allowed) throw new Error(permission.reason);
  const token = `${app.id || app.appId}-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  const expiresAt = Date.now() + (5 * 60 * 1000);
  const manifest = buildAppManifest(app.id || app.appId, app);
  const tokenPayload = {
    token,
    appId: manifest.appId,
    userId: profile.user.uid,
    userEmail: profile.user.email || '',
    launchMode,
    permissionReason: permission.reason,
    createdAt: new Date().toISOString(),
    expiresAt,
    used: false
  };
  const updates = {};
  updates[`launchTokens/${token}`] = tokenPayload;
  updates[`users/${profile.user.uid}/lastLaunchToken`] = { token, appId: manifest.appId, createdAt: tokenPayload.createdAt, expiresAt };
  await update(ref(db), updates);
  try {
    sessionStorage.setItem(`masterLaunchToken:${manifest.appId}`, token);
    sessionStorage.setItem('masterLaunchToken:last', token);
  } catch {}
  return { token, expiresAt, manifest, profile, permission };
}

export async function recordSecureExecution(app, tokenInfo) {
  const profile = tokenInfo?.profile || await getCurrentUserProfile();
  if (!profile.user || !app?.id) return;
  const launchedAt = new Date().toISOString();
  const currentRunCount = Number(app.runCount || 0);
  const updates = {};
  updates[`apps/${app.id}/runCount`] = currentRunCount + 1;
  updates[`apps/${app.id}/lastRunAt`] = launchedAt;
  updates[`apps/${app.id}/lastRunBy`] = profile.user.uid;
  const appVersion = app.version || 'v1.0';
  const versionKey = sanitizeFirebaseKey(appVersion);
  updates[`apps/${app.id}/versions/${versionKey}/lastRunAt`] = launchedAt;
  updates[`apps/${app.id}/versions/${versionKey}/runCount`] = Number(app.versions?.[versionKey]?.runCount || 0) + 1;
  updates[`users/${profile.user.uid}/lastAppLaunch`] = { appId: app.id, appName: app.name || '', launchedAt, token: tokenInfo?.token || '' };
  if (tokenInfo?.token) updates[`launchTokens/${tokenInfo.token}/used`] = true;
  if (tokenInfo?.token) updates[`launchTokens/${tokenInfo.token}/usedAt`] = launchedAt;
  await update(ref(db), updates);
  await push(ref(db, `appRunLogs/${profile.user.uid}/${app.id}`), {
    appId: app.id,
    appName: app.name || '',
    appVersion: app.version || 'v1.0',
    entryUrl: app.entryUrl || '',
    launchMode: app.launchMode || 'router',
    token: tokenInfo?.token || '',
    official: app.official === true || app.isOfficial === true,
    launchedAt
  });
  await push(ref(db, `executionLogs/${app.id}`), {
    userId: profile.user.uid,
    userEmail: profile.user.email || '',
    appId: app.id,
    appName: app.name || '',
    appVersion: app.version || 'v1.0',
    launchMode: app.launchMode || 'router',
    token: tokenInfo?.token || '',
    launchedAt
  });
}
