import { db } from './firebase.js';
import { ref, get, update, remove, onValue, set } from './database.js';

// 관리자 탭 제어 로직 인터랙션 구현
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active-content'));

        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        document.getElementById(target)?.classList.add('active-content');
    });
});

/**
 * 탭 1: 사용자 가입 신청 목록 실시간 렌더링 및 제어 로직
 */
export function renderUserList() {
    const userListContainer = document.getElementById('admin-user-list');
    if (!userListContainer) return;

    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
        userListContainer.innerHTML = '';
        
        if (!snapshot.exists()) {
            userListContainer.innerHTML = '<tr><td colspan="5" class="text-center">가입 신청된 유저가 없습니다.</td></tr>';
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const userId = childSnapshot.key;
            const user = childSnapshot.val();

            // 관리자 계정 본인은 목록에서 제어 제외
            if (user.role === 'admin') return;

            let statusBadgeClass = 'badge-pending';
            if (user.status === 'approved') statusBadgeClass = 'badge-approved';
            if (user.status === 'rejected') statusBadgeClass = 'badge-rejected';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(user.name)}</strong></td>
                <td>${escapeHtml(user.email)}</td>
                <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                <td><span class="badge-status ${statusBadgeClass}">${user.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn btn-success btn-sm btn-approve" data-id="${userId}" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; margin-right: 0.25rem;">승인</button>
                    <button class="btn btn-danger btn-sm btn-reject" data-id="${userId}" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">거절</button>
                </td>
            `;
            userListContainer.appendChild(tr);
        });

        // 가입 승인 / 거절 이벤트 리스너 바인딩 일괄 처리
        document.querySelectorAll('.btn-approve').forEach(b => {
            b.addEventListener('click', (e) => updateUserStatus(e.target.getAttribute('data-id'), 'approved'));
        });
        document.querySelectorAll('.btn-reject').forEach(b => {
            b.addEventListener('click', (e) => updateUserStatus(e.target.getAttribute('data-id'), 'rejected'));
        });
    });
}

/**
 * 사용자 상태 업데이트 유틸 함수
 */
async function updateUserStatus(userId, newStatus) {
    try {
        await update(ref(db, `users/${userId}`), { status: newStatus });
        alert(`사용자 상태가 성공적으로 [${newStatus}] 변경되었습니다.`);
    } catch (error) {
        alert("상태 변경 중 오류 발생: " + error.message);
    }
}

/**
 * 탭 2: 다중 서브 애플리케이션 등록 관리 리스트 구현 (STEP 6 완벽 준수)
 */
export function renderAppList() {
    const appListContainer = document.getElementById('admin-app-list');
    if (!appListContainer) return;

    const appsRef = ref(db, 'apps');
    onValue(appsRef, (snapshot) => {
        appListContainer.innerHTML = '';

        if (!snapshot.exists()) {
            appListContainer.innerHTML = '<tr><td colspan="6" class="text-center">등록된 서브 애플리케이션 라우팅이 없습니다.</td></tr>';
            return;
        }

        snapshot.forEach((childSnapshot) => {
            const appKey = childSnapshot.key;
            const app = childSnapshot.val();

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><code>${escapeHtml(app.id)}</code></td>
                <td>${escapeHtml(app.name)}</td>
                <td><a href="${escapeHtml(app.url)}" target="_blank">${escapeHtml(app.url)}</a></td>
                <td>${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-'}</td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="toggle-app-status" data-id="${appKey}" ${app.active ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <button class="btn btn-danger btn-delete-app" data-id="${appKey}" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">삭제</button>
                </td>
            `;
            appListContainer.appendChild(tr);
        });

        // 토글 제어 활성화 바인딩 (STEP 6)
        document.querySelectorAll('.toggle-app-status').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const appKey = e.target.getAttribute('data-id');
                const isChecked = e.target.checked;
                await update(ref(db, `apps/${appKey}`), { active: isChecked });
            });
        });

        // 서브 앱 라우팅 제거 바인딩 (STEP 6)
        document.querySelectorAll('.btn-delete-app').forEach(b => {
            b.addEventListener('click', async (e) => {
                if (confirm("해당 서브 애플리케이션 라우팅 메타데이터를 삭제하시겠습니까?")) {
                    const appKey = e.target.getAttribute('data-id');
                    await remove(ref(db, `apps/${appKey}`));
                }
            });
        });
    });
}

// 신규 서브 애플리케이션 메타데이터 등록 폼 제출 리스너 (STEP 6 정합성 유지)
document.getElementById('app-register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('app-id').value.trim();
    const name = document.getElementById('app-name').value.trim();
    const url = document.getElementById('app-url').value.trim();

    if (!id || !name || !url) return;

    try {
        // 중복 체크 검증 로직
        const checkRef = ref(db, `apps/${id}`);
        const snapshot = await get(checkRef);
        if (snapshot.exists()) {
            alert("이미 존재하는 애플리케이션 ID입니다. 다른 ID를 입력하세요.");
            return;
        }

        // 초기값 active: true로 세팅하여 완벽 등록 완료
        await set(ref(db, `apps/${id}`), {
            id,
            name,
            url,
            active: true,
            createdAt: Date.now()
        });

        alert(`[${name}] 서브 애플리케이션 라우팅 메타데이터 등록 완료!`);
        document.getElementById('app-register-form').reset();

    } catch (error) {
        alert("서브 앱 등록 실패: " + error.message);
    }
});

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}