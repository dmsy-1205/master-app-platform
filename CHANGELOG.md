# CHANGELOG

## master-app-platform-step10-v1
- `security.js` 추가
- App Manifest 생성 구조 추가
- Launch Token 생성 저장 구조 추가
- Permission Engine 추가
- 앱 실행 시 권한 검증 후 실행하도록 Dashboard Launcher 수정
- Runtime 직접 접근 시 Token 없으면 차단하도록 Routing 수정
- 앱 등록 폼에 Owner Category 권한 모드 권한 태그 Official 공개 표시 업데이트 노트 추가
- 관리자 앱 목록에 Manifest 요약과 Platform Verified Badge 표시
- 생활관리 앱 프리셋을 Official App으로 지정
- 앱 버전별 `versions` 저장 구조 추가
- 앱별 `executionLogs/{appId}` 기록 추가
- README ProjectStatus DevelopmentReport ProjectRoadmap Project.md 갱신

## STEP9-v8
- Platform Launcher 실행 엔진 보강
- 대표 앱 실행 버튼 실제 실행 연결
- Dashboard 즐겨찾기 실행 버튼 실제 실행 연결
- router/newTab/sameTab 실행 방식 처리 안정화
- 생활관리 앱 보안 진입점에서 테스트 실행 연결


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


## STEP10-v4 Runtime Permission Fix
- 승인되지 않은 일반 사용자의 My Runtime 동적 네비게이션 노출 문제 수정
- My Runtime 앱 클릭 시 Launch Token 생성 후 실행되도록 수정
- 앱별 사용 신청 데이터를 appAccessRequests 및 userAppAccess로 분리 저장
- 관리자 승인 시 사용자별 앱 권한이 함께 부여되도록 수정
- App Store는 공개 표시용 전시장 My Runtime은 승인된 실행 공간으로 분리


## STEP10-v4

- 일반 사용자 App Store 신청 후 버튼이 즉시 승인 대기중 상태로 전환되도록 수정
- 승인 대기중 앱은 중복 신청 버튼을 비활성화
- 관리자 승인 관리에서 승인 완료 거절 완료 상태 문구와 버튼 색상 구분 강화
- 신청 처리 상태가 다음 조회 시에도 명확히 보이도록 카드 상태 스타일 추가
- Request Lifecycle UX를 다음 단계 기준으로 정리


## STEP10-v5 Approval UX Stabilization
- App Store 신청 상태를 사용 신청 승인 대기중 실행 흐름으로 실시간 동기화했습니다.
- 관리자 승인 관리는 기본적으로 대기 신청만 표시하고 승인/거절 이력은 탭으로 분리했습니다.
- 승인 또는 거절 처리 후 대기 목록에서 자동 정리되도록 개선했습니다.
- 승인 완료 거절 완료 버튼 상태를 명확하게 고정 표시하도록 개선했습니다.
- 사용자 편의성과 운영자 관리성을 우선으로 검수했습니다.

## STEP10-v6
- 승인 관리 기본 목록에서 승인 완료 및 거절 완료 항목이 자동으로 제거되도록 처리했습니다.
- 처리된 신청은 `applicationHistory`로 이관하여 대기 목록과 이력 목록을 분리했습니다.
- 기존에 `applications`에 남아 있던 approved/rejected 레거시 신청도 관리자 동기화 시 자동 정리되도록 보정했습니다.
- 사용자 요청사항과 버그를 등록할 수 있는 요청 게시판을 추가했습니다.
- 요청 게시판은 버그 신고 기능 요청 화면 개선 기타 유형과 접수 검토중 완료 보류 상태를 지원합니다.

## STEP10-v9 Mobile Responsive UI

- 스마트폰 사용을 위해 전체 워크스페이스 레이아웃을 반응형으로 보강했습니다.
- 좌측 사이드바가 모바일에서 상단 2열 메뉴로 전환되도록 조정했습니다.
- App Store My Runtime 신청관리 승인관리 요청게시판 카드가 모바일에서 세로 정렬되도록 개선했습니다.
- 이메일 UID URL 긴 텍스트가 화면을 밀어내지 않도록 자동 줄바꿈을 강화했습니다.
- 관리자 탭 승인 필터 버튼 실행 버튼의 터치 영역을 44px 이상으로 확보했습니다.
- 테이블과 로그 영역은 모바일에서 가로 스크롤 또는 자동 줄바꿈으로 깨짐을 방지했습니다.


## STEP10-v9 Login Landing UI Renewal

### Added
- SaaS형 로그인 랜딩 페이지
- 상단 서비스 네비게이션
- 로그인 상태 유지 체크박스
- 비밀번호 보기 토글
- 보안 안내 및 플랫폼 단계 카드

### Changed
- 기존 기능형 로그인 화면을 프리미엄 랜딩 화면으로 개선
- 모바일 로그인 화면 가독성 개선

### Preserved
- Firebase 회원가입 로그인 로그아웃
- 관리자 권한 판별
- 기존 Workspace Dashboard App Store Runtime Admin 기능


---

## STEP10-v9 Login Gate Renewal

- 대문 로그인 화면을 중앙형 Login Gate UI로 개편
- 상단 소개 기능 요금제 고객지원 메뉴 제거
- 로그인 회원가입 비밀번호 찾기를 하나의 카드 안에서 전환
- Firebase 로그인 회원가입 비밀번호 재설정 기능 유지
- 비밀번호 보기 로그인 상태 유지 모바일 반응형 유지
- 기존 App Store My Runtime Admin Center 요청 게시판 기능 유지

---

## STEP11 Ultimate Platform Foundation

- QA Dashboard 추가
- 요청 게시판 고도화
  - 버그 기능요청 질문 개선사항 공지 카테고리 추가
  - 관리자 답변 입력 추가
  - 접수 검토중 개발중 완료 보류 상태 흐름 추가
- Notification Center 추가
  - 승인 결과 요청 게시판 업데이트 앱 업데이트 공지 통합 표시
- Dashboard 운영 지표 연동 기반 추가
- App Store 필터 추가
  - 검색 카테고리 정렬 최신순 인기순 이름순
- 승인센터 정리 안정화
  - 처리 완료 신청은 로컬 캐시에서도 즉시 제거
  - 승인 거절 이력은 applicationHistory로 이동
- Version Manager 기초 추가
  - 앱별 버전 업데이트 노트 Stable 표시 기반 추가
- UI Kit 성격의 공통 카드 버튼 배지 스타일 보강
- 20년차 프로그래머 코딩 작업자 웹디자이너 관점 검수 기준 반영


## STEP11 Ultimate v1.1

- 로그인 대문이 PC에서 왼쪽으로 밀리는 문제를 수정했습니다.
- `.auth-landing`의 기존 2컬럼 그리드가 `.login-gate`에 남아 있던 충돌을 제거했습니다.
- 로그인 카드가 데스크톱에서는 정확히 화면 정중앙에 배치되도록 보정했습니다.
- 모바일에서는 상단 브랜드 아래 자연스럽게 세로 배치되도록 유지했습니다.

## STEP12 Platform Core Modularization

- 기존 단일 index.html 중심 구조를 유지하면서 기능별 HTML 템플릿 디렉터리 `pages/`를 추가했다.
- 공통 UI Kit `core/ui-kit.css`를 추가해 버튼 카드 배지 토스트 스타일의 기준을 마련했다.
- 공통 유틸리티 `core/masteros-core.js`를 추가해 안전 키 생성 토스트 로딩 처리 버전 상수를 제공한다.
- 향후 기능별 JS 분리를 위한 `modules/` 구조와 모듈별 README를 추가했다.
- 기존 Firebase 로그인 회원가입 비밀번호 찾기 Dashboard App Store Runtime Admin Center 기능은 유지했다.
- 문서 기준 버전을 STEP12 Platform Core로 갱신했다.
