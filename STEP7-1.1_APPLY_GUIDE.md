# HearU2nite STEP7-1.1 Login Identity Cache & Polish Fix

## 목적

STEP7-1 적용 후 Netlify와 Firebase Hosting에서 화면이 다르게 보이거나, 주소를 그대로 입력했을 때 이전 MasterOS 화면/이전 CSS가 보이는 문제를 해결합니다.

## 수정 범위

- `index.html`
  - CSS 링크에 버전 쿼리 추가
  - `core/ui-kit.css` 이후 전용 로그인 보정 CSS 로딩
  - 로그인 화면의 내부 개발용 태그 노출 제거
  - 로고 텍스트 정리

- `assets/css/login-identity.css`
  - 로그인 화면 전용 최종 오버라이드 CSS
  - 기존 `style.css` 또는 `core/ui-kit.css` 캐시/우선순위 문제를 회피하기 위해 가장 마지막에 로딩

- `firebase.json`
  - Firebase Hosting 캐시 방지 headers 추가

- `_headers`
  - Netlify 캐시 방지 headers 추가

## 적용 방법

1. ZIP 압축을 풉니다.
2. 프로젝트 루트에 그대로 덮어씁니다.
3. GitHub Desktop에서 변경 파일을 확인합니다.
4. Commit 후 Push합니다.
5. Netlify 자동 배포 완료를 확인합니다.
6. Firebase 자동 배포가 설정되어 있지 않다면 아래 명령어를 프로젝트 루트 터미널에서 실행합니다.

```bash
firebase deploy --only hosting
```

## GitHub Summary

fix: stabilize STEP7-1 login identity deployment cache

## GitHub Description

Add cache-control headers for Netlify and Firebase Hosting, version CSS assets, and load a final login-only identity stylesheet after the existing UI kit so the HearU2nite login screen renders consistently across Netlify and Firebase without changing authentication, approval, router, Firebase, or platform engine logic.

## 검수 항목

- `https://hearu2nite.netlify.app/` 주소 그대로 접속
- `https://master-app-platform.web.app/` 주소 그대로 접속
- 두 주소 모두 같은 밝은 HearU2nite 로그인 화면인지 확인
- `MasterOS 플랫폼에 오신 것을 환영합니다.` 문구가 보이지 않는지 확인
- 로그인 / 회원가입 / 비밀번호 찾기 / 로그인 상태 유지 정상 작동 확인
