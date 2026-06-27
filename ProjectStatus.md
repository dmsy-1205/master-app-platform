=========================================
Master App Platform
Project Status v1.1
=========================================

프로젝트명
master-app-platform

목표
여러 개의 웹앱을 하나의 플랫폼에서
회원가입
로그인
신청
승인
권한관리
앱관리
관리자페이지
사용자페이지
배포까지 가능한 플랫폼 구축

-----------------------------------------

절대 원칙
기존 프로젝트 our-baby-care 절대 수정 금지
기존 Firebase 절대 수정 금지
새 프로젝트 master-app-platform 만 사용

-----------------------------------------

현재 완료 단계

STEP1
Firebase Authentication 완료
회원가입 완료
로그인 완료
로그아웃 완료
자동 로그인 완료

STEP2
Realtime Database 완료
쓰기 완료
읽기 완료
삭제 완료

STEP3
관리자 권한 시스템 완료
users 생성 완료
admins 생성 완료
role 저장 완료
관리자 등록 테스트 완료
관리자 확인 완료
로그인 상태에 admin 권한 표시 완료

STEP4
회원 신청 시스템 1차 구현 완료
회원가입 시 status new 저장
로그인 후 status 확인
신청 페이지 추가
신청 정보 applications 저장
신청 완료 후 status pending 변경
승인 대기 페이지 추가
사용자 대시보드 기본 화면 추가

STEP4.1 FIX
/auth.js:45 SyntaxError 수정 완료
pages/application.js 문자열 줄바꿈 문법 오류 수정 완료
로그인 확인 중 멈춤 현상 수정 완료

-----------------------------------------

현재 Database 구조

users
    uid
        email
        role
        status
        createdAt
        updatedAt

admins
    uid
        email
        role
        createdAt

applications
    uid
        uid
        email
        name
        phone
        company
        memo
        status
        createdAt

step2Test
    uid
        message
        email
        uid
        createdAt

-----------------------------------------

현재 프로젝트 파일

index.html
style.css
firebase.js
auth.js
database.js
admin.js
README.md
ProjectStatus.md
pages/application.js
pages/apply.html
pages/pending.html
pages/dashboard.html

-----------------------------------------

다음 개발 목표

STEP5
관리자 승인 시스템
관리자가 applications 목록 확인
신청자 상세 확인
승인 버튼
거절 버튼
승인 시 users/{uid}/status approved 변경
거절 시 users/{uid}/status rejected 변경

-----------------------------------------

개발 원칙
기능 하나씩 개발
각 STEP마다 테스트
성공 후 다음 STEP 진행
초보자도 이해할 수 있도록 설명
모든 STEP마다 ZIP 파일 제공
README 제공
ProjectStatus 갱신
=========================================
