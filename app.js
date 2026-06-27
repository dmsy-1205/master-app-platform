// 기존 앱 실행 로직 유지 및 UI 렌더링 통합
const AppPlatform = {
    init: function() {
        console.log("Platform 2.0 엔진 시작");
        this.renderDashboard();
    },
    renderDashboard: function() {
        const root = document.getElementById('app-root');
        root.innerHTML = `
            <h1>환영합니다, 박대명 님</h1>
            <div class="grid" id="app-list">
                <!-- 기존 앱 데이터가 여기에 렌더링됨 -->
            </div>
        `;
    }
};
document.addEventListener('DOMContentLoaded', () => AppPlatform.init());