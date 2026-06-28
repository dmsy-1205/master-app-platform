# ProjectStatus

현재 버전: master-app-platform-step10-v4

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


## 현재 상태 STEP10-v4
- App Store 공개 앱 표시 정상화
- 사용 신청 흐름 유지
- 승인 전 My Runtime 앱 노출 차단
- 승인 후 My Runtime 앱 클릭 실행 흐름 보강
- 앱별 권한 저장 구조 도입


## 현재 상태 STEP10-v4

- App Store 신청 상태 표시 개선 완료
- 승인 대기중 버튼 전환 완료
- 관리자 승인 완료 거절 완료 버튼 상태 표시 완료
- My Runtime 승인 앱 실행 흐름 유지
- 다음 단계는 신청 이력 필터링 승인 알림 업데이트 관리 고도화


## STEP10-v5 Approval UX Stabilization
- App Store 신청 상태를 사용 신청 승인 대기중 실행 흐름으로 실시간 동기화했습니다.
- 관리자 승인 관리는 기본적으로 대기 신청만 표시하고 승인/거절 이력은 탭으로 분리했습니다.
- 승인 또는 거절 처리 후 대기 목록에서 자동 정리되도록 개선했습니다.
- 승인 완료 거절 완료 버튼 상태를 명확하게 고정 표시하도록 개선했습니다.
- 사용자 편의성과 운영자 관리성을 우선으로 검수했습니다.

## 현재 상태 STEP10-v6
- App Store 신청 상태 흐름 유지
- 승인 대기 목록 자동 정리 적용
- 승인 이력 거절 이력 분리 적용
- 요청 게시판 추가 완료
- 처리된 신청은 applicationHistory에 보존
- 다음 검토 대상은 게시판 관리자 필터 검색 댓글 기능입니다.

## STEP10-v7 현재 상태

모바일 반응형 UI 안정화가 적용되었습니다.

- PC 화면 유지
- 태블릿 1열 전환 대응
- 스마트폰 상단 메뉴 전환
- 앱 카드 세로 정렬
- 관리자 승인 목록 모바일 가독성 개선
- 요청 게시판 모바일 입력폼 정리
- 긴 이메일 UID URL 자동 줄바꿈 적용

다음 단계에서는 실제 스마트폰 테스트 결과를 기준으로 메뉴 접힘 방식과 하단 탭 네비게이션 도입 여부를 결정합니다.
