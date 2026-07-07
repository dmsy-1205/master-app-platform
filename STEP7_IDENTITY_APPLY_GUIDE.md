# HearU2nite STEP7-1 Platform Identity Foundation

## 적용 기준
- 기준 파일: `HearU2nite_v1.1_STEP5_ROLLBACK_BASE_FULL.zip`
- 목적: 기존 MasterOS 다크 콘솔 화면을 HearU2nite 밝은 플랫폼 UI 방향으로 전환

## 포함 파일
- `index.html`
- `style.css`

## 유지한 것
- Firebase 초기화 구조
- Auth / 승인 / Access Gate
- Runtime / Manifest / SDK
- 기존 Router 및 JS 모듈 로딩 순서
- 기존 UID / 로그인 방식

## 변경한 것
- 사용자 노출 브랜드 문구: MasterOS → HearU2nite Platform
- 로그인 화면 브랜드 문구 변경
- 로그인 후 Sidebar / Topbar / Dashboard 문구 변경
- 기존 다크 UI를 밝은 플랫폼 UI로 override
- 노트북 / Android / iPhone / Galaxy Fold 접힘 / 펼침 반응형 기반 추가

## GitHub Desktop Summary
`feat: apply HearU2nite STEP7 platform identity foundation`

## GitHub Desktop Description
`Rebrand MasterOS UI to HearU2nite and introduce the responsive bright platform design foundation while preserving existing authentication, approval, Firebase, router, runtime, and platform engine behavior.`

## QA 체크
1. 로그인 화면에서 MasterOS 문구가 사용자에게 보이지 않는지 확인
2. 로그인 가능 여부 확인
3. 로그인 후 기존 승인 상태/앱 실행/관리자 메뉴 동작 확인
4. 노트북 화면 확인
5. Android 화면 확인
6. iPhone 화면 확인
7. Galaxy Fold 접힘/펼침 화면 확인

## 주의
Firebase Hosting 설정 파일(`.firebaserc`, `firebase.json`, `.github/workflows/...`)은 이 패키지에 포함하지 않았습니다. Hosting 설정은 별도 커밋으로 관리하세요.
