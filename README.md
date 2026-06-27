# Master App Platform - STEP 7 완료

## 프로젝트 개요
Master App Platform은 여러 개의 웹 애플리케이션을 하나의 플랫폼에서 운영하기 위한 통합 플랫폼입니다.

현재 버전은 `master-app-platform-step07-v1` 입니다.

## 이번 버전에서 완료한 내용

### STEP 7 사용자 Dashboard
- 로그인한 사용자의 세션 상태 이메일 UID 권한 구분 승인 상태를 표시하는 사용자 Dashboard를 추가했습니다.
- `applications/{uid}`와 `users/{uid}` 데이터를 조회해 승인 대기 승인 완료 승인 거절 상태를 표시합니다.
- `admins/{uid}` 데이터를 함께 확인해 관리자와 일반 사용자를 구분합니다.
- 승인 완료 사용자는 Firebase `apps` 메타데이터 중 활성화된 서브 애플리케이션 목록을 Dashboard에서 확인하고 실행할 수 있습니다.
- 승인 전 사용자는 앱 목록 대신 승인 완료 후 사용 가능하다는 안내를 확인합니다.
- Dashboard 새로고침 버튼과 첫 번째 앱 실행 버튼을 추가했습니다.

## 기존 기능 유지 확인
- STEP 1 Firebase Authentication 회원가입 로그인 로그아웃 자동 로그인 유지 구조를 보존했습니다.
- STEP 2 Realtime Database 읽기 쓰기 삭제 테스트 구조를 보존했습니다.
- STEP 3 관리자 권한 테스트 구조를 보존했습니다.
- STEP 4 회원 신청 시스템 구조를 보존했습니다.
- STEP 5 관리자 승인 거절 처리 구조를 보존했습니다.
- STEP 6 다중 서브 애플리케이션 등록 동적 라우팅 MasterRouter 구조를 보존했습니다.

## 파일 변경 요약
- `index.html` STEP7 사용자 Dashboard UI 추가 및 버전 표기 갱신
- `dashboard.js` 사용자 Dashboard 데이터 조회 렌더링 로직 신규 추가
- `style.css` 사용자 Dashboard 카드 앱 목록 반응형 스타일 추가
- `README.md` STEP7 기준으로 신규 정리
- `ProjectStatus.md` STEP7 완료 상태로 갱신

## 배포 방법
1. 이 ZIP 파일의 압축을 풉니다.
2. GitHub 저장소에 기존 프로젝트 파일을 덮어쓰기 업로드합니다.
3. Netlify 자동 배포가 완료될 때까지 기다립니다.
4. 배포 사이트에서 회원가입 로그인 신청 승인 앱 등록 사용자 Dashboard 순서로 테스트합니다.

## 다음 개발 목표
STEP 8 앱 연결 단계에서는 사용자 권한과 실제 서브 앱 접근 제어를 더 정교하게 연결합니다.
