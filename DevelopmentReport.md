# DevelopmentReport STEP10-v1

## 작업 목표
STEP9-v8에서 정상 동작한 Platform Launcher 위에 App Security Platform을 추가한다.

## 구현 내용
기존 프로젝트 구조를 유지하면서 앱 메타데이터를 Manifest 중심으로 확장했다. 관리자 앱 등록 폼은 Owner Category 권한 모드 권한 태그 Official 공개 여부 업데이트 노트를 입력할 수 있도록 확장했다.

Dashboard 실행 흐름은 Permission Engine 검사를 통과한 경우에만 Launch Token을 생성하고 실행 로그를 저장한다. Runtime 라우터는 Token이 없는 직접 접근을 차단해 사용자가 App Store 또는 Dashboard 실행 버튼을 통해서만 내부 앱을 열도록 했다.

생활관리 앱은 첫 번째 Official App으로 지정할 수 있도록 프리셋을 수정했고 Platform Verified Badge를 App Store와 관리자 목록에 표시한다.

## 검수 포인트
- 기존 로그인 회원가입 승인 관리자 권한 유지
- 기존 앱 등록 수정 삭제 활성 비활성 기능 유지
- 기존 Dashboard App Store 즐겨찾기 최근 실행 대표 앱 실행 흐름 유지
- 기존 `appRunLogs` 유지하면서 `executionLogs` 추가
- 외부 앱 newTab sameTab router 실행 방식 유지

## 주의
이번 Token은 클라이언트에서 발급하고 Firebase에 기록하는 1차 구조입니다. URL 직접 접근 완전 차단과 데이터 접근 완전 보호는 Firebase Rules 또는 Cloud Functions 검증이 필요합니다.


## STEP10-v1.1 긴급 수정

- Firebase Realtime Database 경로 제한으로 인해 앱 버전값 `v1.0`이 `versions/v1.0` 경로로 저장되며 등록 실패가 발생하던 문제를 수정했습니다.
- Version Manager 내부 저장 키는 `v1_0`처럼 안전한 Firebase Key로 자동 변환하고 화면 및 manifest의 실제 버전 표기는 `v1.0` 그대로 유지합니다.
- 앱 등록과 실행 로그 기록 모두 동일한 버전 키 정규화 규칙을 사용하도록 보정했습니다.
