import { db, auth } from './firebase.js';
import { ref, set, get, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js';

/**
 * [STEP 7 핵심] 일반 사용자용 대시보드 서브 애플리케이션 카드 그리드 출력 로직
 */
export function renderUserDashboard() {
    const gridContainer = document.getElementById('user-sub-apps-grid');
    const countDisplay = document.getElementById('user-app-count');
    
    if (!gridContainer) return;

    // 실시간으로 활성화(active) 처리된 서브 애플리케이션 목록만 가져옴
    const appsRef = ref(db, 'apps');
    onValue(appsRef, (snapshot) => {
        gridContainer.innerHTML = '';
        let activeAppCount = 0;

        if (!snapshot.exists()) {
            gridContainer.innerHTML = '<div class="loading-placeholder">현재 플랫폼에 등록된 서브 애플리케이션이 존재하지 않습니다.</div>';
            if (countDisplay) countDisplay.textContent = '0';
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const appData = childSnapshot.val();
            
            // 오직 active가 true로 켜진 서브 앱만 일반 사용자에게 노출 (STEP 6 정합성 연결)
            if (appData.active === true) {
                activeAppCount++;

                const card = document.createElement('div');
                card.className = 'card app-card';
                card.innerHTML = `
                    <div class="app-card-body">
                        <h4>${escapeHtml(appData.name)}</h4>
                        <div class="app-card-meta">ID: ${escapeHtml(appData.id)}</div>
                    </div>
                    <a href="${escapeHtml(appData.url)}" target="_blank" class="btn btn-primary btn-block" style="text-decoration: none; text-align: center;">
                        애플리케이션 진입 🚀
                    </a>
                `;
                gridContainer.appendChild(card);
            }
        });

        if (countDisplay) {
            countDisplay.textContent = activeAppCount.toString();
        }

        if (activeAppCount === 0) {
            gridContainer.innerHTML = '<div class="loading-placeholder">🔒 현재 접근 가능한 활성화된 서브 애플리케이션이 없습니다. 관리자 승인을 기다려주세요.</div>';
        }
    }, (error) => {
        console.error("대시보드 데이터 로드 에러:", error);
        gridContainer.innerHTML = '<div class="loading-placeholder" style="color: var(--danger-color);">데이터를 가져오는 중 오류가 발생했습니다.</div>';
    });
}

/**
 * XSS 공격 방지를 위한 기본 HTML 이스케이프 유틸 함수
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 관리자 콘솔을 위해 기존 export 유지 모듈화 확보
export { ref, set, get, update, remove, onValue };