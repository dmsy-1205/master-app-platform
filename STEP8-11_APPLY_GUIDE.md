# STEP8-11 Mobile Navigation Single Router Fix

## 적용 파일
- index.html
- workspace.js
- assets/css/platform-shell.css

## 적용 방법
프로젝트 루트에 동일한 경로로 덮어쓴 뒤 Netlify에 배포합니다.
브라우저 캐시 영향을 피하려면 배포 후 강력 새로고침 또는 사이트 데이터 삭제 후 확인합니다.

## 핵심 변경
- index.html에 남아 있던 중복 모바일 메뉴 fallback 스크립트 제거
- workspace.js 단일 이벤트 위임 방식으로 통합
- 메뉴 클릭 시 화면 이동을 먼저 실행한 뒤 Drawer 닫기
- 각 메뉴에 실제 hash 경로 부여
- 상단 권한/승인/세션 3개 대형 상태 카드 DOM 제거
- 모바일 Drawer 로고 및 로그인 카드 축소

## 필수 QA
1. 메뉴 열기/닫기
2. Home 이동
3. 내 앱 이동
4. 앱 둘러보기 이동
5. 앱 신청 이동
6. 공지사항 이동
7. 고객지원 이동
8. 일반 사용자 Admin Center 미표시
9. 관리자 Admin Center 표시 및 이동
10. 모바일 폭 유지
