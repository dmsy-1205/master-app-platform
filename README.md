# Master App Platform

## 현재 버전

master-app-platform-step09-v2

## 목적

여러 웹 애플리케이션을 하나의 플랫폼에서 회원 승인 권한 관리 앱 등록 앱 실행 로그까지 통합 운영하는 SaaS형 플랫폼입니다.

## STEP9-v2 변경점

- 관리자 콘솔 SPA 메뉴 구조 적용
- 좌측 사이드바 메뉴 전환 방식 적용
- Dashboard App Store Runtime 신청 관리 Admin Center 화면 분리
- 관리자 센터 내부 Overview 승인 관리 앱 관리 개발 도구 탭 분리
- 기존 Firebase Auth Database 관리자 권한 앱 실행 기능 유지
- STEP8-v5 다크 프리미엄 UI 유지

## 테스트 항목

- 회원가입 로그인 로그아웃
- 관리자 권한 유지
- 사용자 Dashboard 표시
- App Store 앱 실행
- Runtime 내부 라우팅
- 회원 신청 및 신청 조회
- 관리자 승인 대시보드
- 관리자 앱 등록 활성 비활성

## 배포 방식

GitHub에 ZIP 내용을 덮어쓰기 업로드한 뒤 Netlify 자동 배포로 테스트합니다.


## STEP9-v2

사용자 Dashboard와 App Store 경험을 개선한 버전입니다. 기존 인증, 승인, 앱 등록, 실행, 관리자 SPA 기능은 유지됩니다.
