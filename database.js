import { db, auth } from './firebase.js';
import { ref, set, onValue, update, get, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const writeTestBtn = document.getElementById('writeTestBtn');
const readTestBtn = document.getElementById('readTestBtn');
const deleteTestBtn = document.getElementById('deleteTestBtn');
const dbResult = document.getElementById('dbResult');

function renderDbToolMessage(message, type = 'info') {
  if (!dbResult) return;
  const prefix = type === 'blocked' ? '보안 차단' : type === 'success' ? '정상' : '안내';
  dbResult.innerText = `${prefix}: ${message}`;
}

function isPermissionDenied(error) {
  const text = String(error?.code || error?.message || error || '').toLowerCase();
  return text.includes('permission_denied') || text.includes('permission denied') || text.includes('permission-denied');
}

function handleDbToolError(error, actionLabel) {
  console.warn(`[MasterOS DevTool] ${actionLabel} blocked or failed`, error);
  if (isPermissionDenied(error)) {
    renderDbToolMessage('Firebase Rules가 개발용 DB 테스트를 차단했습니다. 운영 데이터 보호가 작동 중인 정상 상태입니다. 실제 기능 검수는 승인관리/데이터관리 화면에서 진행하세요.', 'blocked');
    return;
  }
  renderDbToolMessage(`${actionLabel} 실패: ${error?.message || error}`, 'blocked');
}


function renderProtectedMode(actionLabel) {
  renderDbToolMessage(`${actionLabel}는 현재 Firebase Rules 보호 모드에서 직접 실행하지 않습니다. 운영 데이터 보호가 정상 작동 중입니다. 실제 DB 쓰기/삭제 테스트는 임시 개발 Rules 또는 관리자 전용 테스트 경로가 준비된 뒤에만 실행하세요.`, 'blocked');
}

if (writeTestBtn) {
  writeTestBtn.addEventListener('click', async () => {
    renderProtectedMode('쓰기 테스트');
  });
}

if (readTestBtn) {
  readTestBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인이 필요합니다.');
    renderDbToolMessage(`로그인 확인 완료: ${user.email || user.uid}. 보호 모드에서는 /tests 읽기 요청을 보내지 않습니다.`, 'success');
  });
}

if (deleteTestBtn) {
  deleteTestBtn.addEventListener('click', async () => {
    renderProtectedMode('삭제 테스트');
  });
}


function sanitizeFirebaseKey(value, fallback = 'v1_0') {
    return String(value || fallback)
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
        || fallback;
}

function normalizeVersionsForFirebase(versions = {}) {
    return Object.keys(versions || {}).reduce((result, key) => {
        const safeKey = sanitizeFirebaseKey(key);
        result[safeKey] = { ...(versions[key] || {}), versionKey: safeKey };
        return result;
    }, {});
}

// ==========================================
// [STEP 6] 다중 서브 애플리케이션 라우팅 메타데이터 관리
// ==========================================

/**
 * 서브 애플리케이션 등록 및 라우팅 메타데이터 저장
 */
export async function registerSubApp(appId, appData) {
    const appRef = ref(db, 'apps/' + appId);
    const existingSnap = await get(appRef);
    const existingData = existingSnap.exists() ? existingSnap.val() : {};

    const appVersion = appData.version || existingData.version || 'v1.0';
    const versionKey = sanitizeFirebaseKey(appVersion);

    return set(appRef, {
        ...existingData,
        ...appData,
        manifest: {
            appId,
            version: appVersion,
            owner: appData.owner || existingData.owner || 'MasterOS',
            category: appData.category || existingData.category || 'General',
            icon: appData.icon || existingData.icon || '📦',
            entry: appData.entryUrl || existingData.entryUrl || appData.entry || '',
            launchType: appData.launchMode || existingData.launchMode || 'router',
            permissions: appData.permissions || existingData.permissions || ['approved-user'],
            publicVisible: appData.publicVisible !== false,
            official: appData.official === true || existingData.official === true
        },
        owner: appData.owner || existingData.owner || 'MasterOS',
        category: appData.category || existingData.category || 'General',
        permissionMode: appData.permissionMode || existingData.permissionMode || 'approved',
        permissions: appData.permissions || existingData.permissions || ['approved-user'],
        publicVisible: appData.publicVisible !== false,
        official: appData.official === true || existingData.official === true || false,
        updateNote: appData.updateNote || existingData.updateNote || '',
        versions: {
            ...normalizeVersionsForFirebase(existingData.versions || {}),
            [versionKey]: {
                version: appVersion,
                versionKey,
                entryUrl: appData.entryUrl || existingData.entryUrl || '',
                updateNote: appData.updateNote || existingData.updateNote || '',
                releasedAt: existingData.versions?.[versionKey]?.releasedAt || new Date().toISOString()
            }
        },
        runCount: Number(existingData.runCount || appData.runCount || 0),
        lastRunAt: existingData.lastRunAt || appData.lastRunAt || '',
        createdAt: existingData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
}

/**
 * 활성화된 모든 서브 애플리케이션 라우팅 데이터 실시간 구독
 */
export function listenSubApps(callback) {
    const appsRef = ref(db, 'apps');
    onValue(appsRef, (snapshot) => {
        const data = snapshot.val();
        callback(data || {});
    });
}

/**
 * 서브 앱 활성화/비활성화 상태 변경
 */
export function normalizeActiveStatus(value) {
    return value === true || value === 'true';
}

export function updateAppStatus(appId, isActive) {
    if (!appId) {
        return Promise.reject(new Error('앱 ID가 비어 있어 상태를 변경할 수 없습니다.'));
    }

    const appRef = ref(db, 'apps/' + appId);
    return update(appRef, {
        isActive: Boolean(isActive),
        updatedAt: new Date().toISOString()
    });
}


/**
 * STEP9-v4: 관리자 전용 서브 앱 삭제
 * apps/{appId} 메타데이터를 삭제합니다.
 */
export function deleteSubApp(appId) {
    if (!appId) {
        return Promise.reject(new Error('앱 ID가 비어 있어 삭제할 수 없습니다.'));
    }

    return remove(ref(db, 'apps/' + appId));
}

/**
 * STEP12-v2: 관리자 전용 앱 정보 수정
 * 기존 앱 등록 폼을 재사용해 소개글 버전 권한 노출 상태 등을 갱신합니다.
 */
export async function updateSubApp(appId, appData) {
    if (!appId) {
        return Promise.reject(new Error('앱 ID가 비어 있어 수정할 수 없습니다.'));
    }
    return registerSubApp(appId, appData);
}
