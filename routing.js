/**
 * Master App Platform - STEP 6 핵심 동적 라우팅 엔진
 * Firebase 메타데이터를 기반으로 클라이언트 사이드 라우팅 및 샌드박스 렌더링을 제어합니다.
 */
import { listenSubApps, normalizeActiveStatus } from './database.js';

class MasterRouter {
    constructor() {
        this.routes = {};
        this.viewContainer = document.getElementById('main-runtime-view');
        this.navContainer = document.getElementById('dynamic-nav-menu');
        this.init();
    }

    init() {
        // Firebase 등재 라우팅 메타데이터 실시간 감지 및 라우팅 테이블 맵핑
        listenSubApps((apps) => {
            this.routes = {};
            if (this.navContainer) this.navContainer.innerHTML = '';
            
            Object.keys(apps).forEach(appId => {
                const app = apps[appId];
                if (normalizeActiveStatus(app.isActive)) {
                    this.routes[app.path] = app;
                    this.renderNavigationItem(app);
                }
            });
            // 메타데이터 업데이트 시 현재 경로 재확인
            this.resolveRoute(window.location.hash);
        });

        // 해시 변경 이벤트 감지 및 라우팅 트리거
        window.addEventListener('hashchange', () => {
            this.resolveRoute(window.location.hash);
        });
    }

    renderNavigationItem(app) {
        if (!this.navContainer) return;
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<a class="nav-link" href="#${app.path}">${app.icon} ${app.name}</a>`;
        this.navContainer.appendChild(li);
    }

    async resolveRoute(hash) {
        const path = hash.replace('#', '') || '/';
        const targetApp = this.routes[path];

        if (!this.viewContainer) return;

        if (targetApp) {
            this.viewContainer.innerHTML = `
                <div class="app-loading-fallback d-flex align-items-center gap-2">
                    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                    <span>Sub Application [${targetApp.name}] 로딩 중...</span>
                </div>
            `;
            try {
                // 마이크로 앱 진입점 엔트리 원격/로컬 페칭 및 마운트 연동
                const response = await fetch(targetApp.entryUrl);
                if (!response.ok) throw new Error("애플리케이션 소스를 불러올 수 없습니다.");
                const htmlContent = await response.text();
                
                // 런타임 뷰 내부 격리 삽입
                this.viewContainer.innerHTML = htmlContent;
                
                // 앱 내부 동적 스크립트 실행 분석기 작동
                this.executeInjectedScripts(this.viewContainer);
            } catch (error) {
                this.viewContainer.innerHTML = `
                    <div class="alert alert-danger py-2">
                        <strong>⚠️ Sub-App 로딩 실패:</strong> ${error.message}
                    </div>
                `;
            }
        } else {
            if (path === '/' || path === '') {
                this.viewContainer.innerHTML = '<h3>Master App Platform 메인 대시보드</h3><p>좌측 메뉴에서 서브 애플리케이션을 선택하세요.</p>';
            } else {
                this.viewContainer.innerHTML = '<h3>404 Not Found</h3><p>존재하지 않거나 비활성화된 서브 애플리케이션 라우팅입니다.</p>';
            }
        }
    }

    executeInjectedScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.text = oldScript.text;
            }
            newScript.type = oldScript.type || 'text/javascript';
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
        });
    }
}

// 싱글톤 라우터 인스턴스 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.AppRouter = new MasterRouter();
});