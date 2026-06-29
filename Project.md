# Master App Platform

# AI 개발 프로젝트 헌장 (Project.md)

---

# 프로젝트명

Master App Platform

현재 버전

master-app-platform-step10-v9

---

# 프로젝트 목적

Master App Platform은 여러 개의 웹 애플리케이션을 하나의 플랫폼에서 운영하기 위한 통합 플랫폼이다.

최종 목표는

* 회원가입
* 로그인
* 승인 시스템
* 권한 관리
* 앱 관리
* 사용자 Dashboard
* 관리자 Dashboard
* 다중 앱 실행
* Firebase 기반 권한 관리
* Netlify 자동 배포

를 하나의 플랫폼에서 운영하는 것이다.

---

# 현재 완료 단계

✅ STEP1

Firebase Authentication

회원가입

로그인

로그아웃

자동 로그인

---

✅ STEP2

Realtime Database

읽기

쓰기

삭제

---

✅ STEP3

관리자 권한 시스템

users

admins

role 관리

---

✅ STEP4

회원 신청 시스템

applications 저장

회원 상태 관리

new

pending

approved

rejected

---

✅ STEP5

회원 승인 시스템

관리자 승인

거절

회원 상태 변경

---

✅ STEP6

다중 서브 애플리케이션 등록

동적 라우팅

실시간 앱 활성화

MasterRouter

Firebase 앱 메타데이터 관리

---

# 다음 개발 목표

STEP7

사용자 Dashboard

STEP8

앱 연결

STEP9

관리자 SPA 구조 및 사용자 경험 고도화

STEP10

App Security Platform

---

# 가장 중요한 개발 규칙

이 프로젝트는

"AI가 프로젝트를 직접 개발"

하는 방식이다.

사용자는

코드를 수정하지 않는다.

사용자는

GitHub에 업로드만 한다.

---

# 반드시 지켜야 하는 작업 순서

사용자가

현재 프로젝트 ZIP

또는

ProjectStatus.md

를 업로드하면

AI는 반드시

① 프로젝트 전체를 분석한다.

② 현재 버전을 확인한다.

③ 기존 기능을 검토한다.

④ 기존 기능을 절대 깨뜨리지 않는다.

⑤ 다음 STEP만 개발한다.

⑥ 프로젝트 전체를 수정한다.

⑦ ZIP 파일을 생성한다.

⑧ README를 갱신한다.

⑨ ProjectStatus를 갱신한다.

⑩ 다운로드 가능한 ZIP을 제공한다.

---

# 절대 하면 안 되는 행동

코드만 출력

"이 부분을 수정하세요"

"붙여넣으세요"

새 프로젝트 생성

Firebase 다시 만들기

GitHub 다시 만들기

Netlify 다시 만들기

기존 기능을 삭제하거나 변경

---

# 반드시 해야 하는 행동

기존 프로젝트를 기준으로 수정

기존 구조 유지

기존 로그인 유지

기존 Firebase 유지

기존 관리자 기능 유지

새 기능만 추가

항상 테스트 가능한 프로젝트 상태 유지

---

# 출력 규칙

매 STEP마다 반드시

1. 수정된 프로젝트

2. README.md 갱신

3. ProjectStatus.md 갱신

4. ZIP 생성

5. 다운로드 제공

위 다섯 가지를 모두 완료해야 한다.

코드만 출력하는 것은 허용되지 않는다.

---

# 개발 철학

기존 기능 안정성을 최우선으로 한다.

새로운 기능보다

기존 기능이 정상 동작하는 것을 우선한다.

오류가 발생하면

새 기능 개발을 중단하고

먼저 오류를 수정한다.

---

# 현재 프로젝트 상태

현재 프로젝트는

master-app-platform-step10-v9

이다.

다음 개발은

STEP7 사용자 Dashboard

부터 시작한다.

절대로 STEP1부터 다시 만들지 않는다.


---

✅ STEP9-v4

검색 알림 프로필 활동 로그 즐겨찾기 기능 추가

다음 개발 목표

STEP10 Firebase Rules 및 보안 강화


## STEP9-v7 추가 규칙
앱 등록은 초보자도 사용할 수 있게 예시 자동 채우기와 입력 검증을 제공한다. 즐겨찾기는 사용자별 Firebase 데이터로 저장한다.


## STEP9-v8 업데이트
Platform Launcher 실행 엔진을 보강하여 대표 앱 실행과 즐겨찾기 실행을 실제 앱 실행으로 연결했다.


---

# STEP10-v1 완료

App Security Platform 1차 구현 완료

* App Manifest 시스템
* Launch Token 생성 구조
* Permission Engine
* Official App Platform Verified Badge
* 생활관리 앱 Official App 지정
* Version Manager 기초 구조
* Execution Log 앱별 사용자별 기록
* Dashboard App Store Runtime 연동

주의

현재 Token 검증은 클라이언트 기반 1차 구조이며 다음 단계에서 Firebase Rules 또는 Cloud Functions로 서버 검증을 강화한다.


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


## STEP10-v4 작업 원칙 추가
App Store는 발견 신청 공간이다
My Runtime은 승인된 앱만 실행하는 공간이다
앱 실행은 App Store 실행 버튼 또는 My Runtime 승인 앱 클릭을 통해 Launch Token 생성 후 진행한다
승인 전 hash 직접 접근이나 Runtime 메뉴 노출은 허용하지 않는다


## STEP10-v4 추가 규칙

App Store는 앱 발견과 신청 공간이다
사용 신청 후에는 승인 대기중 상태가 즉시 사용자 화면에 보여야 한다
관리자 승인 화면은 pending approved rejected 상태를 버튼 문구와 색상으로 명확히 구분해야 한다


## STEP10-v5 Approval UX Stabilization
- App Store 신청 상태를 사용 신청 승인 대기중 실행 흐름으로 실시간 동기화했습니다.
- 관리자 승인 관리는 기본적으로 대기 신청만 표시하고 승인/거절 이력은 탭으로 분리했습니다.
- 승인 또는 거절 처리 후 대기 목록에서 자동 정리되도록 개선했습니다.
- 승인 완료 거절 완료 버튼 상태를 명확하게 고정 표시하도록 개선했습니다.
- 사용자 편의성과 운영자 관리성을 우선으로 검수했습니다.

## STEP10-v6 작업 규칙 반영
승인 관리는 대기 신청 중심으로 운영합니다.
처리된 신청은 화면에서 계속 노출하지 않고 이력 저장소로 이동합니다.
사용자 불편 사항과 버그는 요청 게시판으로 수집합니다.
이후 기능 추가는 게시판에 축적된 실제 요청과 버그를 기준으로 우선순위를 정합니다.


---

# STEP10-v9 Mobile Responsive UI

모바일 사용을 위해 전체 화면 반응형 구조를 보강했습니다.

핵심 적용 사항

* PC 기능 유지
* 스마트폰 상단 메뉴 전환
* App Store My Runtime Admin Center 요청 게시판 모바일 카드화
* 버튼 터치 영역 확대
* 긴 이메일 UID URL 자동 줄바꿈
* 관리자 승인 목록 모바일 가독성 개선

다음 단계는 실제 스마트폰 테스트 결과를 기반으로 하단 탭 네비게이션과 알림 기능을 검토합니다.


# STEP10-v9 Login Landing UI Renewal

## 작업 원칙

새 프로젝트를 만들지 않고 기존 STEP10-v7 구조를 유지한 상태에서 공개 로그인 화면만 개선했습니다.

## 변경 범위

- index.html 공개 인증 섹션
- style.css 로그인 랜딩 전용 스타일
- auth.js 비밀번호 보기 토글 로그인 유지 옵션
- README ProjectStatus CHANGELOG DevelopmentReport ProjectRoadmap 문서 갱신

## 유지 범위

- Firebase 인증
- 관리자 권한 유지
- Dashboard App Store My Runtime Request Board Admin Center
- 승인 신청 실행 로그 요청 게시판 흐름


---

## STEP10-v9 Login Gate Renewal

- 대문 로그인 화면을 중앙형 Login Gate UI로 개편
- 상단 소개 기능 요금제 고객지원 메뉴 제거
- 로그인 회원가입 비밀번호 찾기를 하나의 카드 안에서 전환
- Firebase 로그인 회원가입 비밀번호 재설정 기능 유지
- 비밀번호 보기 로그인 상태 유지 모바일 반응형 유지
- 기존 App Store My Runtime Admin Center 요청 게시판 기능 유지

---

# STEP11 Ultimate Platform Foundation

작업 원칙

- 기존 STEP10-v9 프로젝트를 유지하고 새 프로젝트를 만들지 않는다.
- 로그인 회원가입 비밀번호 찾기 관리자 사용자 앱스토어 런타임 요청게시판 기능을 보존한다.
- 기능을 한꺼번에 추가하되 operation.js로 운영 기능을 분리하여 충돌 위험을 줄인다.

추가 완료

- QA Dashboard
- 요청 게시판 고도화
- Notification Center
- Dashboard 운영 지표 기반
- App Store 필터
- 승인센터 정리 안정화
- Version Manager 기초
- UI Kit 기반 스타일 보강
