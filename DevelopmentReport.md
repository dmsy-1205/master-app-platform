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


---

## STEP10-v2 업데이트

- Firebase 경로 키 안전 처리 강화
- 버전값의 점 콤마 공백 특수문자가 DB 저장 경로에 들어가지 않도록 자동 변환
- 기존 versions 데이터에 잘못된 키가 남아 있어도 저장 시 안전 키로 재정리
- 일반 사용자 App Store에는 공개 앱을 먼저 보여주도록 수정
- 승인 전 사용자는 앱 카드에서 실행 대신 사용 신청 버튼 표시
- 사용 신청 버튼 클릭 시 회원 신청 시스템으로 이동하고 신청 앱 정보 자동 입력
- My Runtime 네비게이션은 권한이 확인된 앱만 표시되도록 수정


## STEP10-v4 개발 보고
이번 수정은 일반 사용자 흐름의 권한 경계를 바로잡는 작업이다
App Store에는 공개 앱이 보이고 신청이 가능하지만 My Runtime에는 승인된 앱만 표시되도록 변경했다
또한 My Runtime 메뉴 클릭이 단순 hash 이동에 머물러 반응이 없던 문제를 Launch Token 기반 실행 흐름으로 연결했다
신청 승인 데이터는 userAppAccess/{uid}/{appId} 구조로 저장되며 이후 여러 앱별 권한 관리로 확장 가능하다


## STEP10-v4 개발 보고

이번 단계는 App Store 신청 흐름과 관리자 승인 화면의 상태 인지 문제를 수정했다
일반 사용자가 앱 사용 신청을 완료하면 해당 앱 카드의 버튼은 사용 신청에서 승인 대기중으로 즉시 변경된다
관리자 승인 대시보드는 pending approved rejected 상태별로 카드와 버튼 문구를 다르게 표시한다
이 수정으로 신청 중복과 승인 처리 혼동을 줄이고 App Security Platform의 권한 흐름을 더 명확하게 만들었다


## STEP10-v5 Approval UX Stabilization
- App Store 신청 상태를 사용 신청 승인 대기중 실행 흐름으로 실시간 동기화했습니다.
- 관리자 승인 관리는 기본적으로 대기 신청만 표시하고 승인/거절 이력은 탭으로 분리했습니다.
- 승인 또는 거절 처리 후 대기 목록에서 자동 정리되도록 개선했습니다.
- 승인 완료 거절 완료 버튼 상태를 명확하게 고정 표시하도록 개선했습니다.
- 사용자 편의성과 운영자 관리성을 우선으로 검수했습니다.
