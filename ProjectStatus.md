# ProjectStatus

현재 버전: master-app-platform-step10-v1

## 완료
- STEP1 회원가입 로그인 자동 로그인
- STEP2 Realtime Database 테스트
- STEP3 관리자 권한
- STEP4 회원 신청
- STEP5 승인 거절
- STEP6 서브 앱 등록 라우팅
- STEP7 사용자 Dashboard
- STEP8 App Store형 UI
- STEP9 관리자 SPA 사용자 UX 알림 검색 즐겨찾기 최근 실행 대표 앱 실행
- STEP9-v8 Platform Launcher 완료
- STEP10-v1 App Security Platform 1차 완료

## STEP10-v1 현재 상태
- App Manifest 필드가 apps 메타데이터에 저장됩니다.
- 앱 실행 전 Permission Engine이 로그인 승인 관리자 Official 권한을 확인합니다.
- 실행 시 Launch Token을 생성하고 sessionStorage 및 Firebase `launchTokens`에 기록합니다.
- Runtime 라우터는 Token 없는 직접 hash 접근을 차단합니다.
- 실행 기록은 기존 사용자별 로그와 신규 앱별 Execution Log에 함께 저장됩니다.
- 생활관리 앱 프리셋은 Official App Platform Verified 상태로 등록됩니다.

## 다음 후보
- Firebase Rules로 `launchTokens`와 앱 데이터 접근 검증 강화
- Cloud Functions 기반 서버 토큰 검증
- 사용자별 앱 접근 권한 UI 세분화
- 생활관리 앱 소스의 Platform 내부 완전 이전
