# ProjectStatus

현재 버전: master-app-platform-step10-v2

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


## STEP10-v1.1 긴급 수정

- Firebase Realtime Database 경로 제한으로 인해 앱 버전값 `v1.0`이 `versions/v1.0` 경로로 저장되며 등록 실패가 발생하던 문제를 수정했습니다.
- Version Manager 내부 저장 키는 `v1_0`처럼 안전한 Firebase Key로 자동 변환하고 화면 및 manifest의 실제 버전 표기는 `v1.0` 그대로 유지합니다.
- 앱 등록과 실행 로그 기록 모두 동일한 버전 키 정규화 규칙을 사용하도록 보정했습니다.


---

## STEP10-v2 업데이트

- Firebase 경로 키 안전 처리 강화
- 버전값의 점 콤마 공백 특수문자가 DB 저장 경로에 들어가지 않도록 자동 변환
- 기존 versions 데이터에 잘못된 키가 남아 있어도 저장 시 안전 키로 재정리
- 일반 사용자 App Store에는 공개 앱을 먼저 보여주도록 수정
- 승인 전 사용자는 앱 카드에서 실행 대신 사용 신청 버튼 표시
- 사용 신청 버튼 클릭 시 회원 신청 시스템으로 이동하고 신청 앱 정보 자동 입력
- My Runtime 네비게이션은 권한이 확인된 앱만 표시되도록 수정
