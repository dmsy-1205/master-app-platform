# Architecture.md

## 현재 구조
정적 HTML/CSS/JavaScript 기반 Netlify 배포 프로젝트

## 주요 파일
- index.html: 전체 화면 구조
- style.css: UI 디자인
- firebase.js: Firebase 설정
- auth.js: 인증 및 권한 화면 제어
- database.js: Realtime Database 기능
- admin.js: 관리자 승인 및 앱 등록
- apply.js: 회원 신청
- routing.js: 서브 앱 라우팅
- dashboard.js: 사용자 Dashboard 및 앱 실행

## 화면 구조
- Public Landing: 로그인 전
- Workspace: 로그인 후 사용자 화면
- App Store: 활성 앱 카드 목록
- Runtime: 내부 앱 실행 영역
- Admin Center: 관리자 전용 승인/앱관리/개발도구

## 유지 원칙
새 프로젝트를 만들지 않고 기존 Firebase와 기존 파일 구조를 기준으로 점진 개선한다.


## STEP9-v3 추가 구조
- dashboard.js: 검색 필터, 즐겨찾기, 알림, 프로필, 활동 로그 로직 추가
- workspace.js: activity 라우트 추가
- index.html: Notification Center, Profile Panel, Activity Log 화면 추가
