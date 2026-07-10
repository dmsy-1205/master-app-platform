# STEP8-12 적용 가이드

## 수정 목적
- 모바일 메뉴 항목 클릭 시 Drawer만 닫히고 화면이 이동하지 않는 충돌 제거
- 메뉴가 열린 상태에서 Drawer 자체까지 어두워지는 z-index 문제 수정
- 모바일 전체 폭 유지

## 적용 파일
- index.html
- workspace-nav.js
- assets/css/platform-shell.css

## 중요
기존 `workspace.js`는 이번 STEP에서 사용하지 않습니다. `index.html`이 `workspace-nav.js`를 로드하도록 변경되었습니다.

배포 시 위 3개 파일을 정확한 경로에 덮어쓰고, 모바일 브라우저의 사이트 데이터/캐시를 삭제한 뒤 확인합니다.
