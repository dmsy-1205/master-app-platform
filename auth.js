import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js';
import { navigateByRole } from './routing.js';

// 1. 플랫폼 로그인 핸들러
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert(`${userCredential.user.email}님, 환영합니다!`);
        navigateByRole(userCredential.user);
    } catch (error) {
        console.error("로그인 에러:", error);
        alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.");
    }
});

// 2. 플랫폼 가입 이용 신청 핸들러
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (password.length < 6) {
        alert("비밀번호는 최소 6자리 이상이어야 합니다.");
        return;
    }

    try {
        // 계정 생성
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Realtime Database 유저 메타데이터 저장 관문 (기본값: 일반유저 'user', 승인대기 'pending')
        await set(ref(db, `users/${user.uid}`), {
            uid: user.uid,
            name: name,
            email: email,
            role: 'user', 
            status: 'pending',
            createdAt: Date.now()
        });

        alert("이용 신청서가 성공적으로 제출되었습니다. 관리자의 승인을 기다려주세요.");
        navigateByRole(user);

    } catch (error) {
        console.error("가입 신청 에러:", error);
        alert("이용 신청에 실패했습니다: " + error.message);
    }
});

// 3. 로그아웃 핸들러
document.getElementById('btn-logout')?.addEventListener('click', async () => {
    if (confirm("플랫폼에서 로그아웃 하시겠습니까?")) {
        try {
            await signOut(auth);
            alert("정상적으로 로그아웃 되었습니다.");
            navigateByRole(null);
        } catch (error) {
            alert("로그아웃 처리 중 에러 발생: " + error.message);
        }
    }
});