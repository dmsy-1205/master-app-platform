import { db, auth } from './firebase.js';
import { ref, set, onValue, update, get, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const writeTestBtn = document.getElementById('writeTestBtn');
const readTestBtn = document.getElementById('readTestBtn');
const deleteTestBtn = document.getElementById('deleteTestBtn');
const dbResult = document.getElementById('dbResult');

if (writeTestBtn) {
  writeTestBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인이 필요합니다.');
    try {
      await set(ref(db, `tests/${user.uid}`), { message: "STEP 2 테스트 성공", timestamp: new Date().toISOString() });
      dbResult.innerText = "데이터 쓰기 완료!";
    } catch (e) { dbResult.innerText = "에러: " + e.message; }
  });
}

if (readTestBtn) {
  readTestBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인이 필요합니다.');
    try {
      const snapshot = await get(ref(db, `tests/${user.uid}`));
      dbResult.innerText = snapshot.exists() ? JSON.stringify(snapshot.val(), null, 2) : "데이터가 없습니다.";
    } catch (e) { dbResult.innerText = "에러: " + e.message; }
  });
}

if (deleteTestBtn) {
  deleteTestBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인이 필요합니다.');
    try {
      await remove(ref(db, `tests/${user.uid}`));
      dbResult.innerText = "데이터 삭제 완료!";
    } catch (e) { dbResult.innerText = "에러: " + e.message; }
  });
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

    return set(appRef, {
        ...existingData,
        ...appData,
        manifest: {
            appId,
            version: appData.version || existingData.version || 'v1.0',
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
            ...(existingData.versions || {}),
            [appData.version || existingData.version || 'v1.0']: {
                version: appData.version || existingData.version || 'v1.0',
                entryUrl: appData.entryUrl || existingData.entryUrl || '',
                updateNote: appData.updateNote || existingData.updateNote || '',
                releasedAt: existingData.versions?.[appData.version || existingData.version || 'v1.0']?.releasedAt || new Date().toISOString()
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
