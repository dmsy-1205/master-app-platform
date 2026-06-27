import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const userStatus = document.getElementById('userStatus');
const logoutBtn = document.getElementById('logoutBtn');
const adminDashboardSection = document.getElementById('adminDashboardSection');

const publicSections = document.querySelectorAll('[data-auth="public"]');
const privateSections = document.querySelectorAll('[data-auth="private"]');
const adminSections = document.querySelectorAll('[data-auth="admin"]');

async function configureSessionPersistence() {
  try {
    await setPersistence(auth, browserSessionPersistence);
  } catch (error) {
    console.warn('세션 유지 방식 설정 실패:', error);
  }
}

function setVisible(elements, visible) {
  elements.forEach((el) => {
    el.style.display = visible ? '' : 'none';
  });
}

function publishAuthState(user, roleInfo) {
  window.MasterAuthState = {
    user,
    isLoggedIn: Boolean(user),
    isAdmin: Boolean(roleInfo?.isAdmin),
    role: roleInfo?.role || 'guest',
    adminSource: roleInfo?.source || 'none'
  };
  window.dispatchEvent(new CustomEvent('master-auth-role-changed', { detail: window.MasterAuthState }));
}

async function resolveRoleInfo(user) {
  if (!user) return { isAdmin: false, role: 'guest', source: 'none' };

  const [adminSnap, userSnap] = await Promise.all([
    get(ref(db, `admins/${user.uid}`)),
    get(ref(db, `users/${user.uid}`))
  ]);

  const userData = userSnap.exists() ? userSnap.val() : {};
  const adminFlag = adminSnap.exists() && adminSnap.val() === true;
  const roleAdmin = userData.role === 'admin';
  const isAdmin = adminFlag || roleAdmin;

  if (isAdmin) {
    const syncUpdates = {};
    if (!adminFlag) syncUpdates[`admins/${user.uid}`] = true;
    if (userData.role !== 'admin') syncUpdates[`users/${user.uid}/role`] = 'admin';
    if (Object.keys(syncUpdates).length) {
      await update(ref(db), syncUpdates);
    }
  }

  return {
    isAdmin,
    role: isAdmin ? 'admin' : (userData.role || 'user'),
    source: adminFlag ? 'admins' : roleAdmin ? 'users.role' : 'users'
  };
}

async function applyScreenState(user) {
  if (!user) {
    setVisible(publicSections, true);
    setVisible(privateSections, false);
    setVisible(adminSections, false);
    if (adminDashboardSection) adminDashboardSection.style.display = 'none';
    if (userStatus) userStatus.innerText = '로그아웃됨 (인증 세션 없음)';
    publishAuthState(null, null);
    return;
  }

  setVisible(publicSections, false);
  setVisible(privateSections, true);

  try {
    const roleInfo = await resolveRoleInfo(user);
    setVisible(adminSections, roleInfo.isAdmin);
    if (adminDashboardSection) adminDashboardSection.style.display = roleInfo.isAdmin ? '' : 'none';
    if (userStatus) {
      userStatus.innerText = `로그인 상태: ${user.email} (${user.uid}) / 권한: ${roleInfo.isAdmin ? '관리자' : '일반 사용자'}`;
    }
    publishAuthState(user, roleInfo);
  } catch (error) {
    console.error('권한 확인 실패:', error);
    setVisible(adminSections, false);
    if (adminDashboardSection) adminDashboardSection.style.display = 'none';
    if (userStatus) userStatus.innerText = `로그인 상태: ${user.email} / 권한 확인 실패: ${error.message}`;
    publishAuthState(user, { isAdmin: false, role: 'user', source: 'error' });
  }
}

if (signupBtn) {
  signupBtn.addEventListener('click', async () => {
    if (!signupEmail.value.trim() || !signupPassword.value.trim()) {
      return alert('회원가입용 이메일과 비밀번호를 모두 입력해주세요.');
    }
    try {
      await configureSessionPersistence();
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
      await set(ref(db, `users/${userCredential.user.uid}`), {
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        userStatus: 'registered',
        role: 'user'
      });
      alert('회원가입 성공!');
    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    if (!loginEmail.value.trim() || !loginPassword.value.trim()) {
      return alert('로그인할 이메일과 비밀번호를 채워주세요.');
    }
    try {
      await configureSessionPersistence();
      await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
      alert('로그인 성공!');
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      alert('로그아웃 성공!');
    } catch (error) {
      alert('로그아웃 실패: ' + error.message);
    }
  });
}

configureSessionPersistence().finally(() => {
  onAuthStateChanged(auth, (user) => {
    applyScreenState(user);
  });
});
