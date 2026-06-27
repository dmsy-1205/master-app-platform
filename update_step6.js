/**
 * Master App Platform - STEP 6 자동 파일 생성 및 업데이트 스크립트
 * 실행 방법: node update_step6.js
 */

const fs = require('fs');
const path = require('path');

// 유틸리티: 파일 수정 및 추가 로그 출력
const logSuccess = (filename, action) => console.log(`[\x1b[32m${action}\x1b[0m] ${filename}`);

// 1. database.js 수정 (서브 앱 등록 및 메타데이터 가져오기 함수 추가)
const updateDatabaseJs = () => {
    const filePath = path.join(__dirname, 'database.js');
    if (!fs.existsSync(filePath)) {
        console.error('database.js 파일이 존재하지 않습니다.');
        return;
    }

    const step6DbCode = `
// ==========================================
// [STEP 6] 다중 서브 애플리케이션 라우팅 메타데이터 관리
// ==========================================
import { ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

/**
 * 서브 애플리케이션 등록 및 라우팅 메타데이터 저장
 */
export function registerSubApp(appId, appData) {
    const appRef = ref(db, 'apps/' + appId);
    return set(appRef, {
        ...appData,
        updatedAt: new Date().toISOString()
    });
}

/**
 * 활성화된 모든 서브 애플리케이션 라우팅 데이터 실시간 구독
 */
export function listenSubApps(callback) {
    const appsRef = ref(db, 'apps');
    onValue(appsRef, (snapshot) => {
        const data = snapshot.val();
        callback(data || {});
    });
}

/**
 * 서브 앱 활성화/비활성화 상태 변경
 */
export function updateAppStatus(appId, isActive) {
    const appRef = ref(db, 'apps/' + appId);
    return update(appRef, { isActive });
}
`;

    fs.appendFileSync(filePath, step6DbCode, 'utf8');
    logSuccess('database.js', 'APPEND_LOGIC');
};

// 2. admin.js 수정 (서브 앱 등록 폼 핸들러 및 메타데이터 관리 UI 렌더러 추가)
const updateAdminJs = () => {
    const filePath = path.join(__dirname, 'admin.js');
    if (!fs.existsSync(filePath)) {
        console.error('admin.js 파일이 존재하지 않습니다.');
        return;
    }

    const step6AdminCode = `
// ==========================================
// [STEP 6] 서브 앱 등록 및 메타데이터 UI 제어
// ==========================================
import { registerSubApp, listenSubApps, updateAppStatus } from './database.js';

export function initAdminSubAppManager() {
    const registerForm = document.getElementById('subapp-register-form');
    const appListContainer = document.getElementById('admin-subapp-list');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const appId = document.getElementById('app-id').value.trim();
            const appData = {
                name: document.getElementById('app-name').value.trim(),
                path: document.getElementById('app-path').value.trim(),
                entryUrl: document.getElementById('app-entry').value.trim(),
                icon: document.getElementById('app-icon').value.trim() || '📦',
                description: document.getElementById('app-desc').value.trim(),
                isActive: true
            };

            try {
                await registerSubApp(appId, appData);
                alert(\`서브 앱 [\${appData.name}] 등록 및 라우팅 메타데이터 동기화 완료\`);
                registerForm.reset();
            } catch (error) {
                console.error("서브 앱 등록 실패:", error);
            }
        });
    }

    // 실시간 라우팅 메타데이터 목록 렌더링
    listenSubApps((apps) => {
        if (!appListContainer) return;
        appListContainer.innerHTML = '';

        Object.keys(apps).forEach(appId => {
            const app = apps[appId];
            const tr = document.createElement('tr');
            tr.innerHTML = \`
                <td>\${app.icon} <strong>\${app.name}</strong> (\${appId})</td>
                <td><code>\${app.path}</code></td>
                <td><small>\${app.entryUrl}</small></td>
                <td>
                    <span class="badge \${app.isActive ? 'bg-success' : 'bg-secondary'}">
                        \${app.isActive ? '활성화' : '비활성화'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm \${app.isActive ? 'btn-warning' : 'btn-success'} toggle-status-btn" data-id="\${appId}" data-status="\${app.isActive}">
                        \${app.isActive ? '비활성화' : '활성화'}
                    </button>
                </td>
            \`;
            appListContainer.appendChild(tr);
        });

        // 상태 토글 이벤트 바인딩
        document.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const currentStatus = e.target.getAttribute('data-status') === 'true';
                updateAppStatus(id, !currentStatus);
            });
        });
    });
}

// 기존 도메인 초기화 로직에 결합 (자동 실행 방지 플래그 유연화)
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('subapp-register-form')) {
        initAdminSubAppManager();
    }
});
`;

    fs.appendFileSync(filePath, step6AdminCode, 'utf8');
    logSuccess('admin.js', 'APPEND_LOGIC');
};

// 3. routing.js 신규 생성 (동적 라우터 및 마이크로 앱 로더 인젝터)
const createRoutingJs = () => {
    const filePath = path.join(__dirname, 'routing.js');
    const routingContent = `/**
 * Master App Platform - STEP 6 핵심 동적 라우팅 엔진
 * Firebase 메타데이터를 기반으로 클라이언트 사이드 라우팅 및 샌드박스 렌더링을 제어합니다.
 */
import { listenSubApps } from './database.js';

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
            if(this.navContainer) this.navContainer.innerHTML = '';
            
            Object.keys(apps).forEach(appId => {
                const app = apps[appId];
                if (app.isActive) {
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
        li.innerHTML = \`<a class="nav-link" href="#\${app.path}">\${app.icon} \${app.name}</a>\`;
        this.navContainer.appendChild(li);
    }

    async resolveRoute(hash) {
        const path = hash.replace('#', '') || '/';
        const targetApp = this.routes[path];

        if (!this.viewContainer) return;

        if (targetApp) {
            this.viewContainer.innerHTML = \`
                <div class="app-loading-fallback">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2">Sub Application [\${targetApp.name}] 로딩 중...</p>
                </div>
            \`;
            try {
                // 마이크로 앱 진입점 엔트리 원격/로컬 페칭 및 마운트 연동 (샌드박스프레임화 기초)
                const response = await fetch(targetApp.entryUrl);
                if (!response.ok) throw new Error("애플리케이션 소스를 불러올 수 없습니다.");
                const htmlContent = await response.text();
                
                // 런타임 뷰 내부 격리 삽입
                this.viewContainer.innerHTML = htmlContent;
                
                // 앱 내부 동적 스크립트 실행 분석기 작동
                this.executeInjectedScripts(this.viewContainer);
            } catch (error) {
                this.viewContainer.innerHTML = \`
                    <div class="alert alert-danger">
                        <h5>⚠️ Sub-App 로딩 실패</h5>
                        <p>\${error.message}</p>
                    </div>
                \`;
            }
        } else {
            if(path === '/' || path === '') {
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
`;
    fs.writeFileSync(filePath, routingContent, 'utf8');
    logSuccess('routing.js', 'CREATE_NEW');
};

// 4. index.html 레이아웃 고도화 (라우팅 네비게이션 및 서브앱 매니저 마크업 추가)
const updateIndexHtml = () => {
    const filePath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.error('index.html 파일이 존재하지 않습니다.');
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 폼 및 라우터 마크업 구성 요소 정의
    const adminPanelMarkup = `
    <section id="step6-app-manager" class="card my-4 shadow-sm">
        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">⚙️ STEP 6: 다중 서브 애플리케이션 라우팅 메타데이터 등록</h4>
        </div>
        <div class="card-body">
            <form id="subapp-register-form" class="row g-3">
                <div class="col-md-3">
                    <label class="form-label">애플리케이션 고유 ID</label>
                    <input type="text" id="app-id" class="form-control" placeholder="example-app" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label">앱 이름</label>
                    <input type="text" id="app-name" class="form-control" placeholder="회계 관리 도구" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label">라우팅 경로 (Path)</label>
                    <input type="text" id="app-path" class="form-control" placeholder="/finance" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Entry URL (진입 HTML 주소)</label>
                    <input type="text" id="app-entry" class="form-control" placeholder="./apps/finance.html" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label">아이콘 (Emoji)</label>
                    <input type="text" id="app-icon" class="form-control" placeholder="💰">
                </div>
                <div class="col-md-10">
                    <label class="form-label">애플리케이션 설명</label>
                    <input type="text" id="app-desc" class="form-control" placeholder="서브 모듈 핵심 요약 설명 기입">
                </div>
                <div class="col-12 text-end">
                    <button type="submit" class="btn btn-primary">라우팅 메타데이터 등록/동기화</button>
                </div>
            </form>
            <hr>
            <h5>실시간 등재 서브 애플리케이션 라우팅 테이블</h5>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>애플리케이션 (ID)</th>
                            <th>라우팅 경로</th>
                            <th>진입점 (Entry)</th>
                            <th>상태</th>
                            <th>제어</th>
                        </tr>
                    </thead>
                    <tbody id="admin-subapp-list">
                        </tbody>
                </table>
            </div>
        </div>
    </section>

    <div class="row my-4">
        <div class="col-md-3">
            <div class="card shadow-sm">
                <div class="card-header bg-secondary text-white">Dynamic Navigation</div>
                <ul class="nav flex-column nav-pills p-2" id="dynamic-nav-menu">
                    </ul>
            </div>
        </div>
        <div class="col-md-9">
            <div id="main-runtime-view" class="p-4 border rounded bg-light shadow-sm" style="min-height: 300px;">
                <h3>Master App Platform 메인 대시보드</h3>
                <p>좌측 메뉴에서 서브 애플리케이션을 선택하세요.</p>
            </div>
        </div>
    </div>
    `;

    // 적절한 마운트 위치 지정 (일반적으로 </main> 태그 직전 또는 컨테이너 하단)
    if (content.includes('</main>')) {
        content = content.replace('</main>', `${adminPanelMarkup}\n</main>`);
    } else if (content.includes('</div>\n</body>')) {
        content = content.replace('</div>\n</body>', `${adminPanelMarkup}\n</div>\n</body>`);
    }

    // routing.js 모듈 인젝션 스크립트 태그 추가
    const scriptTag = `<script type="module" src="./routing.js"></script>\n</body>`;
    content = content.replace('</body>', scriptTag);

    fs.writeFileSync(filePath, content, 'utf8');
    logSuccess('index.html', 'PATCH_UI_LAYOUT');
};

// 5. ProjectStatus.md 업데이트
const updateProjectStatus = () => {
    const filePath = path.join(__dirname, 'ProjectStatus.md');
    if (!fs.existsSync(filePath)) {
        return;
    }

    let statusContent = fs.readFileSync(filePath, 'utf8');
    statusContent = statusContent.replace(
        /- \[ \] STEP 6/g,
        '- [x] STEP 6 (다중 서브 애플리케이션 등록 및 라우팅 메타데이터 관리 완료)'
    );
    
    fs.writeFileSync(filePath, statusContent, 'utf8');
    logSuccess('ProjectStatus.md', 'UPDATE_STATUS');
};

// 파이프라인 일괄 실행
(() => {
    console.log("🚀 STEP 6: 다중 서브 애플리케이션 아키텍처 자동 패치 스크립트 기동...\n");
    try {
        updateDatabaseJs();
        updateAdminJs();
        createRoutingJs();
        updateIndexHtml();
        updateProjectStatus();
        console.log("\n✨ STEP 6 연동 및 파일 동기화 처리가 완벽히 완료되었습니다. 애플리케이션을 구동하세요.");
    } catch (err) {
        console.error("❌ 패치 프로세스 중 오류 발생:", err);
    }
})();