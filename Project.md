# Master App Platform

# AI 개발 프로젝트 헌장 (Project.md)

---

# 프로젝트명

Master App Platform

현재 버전

master-app-platform-step09-v7

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

최종 배포 및 보안

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

master-app-platform-step09-v7

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
