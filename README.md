# Master App Platform

현재 버전: `master-app-platform-step10-v1`

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
