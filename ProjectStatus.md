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

기존 프로젝트

our-baby-care

절대 수정 금지

기존 Firebase 절대 수정 금지

새 프로젝트(master-app-platform)만 사용

-----------------------------------------

Firebase Project

master-app-platform

Authentication

완료

Realtime Database

완료

-----------------------------------------

GitHub

생성 완료

Netlify

GitHub 자동배포 연결 완료

-----------------------------------------

현재 완료 단계

STEP1

Firebase Authentication

회원가입 완료

로그인 완료

로그아웃 완료

자동 로그인 완료

-----------------------------------------

STEP2

Realtime Database

쓰기 완료

읽기 완료

삭제 완료

-----------------------------------------

STEP3

관리자 권한 시스템

users 생성 완료

admins 생성 완료

role 저장 완료

관리자 등록 테스트 완료

관리자 확인 완료

로그인 상태에 admin 권한 표시 완료

-----------------------------------------

STEP4

회원 신청 시스템

회원가입 후 status new 저장 완료

로그인 후 status 확인 완료

new 회원 신청 페이지 이동 완료

신청 정보 applications 저장 완료

신청 완료 후 users status pending 변경 완료

승인 대기 페이지 이동 완료

approved 사용자를 위한 dashboard 기본 화면 생성 완료

-----------------------------------------

현재 Database 구조

users

    uid

        uid

        email

        role

        status

        createdAt

        updatedAt

admins

    uid

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

pages/apply.html

pages/pending.html

pages/dashboard.html

pages/application.js

-----------------------------------------

다음 개발 목표

STEP5

승인 시스템

관리자 로그인

↓

신청 목록 확인

↓

신청자 상세 확인

↓

승인 또는 거절

↓

users status 변경

↓

applications status 변경

-----------------------------------------

앞으로 구현 예정

STEP5

승인 시스템

STEP6

앱 관리

STEP7

사용자 대시보드

STEP8

앱 연결

STEP9

Firebase Rules

STEP10

최종 배포 및 보안

-----------------------------------------

개발 원칙

기능 하나씩 개발

각 STEP마다 테스트

성공 후 다음 STEP 진행

초보자도 이해할 수 있도록 설명

모든 STEP마다

ZIP 파일 제공

README 제공

ProjectStatus 갱신

-----------------------------------------

다음 작업

STEP5 승인 시스템 구현

관리자 화면에서 applications 목록을 읽고
승인 또는 거절할 수 있도록 구현 예정

=========================================
