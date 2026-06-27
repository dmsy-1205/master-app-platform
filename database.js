// ... 기존 코드 유지
export function renderUserDashboard() {
    const gridContainer = document.getElementById('user-subapps-grid');
    if (!gridContainer) return;
    
    // 데이터 로드 시점 분리
    const appsRef = ref(db, 'apps');
    get(appsRef).then((snapshot) => {
        gridContainer.innerHTML = ''; // 중복 렌더링 방지
        if (snapshot.exists()) {
            const apps = snapshot.val();
            Object.keys(apps).forEach(id => {
                const app = apps[id];
                if (app.isActive) {
                    const card = document.createElement('div');
                    card.className = 'col-md-4 mb-3';
                    card.innerHTML = `
                        <div class="card p-3">
                            <h5>${app.name}</h5>
                            <a href="${app.path}" class="btn btn-sm btn-primary">진입</a>
                        </div>`;
                    gridContainer.appendChild(card);
                }
            });
        }
    });
}