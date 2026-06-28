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


## STEP9-v8 Launcher 구조
Dashboard App Store Favorite Quick Launch 버튼은 모두 dashboard.js의 launchApp 함수로 통합된다. launchMode가 router이면 Runtime 화면으로 이동한 후 MasterRouter가 앱을 로드한다. newTab이면 클릭 시점에 새 탭을 열고 기록 저장 후 URL을 주입한다.
