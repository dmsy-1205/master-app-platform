# Master App Platform STEP 4.1 Fix

## 목표
STEP4 회원 신청 시스템 적용 중 발생한 auth.js 문법 오류 수정

## 수정 내용
- auth.js 문자열 줄바꿈 문법 오류 수정
- pages/application.js 문자열 줄바꿈 문법 오류 수정
- 로그인 상태 확인 실패 시 화면에 오류 메시지 표시
- 기존 STEP3 관리자 계정 로그인 흐름 유지
- 회원 status 값에 따른 페이지 이동 유지

## 포함 기능
- 회원가입 시 users/{uid}/status = new 저장
- 로그인 후 users/{uid} 정보 확인
- 일반 사용자 status new 또는 rejected → 신청 페이지 이동
- 일반 사용자 status pending → 승인 대기 페이지 이동
- 일반 사용자 status approved → 사용자 대시보드 이동
- 관리자 role admin → 기존 STEP3 화면 유지
- 신청 정보 applications/{uid} 저장
- 신청 완료 후 users/{uid}/status = pending 변경

## GitHub 업로드 방법
1. ZIP 압축을 풉니다.
2. GitHub 저장소의 기존 파일 위에 전체 덮어쓰기 합니다.
3. Commit changes를 누릅니다.
4. Netlify 자동 배포가 끝날 때까지 기다립니다.
5. 사이트에서 Ctrl + F5로 강력 새로고침합니다.

## 테스트 순서
1. 사이트 접속
2. F12 Console에서 auth.js SyntaxError가 사라졌는지 확인
3. 기존 관리자 계정 로그인
4. 로그인 상태에 이메일 / 권한 / 상태 표시 확인
5. 새 일반 계정 회원가입
6. 로그인 후 신청 페이지로 이동하는지 확인
7. 신청 정보 입력 후 승인 대기 페이지 이동 확인

## 주의
이번 단계는 STEP4 회원 신청 시스템입니다.
관리자 승인 기능은 STEP5에서 구현합니다.
