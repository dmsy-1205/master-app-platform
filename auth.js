import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { renderUserDashboard } from './database.js';

// DOM 요소 캐싱
const authSection = document.getElementById('auth-section');
const applySection = document.getElementById('apply-section');
const userDashboardView = document.getElementById('user-dashboard-view');
const adminDashboardSection = document.getElementById('adminDashboardSection');
const runtimeContainer = document.getElementById('runtime-container');
const logoutBtn = document.getElementById('logoutBtn');
const userStatus = document.getElementById('userStatus');

// UI 가시성 일괄 제어 함수
function updateUIState(state) {
    const sections = {
        auth: authSection,
        apply: applySection,
        dashboard: userDashboardView,
        admin: adminDashboardSection,
        runtime: runtimeContainer
    };

    // 전체 초기화
    Object.values(sections).forEach(el => { if(el) el.style.display = 'none'; });

    // 상태별 활성화
    if (state.type === 'GUEST') {
        if(authSection) authSection.style.display = 'block';
        if(logoutBtn) logoutBtn.style.display = 'none';
    } else {
        if(logoutBtn) logoutBtn.style.display = 'block';
        if(state.type === 'ADMIN') {
            if(adminDashboardSection) adminDashboardSection.style.display = 'block';
            if(runtimeContainer) runtimeContainer.style.display = 'block';
        } else if (state.type === 'USER_APPROVED') {
            if(userDashboardView) userDashboardView.style.display = 'block';
            if(runtimeContainer) runtimeContainer.style.display = 'block';
            renderUserDashboard();
        } else {
            if(applySection) applySection.style.display = 'block';
        }
    }
}

// 상태 감지기
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        updateUIState({ type: 'GUEST' });
        if(userStatus) userStatus.innerText = "로그인이 필요합니다.";
        return;
    }

    try {
        // 관리자 확인
        const adminSnap = await get(ref(db, `admins/${user.uid}`));
        if (adminSnap.exists() && adminSnap.val() === true) {
            userStatus.innerText = `관리자 접속: ${user.email}`;
            updateUIState({ type: 'ADMIN' });
            return;
        }

        // 일반 사용자 승인 상태 확인
        const applySnap = await get(ref(db, `applications/${user.uid}`));
        if (applySnap.exists() && applySnap.val().status === 'approved') {
            userStatus.innerText = `사용자 접속: ${user.email} (정회원)`;
            updateUIState({ type: 'USER_APPROVED' });
        } else {
            userStatus.innerText = `사용자 접속: ${user.email} (승인 대기)`;
            updateUIState({ type: 'USER_PENDING' });
        }
    } catch (e) {
        console.error("Auth Guard Error:", e);
    }
});

// 로그아웃 이벤트
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => signOut(auth).then(() => location.reload()));
}