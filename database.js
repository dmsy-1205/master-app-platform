import { db } from './firebase.js';
import { ref, set, onValue, update, get, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ==========================================
// [STEP 6] 다중 서브 애플리케이션 라우팅 메타데이터 관리
// ==========================================

/**
 * 서브 애플리케이션 등록 및 라우팅 메타데이터 저장
 */
export function registerSubApp(appId, appData) {
    const appRef = ref(db, 'apps/' + appId);
    return set(appRef, {
        ...appData,
        updatedAt: new Date().toISOString()
    });
}

/**
 * 활성화된 모든 서브 애플리케이션 라우팅 데이터 실시간 구독
 */
export function listenSubApps(callback) {
    const appsRef = ref(db, 'apps');
    onValue(appsRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback({});
        }
    });
}

/**
 * 특정 서브 앱 활성화/비활성화 상태 수정 업데이트
 */
export function updateAppStatus(appId, isActive) {
    const appRef = ref(db, `apps/${appId}`);
    return update(appRef, { isActive: isActive });
}

// ==========================================
// [STEP 7 핵심] 일반 사용자용 대시보드 동적 그리드 바인딩
// ==========================================
export function renderUserDashboard() {
    const gridContainer = document.getElementById('user-subapps-grid');
    const countDisplay = document.getElementById('user-active-app-count');
    
    if (!gridContainer) return;

    listenSubApps((apps) => {
        gridContainer.innerHTML = '';
        let activeCount = 0;
        const keys = Object.keys(apps);

        if (keys.length === 0) {
            gridContainer.innerHTML = '<div class="text-muted p-3">플랫폼에 등록된 애플리케이션이 아직 없습니다.</div>';
            if(countDisplay) countDisplay.textContent = '0';
            return;
        }

        keys.forEach(appId => {
            const app = apps[appId];
            
            // 오직 관리자가 활성화(isActive === true) 처리한 서브 앱만 선별 노출
            if (app.isActive) {
                activeCount++;
                
                const col = document.createElement('div');
                col.className = 'col-md-6';
                col.innerHTML = `
                    <div class="user-app-card shadow-sm">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <span class="fs-4">${app.icon || '🌐'}</span>
                                <h4 class="m-0 h5 fw-bold">${app.name}</h4>
                            </div>
                            <p class="text-muted small mb-2" style="min-height: 40px;">${app.description || '등록된 상세 설명 요약 명세가 없습니다.'}</p>
                            <div class="mb-3"><code class="bg-light p-1 rounded small text-primary">${app.path}</code></div>
                        </div>
                        <a href="${app.path}" class="btn btn-sm btn-outline-primary w-100 fw-bold">앱 가상 런타임 진입 🚀</a>
                    </div>
                `;
                gridContainer.appendChild(col);
            }
        });

        if(countDisplay) countDisplay.textContent = activeCount;
        if (activeCount === 0) {
            gridContainer.innerHTML = '<div class="text-muted p-3">🔒 현재 사용할 수 있도록 허가된 활성 서브 앱이 존재하지 않습니다.</div>';
        }
    });
}