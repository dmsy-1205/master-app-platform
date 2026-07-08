# HearU2nite STEP7-2 Platform Shell Rebranding 적용 가이드

## 목적
로그인 후 공통 Shell을 기존 MasterOS 어두운 콘솔 화면에서 HearU2nite Multi-App Platform 방향의 밝은 사용자 중심 화면으로 전환합니다.

## 수정 범위
- index.html: 사용자 노출 문구와 메뉴명 변경, platform-shell.css 로딩 추가
- assets/css/platform-shell.css: 로그인 후 Shell 전용 디자인 오버라이드 추가

## 변경하지 않은 영역
- auth.js
- firebase.js
- database.js
- security.js
- dashboard.js
- workspace.js
- admin.js
- routing.js
- 승인/앱실행/Firebase 구조

## 적용 방법
ZIP 압축을 프로젝트 루트에 덮어쓰기합니다.
GitHub Desktop에서 변경 파일을 확인한 뒤 Commit → Push 합니다.
Firebase Hosting은 GitHub Actions 자동배포가 실패하면 `firebase deploy --only hosting`을 실행합니다.

## GitHub Summary
feat: apply STEP7-2 HearU2nite platform shell

## GitHub Description
Rebrand the authenticated workspace shell to HearU2nite Platform while preserving router, Firebase authentication, approval, dashboard data, app runtime, and admin center behavior.

## QA
1. 로그인 성공 후 Home 화면이 표시되는지 확인
2. 로그아웃이 정상 작동하는지 확인
3. 좌측 메뉴 Home / 앱 둘러보기 / 내 앱 / 승인 현황 / 공지사항 / 고객지원 / Admin Center 전환 확인
4. 대표 앱 실행 버튼 확인
5. 관리자 계정에서 Admin Center 노출 확인
6. PC / Android / iPhone / Galaxy Fold 접힘 / Fold 펼침 검수
