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
