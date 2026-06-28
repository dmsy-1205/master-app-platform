# Architecture

## 주요 경로
- `users/{uid}` 회원 기본 정보 권한 상태
- `admins/{uid}` 관리자 여부
- `applications/{uid}` 승인 신청 상태
- `apps/{appId}` 앱 메타데이터
- `userFavorites/{uid}/{appId}` 즐겨찾기
- `appRunLogs/{uid}/{appId}` 실행 로그

## STEP9-v7 추가
회원관리 UI가 `users`, `admins`, `applications`를 함께 읽어 관리자 화면에서 회원 상태와 권한을 관리한다.
