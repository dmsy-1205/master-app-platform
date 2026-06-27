# Project Status - Master App Platform

## 대시보드 요약

- 현재 진행 완료 단계: STEP 7 사용자 Dashboard 완료 및 STEP6 라우팅 상태 버튼 안정화
- 프로젝트 타깃 버전 명칭: master-app-platform-step07-v2
- 다음 개발 예정 단계: STEP 8 앱 연결

## 단계별 세부 마일스톤 현황

- [x] STEP 1: 이메일 기반 회원가입 / 로그인 / 로그아웃 / 세션 자동로그인 유지 완료
- [x] STEP 2: Realtime Database 테스트 엔드포인트 연동 완료
- [x] STEP 3: 테스트 계정 전용 관리자 수동 할당 및 데이터베이스 분리 완료
- [x] STEP 4: 회원 승인 신청 트래킹을 위한 applications/ 테이블 연동 완료
- [x] STEP 5: 관리자 전용 대시보드 기반 회원 승인/거절 처리 시스템 완료
- [x] STEP 6: 다중 서브 애플리케이션 등록 및 라우팅 메타데이터 관리 완료
- [x] STEP 7: 사용자 Dashboard 완료
- [ ] STEP 8: 앱 연결 대기
- [ ] STEP 9: Firebase Rules 보안 적용 대기
- [ ] STEP 10: Netlify 최종 배포 및 API Key 제한 대기

## STEP 7 구현 내용

- 로그인 사용자의 이메일 UID 세션 상태 표시
- 관리자 여부 확인 및 권한 구분 표시
- 회원 신청 상태 조회 및 승인 상태 표시
- 신청 일시 처리 일시 표시
- 승인 완료 사용자에게 활성화된 서브 애플리케이션 목록 제공
- 앱 실행 버튼을 통한 기존 STEP6 MasterRouter 연동
- 승인 전 사용자에게 앱 제한 안내 표시

## 기존 기능 보존 점검

- Firebase 설정 파일은 변경하지 않음
- 기존 Authentication 로직은 변경하지 않음
- 기존 Database 테스트 로직은 변경하지 않음
- 기존 관리자 등록 승인 거절 로직은 변경하지 않음
- 기존 STEP6 동적 라우팅 엔진은 변경하지 않음
- 사용자 Dashboard만 신규 파일과 UI로 추가함


## STEP 7 안정화 v2 수정 내역

- 실시간 등재 서브 애플리케이션 라우팅 테이블의 활성화/비활성화 버튼 클릭 이벤트를 이벤트 위임 방식으로 보강
- `apps/{appId}/isActive` 갱신 시 Boolean 값으로 저장되도록 수정
- 상태 변경 시 `updatedAt` 기록 추가
- 기존 문자열 상태값과 Boolean 상태값을 함께 처리하는 `normalizeActiveStatus` 함수 추가
- 관리자 테이블 MasterRouter 사용자 Dashboard가 같은 활성 상태 판정 기준을 사용하도록 수정
- Firebase 권한 오류 또는 네트워크 오류 발생 시 관리자에게 alert로 원인 표시

## 다음 작업

STEP 8에서는 앱 연결 단계로 이동하여 사용자별 앱 접근 권한과 실제 서브 애플리케이션 접근 제어를 연결합니다.
