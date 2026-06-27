import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { renderUserDashboard } from './database.js';

const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const userStatus = document.getElementById('userStatus');
const logoutBtn = document.getElementById('logoutBtn');

const authSection = document.getElementById('auth-section');
const applySection = document.getElementById('apply-section');
const userDashboardView = document.getElementById('user-dashboard-view');
const adminDashboardSection = document.getElementById('adminDashboardSection');
const runtimeContainer = document.getElementById('runtime-container');

// 회원가입
if (signupBtn) {
  signupBtn.addEventListener('click', async () => {
    if (!signupEmail.value.trim() || !signupPassword.value.trim()) {
      return alert('회원가입용 이메일과 비밀번호를 모두 입력해주세요.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
      await set(ref(db, `users/${userCredential.user.uid}`), {
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        userStatus: 'registered' 
      });
      alert('회원가입 성공!');
    } catch (error) { alert('회원가입 실패: ' + error.message); }
  });
}

// 로그인
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    if (!loginEmail.value.trim() || !loginPassword.value.trim()) {
      return alert('로그인할 이메일과 비밀번호를 채워주세요.');
    }
    try {
      await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
      alert('로그인 성공!');
    } catch (error) { alert('로그인 실패: ' + error.message); }
  });
}

// 로그아웃
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      alert('로그아웃 성공!');
      window.location.hash = '';
      location.reload();
    } catch (error) { alert('로그아웃 실패: ' + error.message); }
  });
}

// 실시간 인증 가드 시스템
onAuthStateChanged(auth, async (user) => {
  // 모든 동적 섹션 숨김 초기화
  if(authSection) authSection.style.display = 'none';
  if(applySection) applySection.style.display = 'none';
  if(userDashboardView) userDashboardView.style.display = 'none';
  if(adminDashboardSection) adminDashboardSection.style.display = 'none';
  if(runtimeContainer) runtimeContainer.style.display = 'none';
  if(logoutBtn) logoutBtn.style.display = 'none';

  if (user) {
    if(userStatus) userStatus.innerText = `접속 계정: ${user.email} (조회 중...)`;
    if(logoutBtn) logoutBtn.style.display = 'block';

    try {
      // 1. 관리자 권한 조회
      const adminSnapshot = await get(ref(db, `admins/${user.uid}`));
      const isAdmin = adminSnapshot.exists() && adminSnapshot.val() === true;

      if (isAdmin) {
        if(userStatus) userStatus.innerText = `접속 계정: ${user.email} [시스템 최고 관리자] 👑`;
        if(adminDashboardSection) adminDashboardSection.style.display = 'block';
        if(runtimeContainer) runtimeContainer.style.display = 'flex'; // 관리자도 런타임 뷰 확인 가능
        return;
      }

      // 2. 일반 사용자 이용 승인 현황 조회
      const applySnapshot = await get(ref(db, `applications/${user.uid}`));
      
      if (applySnapshot.exists()) {
        const applyData = applySnapshot.val();
        
        if (applyData.status === 'approved') {
          // 승인 완료된 유저 -> 대시보드 가드 해제 및 마이크로 런타임 활성화
          if(userStatus) userStatus.innerText = `접속 계정: ${user.email} [플랫폼 정회원] ✅`;
          if(userDashboardView) userDashboardView.style.display = 'block';
          if(runtimeContainer) runtimeContainer.style.display = 'flex';
          
          // STEP 7 사용자 대시보드 렌더링 호출
          renderUserDashboard();
        } else if (applyData.status === 'rejected') {
          if(userStatus) userStatus.innerText = `접속 계정: ${user.email} [승인 거절됨] ❌`;
          if(applySection) applySection.style.display = 'block';
        } else {
          // pending 상태
          if(userStatus) userStatus.innerText = `접속 계정: ${user.email} [승인 검토 대기 중] ⏳`;
          if(applySection) applySection.style.display = 'block';
        }
      } else {
        // 가입은 했으나 신청서를 아직 제출하지 않은 상태
        if(userStatus) userStatus.innerText = `접속 계정: ${user.email} [권한 미신청 회원]`;
        if(applySection) applySection.style.display = 'block';
      }

    } catch (e) {
      console.error(e);
      if(userStatus) userStatus.innerText = "사용자 세션 상태 검증 중 오류 발생";
    }
  } else {
    // 로그아웃 상태
    if(userStatus) userStatus.innerText = "로그인이 필요합니다.";
    if(authSection) authSection.style.display = 'block';
  }
});