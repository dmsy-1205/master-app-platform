import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js';
import { renderUserDashboard } from './database.js';
import { renderUserList, renderAppList } from './admin.js';

// 화면에 있는 모든 가상 페이지 섹션 엘리먼트 정의
const pages = {
    login: document.getElementById('login-page'),
    register: document.getElementById('register-page'),
    status: document.getElementById('status-page'),
    dashboard: document.getElementById('user-dashboard-page'),
    admin: document.getElementById('admin-page')
};

// 네비게이션 관련 엘리먼트
const userInfoDisplay = document.getElementById('user-info-display');
const btnLogout = document.getElementById('btn-logout');

/**
 * 모든 페이지 섹션을 보이지 않게 처리하는 초기화 로직
 */
function hideAllPages() {
    Object.values(pages).forEach(page => {
        if (page) page.classList.add('hide');
    });
}

/**
 * 사용자의 권한 등급 및 승인 상태(Approved/Pending/Rejected)를 검증하여 동적 화면 라우팅 처리
 * @param {Object} user - Firebase Auth 유저 객체
 */
export async function navigateByRole(user) {
    hideAllPages();

    if (!user) {
        // 1. 비인증 상태 -> 로그인 화면 활성화
        userInfoDisplay.textContent = '';
        btnLogout.classList.add('hide');
        pages.login.classList.remove('hide');
        return;
    }

    // 로그인된 상태 노출
    btnLogout.classList.remove('hide');

    try {
        // Realtime Database에서 해당 사용자 메타데이터 확인
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            // DB 기록이 아직 생성 안 된 경우 기본 대기페이지로 안내
            userInfoDisplay.textContent = `${user.email} (미등록)`;
            showStatusPage('⏳', '이용 권한 확인 중', '사용자 등록 정보를 확인하는 중입니다.');
            return;
        }

        const userData = snapshot.val();
        const role = userData.role;
        const status = userData.status;
        const userName = userData.name || '사용자';

        userInfoDisplay.textContent = `${userName}님 (${role === 'admin' ? '관리자' : '일반 회원'})`;

        // 2. 최고 관리자 권한 확인
        if (role === 'admin') {
            pages.admin.classList.remove('hide');
            // 관리자 데이터 목록 렌더링 동기화
            renderUserList();
            renderAppList();
            return;
        }

        // 3. 일반 사용자 승인 상태(status) 검증 분기 처리
        if (status === 'approved') {
            // [STEP 7] 승인 완료 유저 -> 전용 대시보드로 이동
            pages.dashboard.classList.remove('hide');
            renderUserDashboard(); // 대시보드 서브 앱 리스트 출력
        } else if (status === 'pending') {
            // 대기중 상태
            showStatusPage('⏳', '플랫폼 승인 대기 중', '관리자가 가입 신청을 검토하고 있습니다. 잠시만 기다려 주세요.');
        } else if (status === 'rejected') {
            // 거절 상태
            showStatusPage('❌', '플랫폼 이용 승인 거절', '안타깝게도 가입 승인이 거절되었습니다. 관리자에게 문의하세요.');
        }

    } catch (error) {
        console.error("라우팅 처리 중 심각한 오류 발생:", error);
        showStatusPage('⚠️', '시스템 오류', '라우팅 메타데이터를 파싱하는 도중 에러가 발생했습니다.');
    }
}

/**
 * 상태 안내 전용 서브 페이지 유틸리티 함수
 */
function showStatusPage(icon, title, message) {
    pages.status.classList.remove('hide');
    document.getElementById('status-icon').textContent = icon;
    document.getElementById('status-title').textContent = title;
    document.getElementById('status-message').textContent = message;
}

// 회원가입 신청 및 로그인 토글 내비게이션 바인딩
document.getElementById('go-to-register')?.addEventListener('click', () => {
    hideAllPages();
    pages.register.classList.remove('hide');
});

document.getElementById('go-to-login')?.addEventListener('click', () => {
    hideAllPages();
    pages.login.classList.remove('hide');
});

// 상태 새로고침 버튼 바인딩
document.getElementById('btn-refresh-status')?.addEventListener('click', () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        navigateByRole(currentUser);
    }
});

// 핵심 인증 상태 변경 구독 연동 관문 (앱 기동 시점 작동)
onAuthStateChanged(auth, (user) => {
    navigateByRole(user);
});