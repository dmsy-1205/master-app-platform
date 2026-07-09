# HearU2nite STEP7-4.1 App Launch Permission Fix

## 목적
승인된 일반 사용자가 플랫폼의 앱 실행 버튼을 눌렀을 때 `PERMISSION_DENIED`로 이동하지 못하는 문제를 수정합니다.

## 원인
기존 `security.js`의 `recordSecureExecution()`은 일반 사용자 앱 실행 시 다음 관리자 전용 경로까지 한 번에 업데이트했습니다.

- `apps/{appId}/runCount`
- `apps/{appId}/lastRunAt`
- `apps/{appId}/lastRunBy`
- `apps/{appId}/versions/...`

현재 Firebase Rules에서 `apps/{appId}` 쓰기는 관리자만 허용되므로, 승인된 일반 사용자의 실행 기록이 `PERMISSION_DENIED`로 실패했습니다.

## 수정 내용
- 앱 승인 검증 로직 유지
- Launch Token 생성 유지
- 일반 사용자는 허용된 경로만 기록
  - `users/{uid}/lastAppLaunch`
  - `launchTokens/{token}/used`
  - `appRunLogs/{uid}/{appId}`
  - `executionLogs/{appId}`
- `apps/{appId}` 전역 통계 갱신은 관리자 권한일 때만 best-effort로 실행
- 로그 기록 실패가 앱 실행 자체를 막지 않도록 보호

## 적용 파일
- `security.js`

## 적용 방법
프로젝트 루트에 압축을 풀어 `security.js`를 덮어씁니다.

## 검수 항목
1. 일반 사용자 로그인
2. Home 또는 앱 둘러보기에서 앱 실행 클릭
3. PERMISSION_DENIED 알림이 뜨지 않는지 확인
4. HearMe2nite 앱 새 창/새 탭 이동 확인
5. 앱 직접 로그인 정상 확인
6. 관리자 로그인 후 앱 실행도 정상인지 확인
7. 활동 기록에 실행 로그가 남는지 확인

## GitHub Summary
`fix: allow approved users to launch apps without admin-only writes`

## GitHub Description
`Separate user-safe launch logging from admin-only app metadata updates to prevent Firebase PERMISSION_DENIED errors during approved app launch.`
