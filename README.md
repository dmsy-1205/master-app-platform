# Master App Platform

현재 버전: `master-app-platform-step10-v9`

## 목적
여러 웹 애플리케이션을 하나의 플랫폼에서 회원 승인 권한 관리 앱 등록 실행 로그와 함께 운영하는 통합 App Platform입니다.

## STEP10-v1 주요 변경
- App Manifest 시스템 추가
- 앱 등록 시 Owner Category Permission Official 공개여부 업데이트 노트 저장
- Launch Token 생성 흐름 추가
- Token 없는 Runtime 직접 접근 차단 구조 추가
- Permission Engine 추가
- 관리자 승인 사용자 관리자 Official App 권한 분기 추가
- 생활관리 앱을 Platform Verified Official App 프리셋으로 지정
- Version Manager 기초 구조 추가
- Execution Log를 `executionLogs/{appId}`와 기존 `appRunLogs/{uid}`에 동시 기록
- Dashboard App Store 카드에 Verified Badge Category 표시

## 배포 방식
1. ZIP 압축 해제
2. GitHub 저장소에 파일 덮어쓰기 업로드
3. Netlify 자동 배포 확인
4. 로그인 후 관리자 권한 확인
5. 앱 관리에서 아가 생활관리 앱 프리셋을 다시 등록 또는 업데이트
6. Dashboard App Store에서 실행 버튼으로 Runtime 실행 확인

## STEP10 보안 흐름
`Dashboard/App Store 실행 버튼` → `Permission Engine 검사` → `Launch Token 발급` → `Execution Log 기록` → `Runtime 이동` → `Token 확인 후 앱 로드`

주의 현재 단계의 Launch Token은 클라이언트 기반 1차 보안 구조입니다. 완전한 서버 검증은 Firebase Rules 또는 Cloud Functions 연동 단계에서 강화해야 합니다.


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


## STEP10-v4 안내
일반 사용자는 App Store에서 앱 설명을 확인하고 사용 신청을 할 수 있다
관리자가 승인하면 해당 앱이 My Runtime에 표시되고 클릭 시 보안 토큰을 생성한 뒤 실행된다
승인되지 않은 앱은 My Runtime에 표시되지 않는다


## STEP10-v4 변경 요약

App Store에서 앱 사용 신청 후 버튼이 승인 대기중으로 바뀌며 중복 신청을 막는다
관리자 승인 화면은 승인 처리 거절 처리 승인 완료 거절 완료를 색상과 문구로 구분한다


## STEP10-v5 Approval UX Stabilization
- App Store 신청 상태를 사용 신청 승인 대기중 실행 흐름으로 실시간 동기화했습니다.
- 관리자 승인 관리는 기본적으로 대기 신청만 표시하고 승인/거절 이력은 탭으로 분리했습니다.
- 승인 또는 거절 처리 후 대기 목록에서 자동 정리되도록 개선했습니다.
- 승인 완료 거절 완료 버튼 상태를 명확하게 고정 표시하도록 개선했습니다.
- 사용자 편의성과 운영자 관리성을 우선으로 검수했습니다.

## STEP10-v6 사용 안내
관리자는 승인 관리에서 기본적으로 대기 신청만 확인합니다.
승인 또는 거절된 신청은 자동으로 대기 목록에서 사라지고 승인 이력 또는 거절 이력에서 확인할 수 있습니다.
일반 사용자는 요청 게시판에서 버그 신고 기능 요청 화면 개선 의견을 등록할 수 있습니다.
관리자 계정은 요청 게시판 항목을 검토중 완료 보류 상태로 변경할 수 있습니다.

## STEP10-v9 Mobile Responsive UI

스마트폰에서도 MasterOS를 사용할 수 있도록 반응형 UI를 보강했습니다.

### 모바일 개선 항목

- 사이드 메뉴 모바일 상단 전환
- App Store 카드 세로 정렬
- My Runtime 화면 세로 정렬
- 신청관리 요청게시판 입력폼 모바일 최적화
- 관리자 승인관리 탭과 버튼 터치 영역 개선
- 긴 이메일 UID URL 화면 깨짐 방지

### 확인 방법

브라우저 개발자 도구에서 모바일 화면으로 전환하거나 실제 스마트폰에서 배포 주소를 열어 확인합니다.


## STEP10-v9 Login Landing UI Renewal

- 로그인 첫 화면을 SaaS 랜딩형 UI로 재구성했습니다.
- 상단 네비게이션 소개 기능 요금제 고객지원 영역을 추가했습니다.
- 히어로 카피 기능 카드 플랫폼 단계 보안 안내를 배치했습니다.
- 로그인 회원가입 카드를 프리미엄 다크 글래스 스타일로 재디자인했습니다.
- 비밀번호 보기 버튼과 로그인 상태 유지 체크박스를 추가했습니다.
- 기존 Firebase 로그인 회원가입 관리자 권한 흐름은 유지했습니다.
- 모바일에서는 랜딩 영역과 인증 카드가 세로로 자연스럽게 정렬됩니다.


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

이번 버전은 MasterOS를 단순 앱 실행기에서 운영 가능한 App Platform으로 확장하는 기반 버전입니다.

추가 기능

- QA Dashboard
- HelpDesk형 요청 게시판
- Notification Center
- App Store 검색 카테고리 정렬 필터
- 승인센터 대기 목록 정리 보강
- Version Manager 기초
- 관리자 답변 기능
- 공통 UI 스타일 보강

테스트 순서

1. 로그인 회원가입 비밀번호 찾기 확인
2. 일반 사용자 App Store 신청 승인대기 실행 흐름 확인
3. 관리자 승인센터에서 대기 신청만 표시되는지 확인
4. 요청 게시판에 버그 또는 요청 등록
5. 관리자 계정으로 답변과 상태 변경
6. 알림 센터에서 처리 결과 확인
7. 앱 관리에서 Version Manager 목록 확인


## STEP11 Ultimate v1.1

PC 로그인 대문 중앙 정렬 문제가 수정되었습니다. 기존 인증 기능은 유지됩니다.

# STEP12 Platform Core

MasterOS는 STEP12부터 유지보수 가능한 플랫폼 구조로 전환한다.

## 추가된 구조

```text
core/
  masteros-core.js
  ui-kit.css

pages/
  login.html
  dashboard.html
  app-store.html
  runtime.html
  admin.html
  feedback.html

modules/
  auth/
  workspace/
  admin/
  store/
  runtime/
  feedback/
  notifications/
```

## 운영 방식
현재 배포 진입점은 여전히 `index.html`이다.
기존 Firebase 로그인과 관리자 기능을 깨뜨리지 않기 위해 기능 분리는 단계적으로 진행한다.

## 개발 원칙
- 기존 DOM ID 유지
- 기존 Firebase 구조 유지
- 신규 기능은 core와 modules 기준으로 추가
- 공통 UI는 `core/ui-kit.css` 기준 사용


## STEP12-v2 관리자 운영 기능
앱 관리 화면에서 등록된 앱의 수정 버튼을 눌러 소개글 버전 Entry URL 권한 공개 여부를 다시 저장할 수 있습니다. 알림 센터에는 관리자 공지 작성 영역이 추가되었고 요청 게시판과 공지성 알림은 관리자가 삭제할 수 있습니다.


## STEP13 Service Platform
관리자 센터에 앱 운영을 위한 핵심 센터가 추가되었습니다.
App Detail Center Official App Center Deployment Center Health Monitor Backup Center Developer Center를 통해 앱 생태계 운영 기반을 제공합니다.

---

# STEP14-v1 Service Centers

이번 버전은 STEP13 Service Platform을 유지하면서 관리자 센터에 Web OS 운영 기능을 추가합니다.

## 주요 추가 기능

- App Detail Center: 앱 상세 정보, Manifest, Version History 표시
- Official App Center: Official Badge, Featured App 토글
- Plugin SDK Generator: manifest.json, permission.json, README.md 자동 초안 생성
- Deployment Center: Stable / Beta / Rollback 상태 관리
- Health Monitor: Firebase/Auth/Runtime/Launcher/Database 상태 확인
- Backup Center: 주요 Firebase 컬렉션 JSON Export
- Developer Center: 앱 등록 전 Manifest, Permission, Entry, Version, Security 검사
- Statistics Dashboard: 사용자, 앱, 실행 수, 승인/거절/오류 집계
- Security Scan Center: 앱별 보안 점수 표시

## 적용 방법

수정 파일만 기존 프로젝트에 덮어쓰기합니다.

필수 추가 파일:

- step14.js

필수 수정 파일:

- index.html
- workspace.js
- style.css

문서 갱신 파일:

- README.md
- Project.md
- ProjectStatus.md
- CHANGELOG.md
- DevelopmentReport.md
- ProjectRoadmap.md
