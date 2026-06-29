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

## STEP10-v6 개발 보고
이번 단계는 기능 확장보다 운영 흐름 안정화에 집중했습니다.
관리자 승인 화면에서 이미 처리된 신청이 계속 남아 관리자를 혼란스럽게 하던 문제를 대기 목록과 이력 저장소 분리 방식으로 개선했습니다.
승인 또는 거절 처리 시 신청 원본은 `applications`에서 제거되고 `applicationHistory`에 보관됩니다.
기존 데이터 중 이미 approved 또는 rejected 상태로 남아 있는 항목도 관리자 동기화 시 자동 아카이브됩니다.
또한 실제 운영 중 버그와 개선 요청을 모을 수 있도록 요청 게시판을 추가했습니다.

## STEP10-v9 개발 보고서

이번 단계는 모바일 사용성을 중심으로 점검했습니다.

### 20년차 프로그래머 관점 검수
- 기존 Firebase 인증 승인 신청 앱 실행 로직은 건드리지 않고 CSS와 표시 레이블 중심으로 수정했습니다.
- 긴 UID 이메일 URL 데이터가 모바일 화면을 깨뜨리지 않도록 공통 줄바꿈 규칙을 추가했습니다.
- 기존 PC 그리드 구조는 유지하고 860px 520px 380px 기준으로 단계적 반응형 처리를 추가했습니다.

### 코딩 작업자 관점 검수
- 사이드바 관리자 탭 앱 카드 승인 카드 요청게시판 버튼을 모바일에서 세로 또는 2열 구조로 정리했습니다.
- 버튼 터치 높이를 최소 44px 이상으로 맞춰 스마트폰 터치 실수를 줄였습니다.
- 테이블 로그 pre 영역의 화면 넘침을 방지했습니다.

### 웹디자이너 관점 검수
- PC의 MasterOS 다크 글래스 UI는 유지했습니다.
- 모바일에서는 카드 여백과 제목 크기를 줄여 한 화면에서 더 자연스럽게 보이도록 조정했습니다.
- App Store Runtime Admin Center Feedback Board의 시각적 흐름을 세로형 모바일 카드 UI로 정리했습니다.

### 테스트 권장
- Chrome 개발자도구 iPhone SE iPhone 14 Pro Galaxy S20 기준으로 화면 깨짐 여부를 확인합니다.
- 일반 사용자 App Store 신청 승인대기 실행 버튼 흐름을 모바일에서 확인합니다.
- 관리자 승인관리 요청게시판 앱관리 화면을 모바일에서 확인합니다.


## STEP10-v9 개발 보고서

### 목표
현재 로그인 화면을 2번 참고 이미지와 같은 SaaS 랜딩형 첫 화면으로 개선했습니다.

### 구현 내용
- 공개 인증 화면을 landing-nav auth-hero-grid landing-form-panel 구조로 재정리했습니다.
- 히어로 카피 기능 카드 단계 카드 보안 안내 오브젝트 비주얼을 추가했습니다.
- 로그인 회원가입 카드는 아이콘 입력 폼 비밀번호 보기 버튼 CTA 중심으로 재구성했습니다.
- 로그인 상태 유지 선택 시 Firebase local persistence를 사용하도록 확장했습니다.
- 비밀번호 보기 버튼은 기존 인증 로직과 분리하여 안전하게 동작하도록 처리했습니다.

### 검수 관점
- 기존 Firebase 로그인 회원가입 함수 유지 확인
- 기존 private workspace 표시 로직 유지 확인
- PC 태블릿 모바일 반응형 레이아웃 확인
- 입력창 버튼 터치 영역 확인


---

## STEP10-v9 Login Gate Renewal

- 대문 로그인 화면을 중앙형 Login Gate UI로 개편
- 상단 소개 기능 요금제 고객지원 메뉴 제거
- 로그인 회원가입 비밀번호 찾기를 하나의 카드 안에서 전환
- Firebase 로그인 회원가입 비밀번호 재설정 기능 유지
- 비밀번호 보기 로그인 상태 유지 모바일 반응형 유지
- 기존 App Store My Runtime Admin Center 요청 게시판 기능 유지

---

# STEP11 Ultimate 개발 보고서

이번 단계는 단일 기능 추가가 아니라 운영 가능한 플랫폼으로 전환하기 위한 Foundation 작업입니다.

수정 파일

- index.html
- style.css
- workspace.js
- dashboard.js
- admin.js
- feedback.js
- operation.js 신규 추가
- README.md ProjectStatus.md CHANGELOG.md DevelopmentReport.md ProjectRoadmap.md Project.md 갱신

주요 검수

1. Senior Programmer Review
- 기존 Firebase 인증 구조 유지
- 기존 apps applications userAppAccess applicationHistory 경로 유지
- 승인 완료 항목이 대기 목록에 남는 문제를 로컬 캐시에서도 제거하도록 보강

2. Coding Worker Review
- 신규 기능은 operation.js로 분리해 기존 로직 충돌을 줄임
- 기존 dashboard admin feedback 파일은 필요한 부분만 최소 수정

3. Web Designer Review
- QA Notification Version Manager 카드형 UI 추가
- 기존 MasterOS 어두운 색상 체계 유지
- 모바일 단일 컬럼 대응 추가

4. QA Tester Review
- 로그인 후 일반 사용자 App Store 접근 가능
- 관리자 QA Dashboard 접근 가능
- 요청 게시판 등록 상태 변경 답변 가능
- Version Manager 목록 표시 가능

주의 사항

- Version Manager는 Stable 표시와 공지 생성 기반 단계입니다.
- 자동 배포와 앱 파일 버전 교체는 다음 Deployment Manager 단계에서 확장합니다.


## STEP11 Ultimate v1.1 개발 보고

### 수정 목적
PC 화면에서 로그인 카드가 화면 중앙이 아니라 왼쪽 영역에 배치되는 문제가 확인되었습니다.

### 원인
로그인 섹션이 `auth-landing`과 `login-gate` 클래스를 동시에 사용하면서 기존 `auth-landing`의 2컬럼 레이아웃이 최종 로그인 게이트에도 남아 있었습니다.

### 조치
`login-gate` 상태에서는 강제로 1컬럼 중앙 정렬을 사용하도록 CSS 우선순위를 보강했습니다.

### 검수 결과
기존 Firebase 로그인 회원가입 비밀번호 찾기 구조는 변경하지 않았고 화면 배치 CSS만 수정했습니다.

# STEP12 Platform Core Modularization 개발 보고

## 목표
MasterOS를 장기적으로 안정적인 플랫폼으로 발전시키기 위해 기능별 파일 구조와 공통 UI 기준을 도입했다.

## 작업 내용
- `core/` 디렉터리 추가
- `core/masteros-core.js` 공통 유틸리티 추가
- `core/ui-kit.css` 공통 UI 스타일 추가
- `pages/` 디렉터리 추가
- 로그인 대문 Dashboard App Store Runtime Admin Feedback 화면 템플릿 추가
- `modules/` 디렉터리 추가
- auth workspace admin store runtime feedback notifications 모듈 경계 문서화
- index.html은 기존 기능 보존을 위해 운영 진입점으로 유지

## 검수 결과
- 기존 script module 로딩 순서 유지
- Firebase 초기화 파일 유지
- 기존 DOM ID 유지
- 기존 인증 승인 App Store Runtime 관리자 흐름 유지
- 새로운 Core 파일은 기존 로직을 직접 변경하지 않는 안전 확장 방식으로 적용

## 다음 권장 작업
STEP12-v2에서 App Details 화면과 사용자 프로필 화면을 실제 라우팅 메뉴로 연결한다.
