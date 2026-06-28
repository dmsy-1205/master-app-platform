# Master App Platform

현재 버전: `master-app-platform-step10-v4`

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
