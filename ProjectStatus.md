# ProjectStatus

현재 버전: master-app-platform-step10-v9

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

## STEP10-v9 현재 상태

모바일 반응형 UI 안정화가 적용되었습니다.

- PC 화면 유지
- 태블릿 1열 전환 대응
- 스마트폰 상단 메뉴 전환
- 앱 카드 세로 정렬
- 관리자 승인 목록 모바일 가독성 개선
- 요청 게시판 모바일 입력폼 정리
- 긴 이메일 UID URL 자동 줄바꿈 적용

다음 단계에서는 실제 스마트폰 테스트 결과를 기준으로 메뉴 접힘 방식과 하단 탭 네비게이션 도입 여부를 결정합니다.


## STEP10-v9 현재 상태

상태: 완료

- 로그인 랜딩 페이지를 프리미엄 SaaS 스타일로 개선했습니다.
- 기존 인증 기능과 관리자 권한 판별은 유지했습니다.
- 모바일 인증 화면도 세로형으로 대응했습니다.
- 다음 단계는 Permission Runtime Engine 또는 App Store 3.0 고도화입니다.


---

## STEP10-v9 Login Gate Renewal

- 대문 로그인 화면을 중앙형 Login Gate UI로 개편
- 상단 소개 기능 요금제 고객지원 메뉴 제거
- 로그인 회원가입 비밀번호 찾기를 하나의 카드 안에서 전환
- Firebase 로그인 회원가입 비밀번호 재설정 기능 유지
- 비밀번호 보기 로그인 상태 유지 모바일 반응형 유지
- 기존 App Store My Runtime Admin Center 요청 게시판 기능 유지

---

# STEP11 Ultimate Platform Foundation 완료

현재 버전
master-app-platform-step11-ultimate-v1

핵심 완료 사항

- QA Dashboard 추가
- 요청 게시판 HelpDesk 구조 개선
- Notification Center 추가
- App Store 검색 카테고리 정렬 필터 추가
- 승인센터 대기 목록 정리 로직 보강
- Version Manager 기초 추가
- 관리자 답변 및 상태 처리 추가
- 모바일 반응형 스타일 유지

검수 기준

- 기존 로그인 회원가입 비밀번호 찾기 기능 유지
- 기존 관리자 회원관리 앱관리 승인관리 유지
- 기존 App Store My Runtime Launcher 유지
- Firebase 기존 경로 유지
- 새 프로젝트 생성 없음


## 현재 상태 업데이트 STEP11 Ultimate v1.1

- 로그인 대문 PC 중앙 정렬 수정 완료
- 기존 로그인 회원가입 비밀번호 찾기 기능 유지
- 모바일 배치 유지
- 다음 테스트 필요 항목: PC 로그인 카드 정중앙 확인 모바일 세로 배치 확인

# STEP12 Platform Core Modularization 완료

현재 버전: master-app-platform-step12-core-v1

## 완료 항목
- 기능별 HTML 템플릿 구조 추가
- core UI Kit 추가
- core utility JS 추가
- 모듈별 README 추가
- 운영 진입점 index.html 유지
- 기존 기능 보존

## 현재 구조
- index.html: 안정적인 운영 진입점
- core/: 공통 유틸리티와 UI Kit
- pages/: 화면별 HTML 템플릿
- modules/: 기능별 모듈 경계 문서
- apps/: 등록 서브앱 실행 파일

## 안정화 원칙
STEP12에서는 전체 기능을 무리하게 분리하지 않고 먼저 구조를 만든다.
다음 단계부터 기능별 JS를 안전하게 이동한다.


## 현재 상태 STEP12-v2
관리자는 등록된 앱의 소개글과 실행 정보 권한 정보 버전 정보를 수정할 수 있습니다. 공지 작성 요청 게시판 관리 알림 삭제가 가능해져 플랫폼 운영자가 서비스 내용을 직접 관리할 수 있는 상태입니다.


## 현재 상태 STEP13 Service Platform v1
완료된 확장 기능
- App Detail Center
- Official App Center
- Deployment Center
- Health Monitor
- Backup Export
- Developer Center
- SDK 초안 생성
- Manifest 검사 기초
