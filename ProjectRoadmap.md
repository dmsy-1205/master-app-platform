# ProjectRoadmap

## 완료
- STEP1~STEP8 기본 플랫폼 구축
- STEP9 관리자 SPA 사용자 UX 알림 검색 활동로그 즐겨찾기 Platform Launcher
- STEP10-v1 App Security Platform 1차 구축

## STEP10-v1 완료 항목
- App Manifest
- Launch Token
- Permission Engine
- Official App Badge
- Version Manager 기초 구조
- Execution Log
- Dashboard 연동

## 다음 단계 STEP10-v2 후보
- Firebase Rules 설계 문서와 실제 rules 초안 작성
- `launchTokens` 만료 검증 강화
- 사용자별 앱 권한 관리 UI 추가
- Official App 업데이트 알림 UI 추가
- 생활관리 앱의 외부 Netlify 의존도 제거 및 내부 보호 실행 전환

## 장기 목표
MasterOS를 단순 실행기가 아니라 웹앱 등록 권한 검증 보안 실행 로그 버전 업데이트 관리를 갖춘 App Platform으로 확장한다.


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


## 다음 로드맵
- 관리자 승인 화면을 앱별 권한 목록 중심으로 고도화
- 사용자별 앱 권한 회수 일시정지 만료일 기능 추가
- Launch Token 검증 Rules와 Runtime 보호 구조 강화


## 다음 단계 후보

STEP10-v5 또는 STEP11에서는 신청 이력 필터 상태별 조회 관리자 알림 사용자 알림 앱 업데이트 공지 버전 변경 로그를 강화한다


## STEP10-v5 Approval UX Stabilization
- App Store 신청 상태를 사용 신청 승인 대기중 실행 흐름으로 실시간 동기화했습니다.
- 관리자 승인 관리는 기본적으로 대기 신청만 표시하고 승인/거절 이력은 탭으로 분리했습니다.
- 승인 또는 거절 처리 후 대기 목록에서 자동 정리되도록 개선했습니다.
- 승인 완료 거절 완료 버튼 상태를 명확하게 고정 표시하도록 개선했습니다.
- 사용자 편의성과 운영자 관리성을 우선으로 검수했습니다.

## 다음 로드맵 STEP11 후보
1. 요청 게시판 고도화
   - 검색 필터 댓글 우선순위 첨부 이미지
2. Permission Engine 세분화
   - Official App 권한 Beta Tester Owner Role 분리
3. Runtime 실행 보호 강화
   - Launch Token 만료 검증 실행 세션 추적
4. 관리자 운영 대시보드
   - 대기 신청 수 신규 버그 수 최근 실행 수 통합 표시

## STEP10-v9 완료

- Mobile Responsive UI 안정화
- 스마트폰 카드 레이아웃 최적화
- 좌측 메뉴 모바일 상단 전환
- 관리자 승인 요청게시판 앱스토어 런타임 모바일 가독성 개선

## 다음 후보 STEP10-v9 또는 STEP11

1. 모바일 하단 탭 네비게이션 도입
2. 요청 게시판 댓글 우선순위 첨부 이미지 기능
3. 관리자 승인 알림 및 사용자 알림 기능
4. Permission Engine 세분화와 권한 회수 기능


## STEP10-v9 완료

- 로그인 랜딩 UI Renewal
- SaaS 첫인상 강화
- 비밀번호 보기 및 로그인 상태 유지 추가
- 모바일 인증 화면 대응

## 다음 후보

- STEP11 Permission Runtime Engine
- App Store 3.0 상세 페이지
- 관리자 승인 이력 검색 필터
- 요청 게시판 댓글 및 상태 알림


---

## STEP10-v9 Login Gate Renewal

- 대문 로그인 화면을 중앙형 Login Gate UI로 개편
- 상단 소개 기능 요금제 고객지원 메뉴 제거
- 로그인 회원가입 비밀번호 찾기를 하나의 카드 안에서 전환
- Firebase 로그인 회원가입 비밀번호 재설정 기능 유지
- 비밀번호 보기 로그인 상태 유지 모바일 반응형 유지
- 기존 App Store My Runtime Admin Center 요청 게시판 기능 유지

---

# STEP11 이후 로드맵

## STEP11 Ultimate 완료
운영 안정화와 플랫폼 기반 기능을 통합했습니다.

## 다음 후보 STEP

1. Deployment Manager
- 앱 버전별 배포 파일 관리
- Stable Beta 채널 분리
- 사용자 업데이트 알림 자동 발송

2. MasterOS UI Kit 정식화
- 버튼 카드 테이블 배지 모달 공통 컴포넌트 정리
- 전체 화면 디자인 통일

3. Firebase Rules 보안 강화
- 클라이언트 권한 확인을 DB Rules와 연동
- 승인 사용자만 앱별 데이터 접근 가능하도록 제한

4. Official App Center
- 생활관리 앱을 첫 번째 Official App으로 고정
- 향후 금융 메모 AI 일정 앱 등록 구조 확장
