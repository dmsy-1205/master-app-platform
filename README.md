# Master App Platform - STEP 7 안정화 v2

## 프로젝트 개요
Master App Platform은 여러 개의 웹 애플리케이션을 하나의 플랫폼에서 운영하기 위한 통합 플랫폼입니다.

현재 버전은 `master-app-platform-step07-v2` 입니다.

## 이번 버전에서 완료한 내용

### STEP 7 사용자 Dashboard
- 로그인한 사용자의 세션 상태 이메일 UID 권한 구분 승인 상태를 표시하는 사용자 Dashboard를 추가했습니다.
- `applications/{uid}`와 `users/{uid}` 데이터를 조회해 승인 대기 승인 완료 승인 거절 상태를 표시합니다.
- `admins/{uid}` 데이터를 함께 확인해 관리자와 일반 사용자를 구분합니다.
- 승인 완료 사용자는 Firebase `apps` 메타데이터 중 활성화된 서브 애플리케이션 목록을 Dashboard에서 확인하고 실행할 수 있습니다.
- 승인 전 사용자는 앱 목록 대신 승인 완료 후 사용 가능하다는 안내를 확인합니다.
- Dashboard 새로고침 버튼과 첫 번째 앱 실행 버튼을 추가했습니다.


### STEP 7 안정화 v2 수정
- STEP6 실시간 등재 서브 애플리케이션 라우팅 테이블의 활성화/비활성화 버튼 이벤트를 안정화했습니다.
- 버튼 클릭 시 Firebase `apps/{appId}/isActive` 값을 Boolean으로 갱신하고 `updatedAt`을 함께 기록하도록 수정했습니다.
- 기존 데이터에 `true`/`false` 문자열이 남아 있어도 정상 판정되도록 상태 정규화 함수를 추가했습니다.
- MasterRouter와 사용자 Dashboard도 동일한 상태 정규화 기준을 사용하도록 연결했습니다.
- 처리 실패 시 관리자 화면에 오류 알림이 표시되도록 보강했습니다.

## 기존 기능 유지 확인
- STEP 1 Firebase Authentication 회원가입 로그인 로그아웃 자동 로그인 유지 구조를 보존했습니다.
- STEP 2 Realtime Database 읽기 쓰기 삭제 테스트 구조를 보존했습니다.
- STEP 3 관리자 권한 테스트 구조를 보존했습니다.
- STEP 4 회원 신청 시스템 구조를 보존했습니다.
- STEP 5 관리자 승인 거절 처리 구조를 보존했습니다.
- STEP 6 다중 서브 애플리케이션 등록 동적 라우팅 MasterRouter 구조를 보존했습니다.

## 파일 변경 요약
- `index.html` STEP7 사용자 Dashboard UI 추가 및 버전 표기 갱신
- `dashboard.js` 사용자 Dashboard 데이터 조회 렌더링 로직 유지 및 활성 앱 판정 안정화
- `style.css` 사용자 Dashboard 카드 앱 목록 반응형 스타일 추가
- `README.md` STEP7 안정화 v2 기준으로 갱신
- `ProjectStatus.md` STEP7 완료 상태로 갱신

## 배포 방법
1. 이 ZIP 파일의 압축을 풉니다.
2. GitHub 저장소에 기존 프로젝트 파일을 덮어쓰기 업로드합니다.
3. Netlify 자동 배포가 완료될 때까지 기다립니다.
4. 배포 사이트에서 회원가입 로그인 신청 승인 앱 등록 사용자 Dashboard 순서로 테스트합니다.

## 다음 개발 목표
다음 STEP 8 앱 연결 단계에서는 사용자 권한과 실제 서브 앱 접근 제어를 더 정교하게 연결합니다.
