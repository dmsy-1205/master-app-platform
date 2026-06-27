# Project Status - Master App Platform

## 대시보드 요약

- 현재 진행 완료 단계: STEP 8 앱 연결 시스템 완료
- 프로젝트 타깃 버전 명칭: master-app-platform-step08-v1
- 다음 개발 예정 단계: STEP 9 Firebase Rules 보안 적용

## 단계별 세부 마일스톤 현황

- [x] STEP 1: 이메일 기반 회원가입 / 로그인 / 로그아웃 / 세션 자동로그인 유지 완료
- [x] STEP 2: Realtime Database 테스트 엔드포인트 연동 완료
- [x] STEP 3: 테스트 계정 전용 관리자 수동 할당 및 데이터베이스 분리 완료
- [x] STEP 4: 회원 승인 신청 트래킹을 위한 applications/ 테이블 연동 완료
- [x] STEP 5: 관리자 전용 대시보드 기반 회원 승인/거절 처리 시스템 완료
- [x] STEP 6: 다중 서브 애플리케이션 등록 및 라우팅 메타데이터 관리 완료
- [x] STEP 7: 사용자 Dashboard 완료
- [x] STEP 8: 앱 연결 시스템 완료
- [ ] STEP 9: Firebase Rules 보안 적용 대기
- [ ] STEP 10: Netlify 최종 배포 및 API Key 제한 대기

## STEP 8 구현 내용

- 사용자 Dashboard 앱 카드 UI 확장
- 활성화된 앱만 사용자 Dashboard에 표시
- 승인 완료 사용자만 앱 실행 가능하도록 기존 승인 상태와 연결
- 앱 실행 버튼 추가
- 앱 실행 방식 지원
  - 플랫폼 내부 실행 router
  - 새 탭 실행 newTab
  - 현재 창 이동 sameTab
- 앱 실행 시 실행 횟수 runCount 증가
- 앱 실행 시 최근 실행 시간 lastRunAt 저장
- 앱 실행자 lastRunBy 저장
- 사용자별 앱 실행 로그 appRunLogs/{uid}/{appId} 저장
- users/{uid}/lastAppLaunch 마지막 실행 앱 정보 저장
- 앱 등록 폼에 앱 버전 version 필드 추가
- 앱 등록 폼에 실행 방식 launchMode 필드 추가
- 기존 앱 재등록 시 실행 기록이 초기화되지 않도록 보존

## 기존 기능 보존 점검

- Firebase 설정 파일은 변경하지 않음
- 기존 Authentication 로직은 변경하지 않음
- 기존 Database 테스트 로직은 변경하지 않음
- 기존 관리자 등록 승인 거절 로직은 변경하지 않음
- 기존 회원 신청 로직은 변경하지 않음
- 기존 STEP6 앱 활성화 비활성화 버튼 로직 유지
- 기존 STEP6 MasterRouter 내부 앱 fetch 실행 구조 유지
- 기존 STEP7 사용자 Dashboard 승인 상태 조회 구조 유지

## 다음 작업

STEP 9에서는 Firebase Rules를 적용하여 관리자 일반 사용자 승인 사용자별로 데이터 접근 권한을 강화합니다.
