# HearU2nite STEP7-1 Login Identity 적용 가이드

## 기준 버전

- Base: HearU2nite_v1.1_STEP5_STE6_admin_ROLLBACK_BASE_FULL
- Scope: Login Identity only
- 제공 방식: modified files only

## 수정 범위

이번 STEP7-1은 로그인 공개 화면만 HearU2nite 브랜드로 전환합니다.

수정 파일:

- index.html
- style.css

추가 문서:

- STEP7-1_APPLY_GUIDE.md

## 변경 내용

- 브라우저 타이틀을 HearU2nite Platform - Multi-App Console로 변경
- 로그인 게이트 브랜드를 MasterOS에서 HearU2nite로 변경
- 로그인 안내 문구를 Multi-App Platform Console 정체성에 맞게 변경
- HearMe2nite를 Flagship App으로 표시
- Approval Gate / Cross-Device UX 태그 추가
- 회원가입 안내 문구를 사용자 포털 흐름에 맞게 변경
- 로그인 화면 색상 체계를 밝은 Sky Blue / Indigo / White Surface 방향으로 변경
- 기존 로그인/회원가입/비밀번호 찾기 input id와 button id는 그대로 유지

## 변경하지 않은 영역

다음 파일은 수정하지 않았습니다.

- auth.js
- firebase.js
- database.js
- security.js
- routing.js
- dashboard.js
- workspace.js
- admin.js
- operation.js
- core/ui-kit.css
- Firebase Rules
- Platform Engine
- Approval Engine
- Access Gate

## 적용 방법

1. 현재 정상 작동 중인 프로젝트 루트에 ZIP 압축을 풉니다.
2. 같은 파일명은 덮어씁니다.
3. GitHub Desktop에서 변경 파일을 확인합니다.
4. 로컬/배포 환경에서 로그인 화면과 기능을 검수합니다.

## GitHub Summary

feat: apply HearU2nite STEP7-1 login identity

## GitHub Description

Rebrand the public login gate to HearU2nite Multi-App Platform Console while preserving Firebase authentication, signup, password reset, approval flow, router, runtime, and platform engine behavior.

## QA 체크리스트

- 로그인 화면에서 MasterOS 노출이 제거되었는가
- HearU2nite 브랜드가 보이는가
- Multi-App Platform Console 정체성이 보이는가
- HearMe2nite가 Flagship App으로 표시되는가
- 이메일/비밀번호 입력 가능
- 로그인 버튼 정상 작동
- 로그인 상태 유지 체크박스 정상 작동
- 회원가입 전환 정상 작동
- 비밀번호 찾기 전환 정상 작동
- 재설정 메일 보내기 버튼 정상 작동
- 로그인 후 기존 Dashboard / Router 정상 이동
- Android 화면 깨짐 없음
- iPhone 화면 깨짐 없음
- Galaxy Fold 접힘 화면 깨짐 없음
- Galaxy Fold 펼침 화면 깨짐 없음
- 노트북 화면 깨짐 없음

## 롤백 방법

문제가 있으면 현재 기준 Full Source에서 다음 두 파일만 원복합니다.

- index.html
- style.css
