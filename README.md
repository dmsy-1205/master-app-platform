# Master App Platform STEP 5

## 목표
STEP5 관리자 승인 시스템 구현

## 이번 단계에서 추가된 내용
- 관리자 전용 승인 관리 페이지 추가
- `pages/admin-approvals.html` 추가
- `pages/admin-approvals.js` 추가
- 관리자 권한 확인 후 신청 목록 표시
- `applications/{uid}` 신청자 목록 확인
- 신청자 상세 정보 확인
- 승인 버튼 추가
- 거절 버튼 추가
- 승인 시 `applications/{uid}/status = approved` 변경
- 승인 시 `users/{uid}/status = approved` 변경
- 거절 시 `applications/{uid}/status = rejected` 변경
- 거절 시 `users/{uid}/status = rejected` 변경
- 승인/거절 처리자와 처리 시간 저장
- 메인 화면에서 승인 관리 페이지로 이동하는 버튼 추가

## 유지된 기존 기능
- STEP1 회원가입 / 로그인 / 로그아웃 / 자동로그인 유지
- STEP2 Realtime Database 읽기 / 쓰기 / 삭제 테스트 유지
- STEP3 관리자 등록 / 관리자 확인 테스트 유지
- STEP4 회원 신청 / 승인 대기 / 사용자 대시보드 이동 흐름 유지

## 현재 상태 흐름
- 회원가입 직후: `users/{uid}/status = new`
- 신청 완료 후: `users/{uid}/status = pending`
- 관리자 승인 후: `users/{uid}/status = approved`
- 관리자 거절 후: `users/{uid}/status = rejected`

## GitHub 업로드 방법
1. ZIP 압축을 풉니다.
2. GitHub 저장소의 기존 파일 위에 전체 덮어쓰기 합니다.
3. Commit changes를 누릅니다.
4. Netlify 자동 배포가 끝날 때까지 기다립니다.
5. 사이트에서 Ctrl + F5로 강력 새로고침합니다.

## 테스트 순서
1. 기존 관리자 계정으로 로그인합니다.
2. 메인 화면의 `승인 관리 페이지` 버튼을 누릅니다.
3. 관리자 승인 페이지에 접속되는지 확인합니다.
4. 일반 사용자 계정으로 회원가입 후 신청서를 제출합니다.
5. 관리자 계정으로 다시 승인 관리 페이지에 접속합니다.
6. 신청 목록에서 해당 사용자를 확인합니다.
7. `승인` 버튼을 누릅니다.
8. 일반 사용자 계정으로 로그인했을 때 사용자 대시보드로 이동하는지 확인합니다.
9. 다른 신청자에 대해 `거절` 버튼을 누르면 해당 사용자가 다시 신청 페이지로 이동하는지 확인합니다.

## 주의
이번 단계는 STEP5 승인 시스템만 구현했습니다.
STEP6 앱 관리는 아직 구현하지 않았습니다.
Firebase 프로젝트와 기존 `our-baby-care` 프로젝트는 수정하지 않았습니다.
