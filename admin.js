import { registerSubApp, updateAppStatus } from './database.js';

function initAdminSubAppManager() {
    const registerAppBtn = document.getElementById('registerAppBtn');
    
    if (registerAppBtn) {
        registerAppBtn.addEventListener('click', async () => {
            const id = document.getElementById('newAppId').value.trim();
            const name = document.getElementById('newAppName').value.trim();
            const path = document.getElementById('newAppPath').value.trim();
            const entryUrl = document.getElementById('newAppEntry').value.trim();
            const icon = document.getElementById('newAppIcon').value.trim();
            const description = document.getElementById('newAppDesc').value.trim();

            if (!id || !name || !path || !entryUrl) {
                return alert('앱 ID, 이름, 라우팅 경로, 엔트리 URL은 필수 입력 값입니다.');
            }

            try {
                await registerSubApp(id, {
                    id, name, path, entryUrl,
                    icon: icon || '🌐',
                    description: description || '',
                    isActive: true
                });
                alert(`[${name}] 서브 웹앱 라우팅 테이블 등재 완료!`);
                location.reload();
            } catch (error) {
                alert('등록 오류: ' + error.message);
            }
        });
    }
}

// 관리자 화면 리스트 그리기 연동 (기존 구조 완전 유지)
import { listenSubApps } from './database.js';
const appListContainer = document.getElementById('admin-subapp-list');

if (appListContainer) {
    listenSubApps((apps) => {
        appListContainer.innerHTML = '';
        const keys = Object.keys(apps);
        
        if (keys.length === 0) {
            appListContainer.innerHTML = '<tr><td colspan="5" class="text-center text-muted">등록된 마이크로 서브 앱이 없습니다.</td></tr>';
            return;
        }

        keys.forEach(appId => {
            const app = apps[appId];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.icon || '🌐'} <strong>${app.name}</strong> (${appId})</td>
                <td><code>${app.path}</code></td>
                <td><small class="text-muted">${app.entryUrl}</small></td>
                <td>
                    <span class="badge ${app.isActive ? 'bg-success' : 'bg-secondary'}">
                        ${app.isActive ? '활성화' : '비활성화'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm ${app.isActive ? 'btn-warning' : 'btn-success'} toggle-status-btn" data-id="${appId}" data-status="${app.isActive}">
                        ${app.isActive ? '비활성화' : '활성화'}
                    </button>
                </td>
            `;
            appListContainer.appendChild(tr);
        });

        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const currentStatus = e.target.getAttribute('data-status') === 'true';
                await updateAppStatus(id, !currentStatus);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initAdminSubAppManager();
});