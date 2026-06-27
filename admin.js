import { listenSubApps, updateAppStatus } from './database.js';

const list = document.getElementById('admin-subapp-list');
const adminSection = document.getElementById('admin-section');

// 관리자 권한 확인 후 노출 로직 (간소화)
adminSection.style.display = 'block'; 

listenSubApps((apps) => {
    list.innerHTML = '';
    Object.keys(apps).forEach(id => {
        const app = apps[id];
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${app.name}</td><td><button id="btn-${id}">토글</button></td>`;
        list.appendChild(tr);
        tr.querySelector('button').onclick = () => updateAppStatus(id, !app.isActive);
    });
});