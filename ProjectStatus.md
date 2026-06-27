# Project Status - Master App Platform

## 현재 버전

`master-app-platform-step08-v2`

## 현재 상태

STEP8 앱 연결 기능 보완 및 화면 구조 안정화 완료

## 완료된 단계

- [x] STEP1 Firebase Authentication 회원가입 로그인 로그아웃
- [x] STEP2 Realtime Database 읽기 쓰기 삭제 테스트
- [x] STEP3 관리자 권한 시스템
- [x] STEP4 회원 신청 시스템
- [x] STEP5 회원 승인 거절 시스템
- [x] STEP6 다중 서브 애플리케이션 등록 동적 라우팅 활성화 비활성화
- [x] STEP7 사용자 Dashboard
- [x] STEP8 사용자 Dashboard 앱 실행 연결
- [x] STEP8 v2 화면 구조 안정화 관리자 권한 유지 보강
- [ ] STEP9 Firebase Rules 보안 적용
- [ ] STEP10 최종 배포 및 보안 점검

## STEP8 v2 작업 내용

### 화면 구조 안정화

- 로그인 전 화면과 로그인 후 화면 분리
- 사용자 영역과 관리자 영역 분리
- 개발 테스트 기능을 접기/펼치기 도구로 분리
- `index.html` 한 페이지에 모든 기능이 무조건 노출되던 문제 완화

### 로그인 유지 방식 조정

- Firebase 인증 유지 방식을 브라우저 세션 기준으로 변경
- 창을 완전히 닫은 후 재접속 시 다시 로그인하도록 조정
- 기존 로컬 세션은 사용자가 한 번 로그아웃하면 새 방식으로 정리됨

### 관리자 권한 보강

- 관리자 권한 확인 경로를 `admins/{uid}`와 `users/{uid}/role` 이중 기준으로 보강
- 관리자 등록 시 두 경로를 함께 저장
- 재로그인 후 관리자 화면이 일반 사용자처럼 보이는 문제 개선

### STEP8 앱 실행 보완

- 사용자 Dashboard 앱 카드 유지
- 앱 실행 버튼 유지
- 새 탭 실행 현재 창 이동 내부 라우터 실행 지원
- 실행 횟수 최근 실행 시간 사용자별 실행 로그 저장 유지
- 관리자는 승인 상태와 무관하게 테스트 목적으로 앱 실행 가능

## 수정 파일

- `index.html`
- `auth.js`
- `admin.js`
- `dashboard.js`
- `style.css`
- `README.md`
- `ProjectStatus.md`
- `CHANGELOG.md`
- `KnownIssues.md`
- `DevelopmentReport.md`

## 테스트 필요 항목

- 로그인 전 회원가입 로그인만 표시되는지 확인
- 로그인 후 사용자 영역만 표시되는지 확인
- 관리자 등록 후 관리자 영역이 표시되는지 확인
- 로그아웃 후 재로그인해도 관리자 권한이 유지되는지 확인
- 창을 닫았다가 다시 접속하면 다시 로그인해야 하는지 확인
- 앱 등록 활성화 비활성화 버튼이 정상 작동하는지 확인
- 사용자 Dashboard 앱 실행 버튼이 정상 작동하는지 확인
- 실행 횟수와 최근 실행 시간이 Firebase에 저장되는지 확인

## 다음 작업

STEP8 v2 테스트가 정상 완료되면 STEP9 Firebase Rules 보안 적용으로 이동합니다.
