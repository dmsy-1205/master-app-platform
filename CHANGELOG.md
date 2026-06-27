# CHANGELOG

## master-app-platform-step08-v2

### Added

- 화면 표시 제어용 `data-auth` 구조 추가
- 로그인 전용 화면과 로그인 후 화면 분리
- 관리자 전용 화면 분리
- 개발 테스트 도구 접기/펼치기 영역 추가
- 관리자 권한 이중 확인 구조 추가
- 브라우저 세션 기반 로그인 유지 방식 추가
- 개발 보고서 문서 추가
- KnownIssues 문서 추가

### Changed

- `index.html` 전체 화면 구조 정리
- `auth.js` 로그인 상태별 화면 표시 로직 보강
- `auth.js` 관리자 권한 확인 로직 보강
- `admin.js` 관리자 등록 시 `admins/{uid}`와 `users/{uid}/role` 동시 저장
- `dashboard.js` 관리자 계정은 앱 실행 테스트 가능하도록 보강
- `style.css` 구조 안정화 UI 스타일 추가
- `README.md` STEP8 v2 기준으로 갱신
- `ProjectStatus.md` STEP8 v2 기준으로 갱신

### Fixed

- 모든 기능이 한 페이지에 무조건 표시되던 문제 완화
- 관리자 계정이 재로그인 후 일반 계정처럼 보일 수 있던 문제 개선
- 로그인 유지가 개발 단계에서 지나치게 오래 남는 문제 개선

### Preserved

- 기존 Firebase 설정 유지
- 기존 회원가입 로그인 로그아웃 유지
- 기존 DB 테스트 유지
- 기존 회원 신청 승인 거절 유지
- 기존 앱 등록 라우팅 활성화 비활성화 유지
- 기존 사용자 Dashboard 앱 실행 기록 저장 유지
