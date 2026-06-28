import { auth, db } from './firebase.js';
import { ref, get, update, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { normalizeActiveStatus } from './database.js';

function sanitizeFirebaseKey(value, fallback = 'v1_0') {
  return String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
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
  if (!user) return { user: null, userData: {}, isAdmin: false, approvalStatus: 'none', appAccess: {} };
  const [adminSnap, userSnap, appSnap, appAccessSnap] = await Promise.all([
    get(ref(db, `admins/${user.uid}`)),
    get(ref(db, `users/${user.uid}`)),
    get(ref(db, `applications/${user.uid}`)),
    get(ref(db, `userAppAccess/${user.uid}`))
  ]);
  const userData = userSnap.exists() ? userSnap.val() : {};
  const appData = appSnap.exists() ? appSnap.val() : {};
  const appAccess = appAccessSnap.exists() ? appAccessSnap.val() : {};
  const isAdmin = (adminSnap.exists() && adminSnap.val() === true) || userData.role === 'admin';
  return { user, userData, isAdmin, approvalStatus: appData.status || userData.userStatus || 'none', applicationData: appData, appAccess };
}

function hasAppAccess(app, current) {
  const uid = current?.user?.uid;
  const appId = app?.id || app?.appId;
  if (!uid || !appId) return false;
  const direct = app?.allowedUsers?.[uid];
  if (direct === true || direct?.active === true || direct?.status === 'approved') return true;
  const access = current?.appAccess?.[appId];
  if (access === true || access?.active === true || access?.status === 'approved') return true;
  const lastRequest = current?.applicationData;
  if (lastRequest?.requestedAppId === appId && lastRequest?.status === 'approved') return true;
  return false;
}

export async function checkAppPermission(app, profile = null) {
  const current = profile || await getCurrentUserProfile();
  if (!current.user) return { allowed: false, reason: '로그인이 필요합니다.' };
  if (!normalizeActiveStatus(app?.isActive)) return { allowed: false, reason: '현재 비활성화된 앱입니다.' };
  if (current.isAdmin) return { allowed: true, reason: '관리자 권한' };
  const permissionMode = app.permissionMode || 'approved';
  const appAccess = hasAppAccess(app, current);
  if (permissionMode === 'public') return { allowed: true, reason: '공개 앱' };
  if (appAccess) return { allowed: true, reason: '앱별 승인 권한' };
  if (permissionMode === 'custom') return { allowed: false, reason: '사용자별 접근 권한이 없습니다.' };
  return { allowed: false, reason: '이 앱은 신청 후 관리자 승인이 필요합니다.' };
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
