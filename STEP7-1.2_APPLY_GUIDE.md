# HearU2nite STEP7-1.2 Login Viewport & Firebase Auto Deploy Fix

## 목적

STEP7-1.1 적용 후 Netlify와 Firebase Hosting 양쪽에서 로그인 화면은 적용되었지만, PC 화면 오른쪽에 기존 MasterOS 어두운 배경이 남는 문제와 Firebase Hosting이 GitHub Push 후 자동 배포되지 않는 문제를 해결합니다.

## 수정 범위

- `index.html`
  - CSS 버전을 `step7-1-2`로 갱신하여 브라우저/CDN 캐시를 강제로 갱신합니다.

- `assets/css/login-identity.css`
  - 로그인 Gate를 기존 부모 컨테이너 폭 제약에서 분리합니다.
  - `position: fixed`, `inset: 0`, `width: 100vw`, `min-height: 100dvh`를 적용하여 전체 viewport를 점유합니다.
  - PC / 모바일 / Galaxy Fold / 태블릿 / 가로모드 대응 미디어쿼리를 보강합니다.

- `.github/workflows/firebase-hosting-merge.yml`
  - `main` 브랜치 Push 시 Firebase Hosting 운영 사이트에 자동 배포되도록 GitHub Actions 워크플로를 추가합니다.
  - 기존 `firebase-hosting-pull-request.yml`은 PR Preview 전용이므로 유지합니다.

- `firebase.json`
  - 기존 STEP7-1.1 캐시 방지 설정을 유지합니다.

- `_headers`
  - Netlify 캐시 방지 설정을 유지합니다.

## 적용 방법

1. ZIP 압축을 풉니다.
2. 프로젝트 루트에 그대로 덮어씁니다.
3. GitHub Desktop에서 변경 파일을 확인합니다.
4. Commit 후 Push합니다.
5. Netlify 자동 배포 결과를 확인합니다.
6. GitHub 저장소의 Actions 탭에서 `Deploy to Firebase Hosting on merge`가 성공했는지 확인합니다.
7. Firebase 자동 배포가 처음 실패한다면 GitHub Secret `FIREBASE_SERVICE_ACCOUNT_MASTER_APP_PLATFORM` 존재 여부를 확인합니다.
8. 급하게 운영 반영이 필요하면 기존 방식처럼 프로젝트 루트 터미널에서 아래 명령을 한 번 실행합니다.

```bash
firebase deploy --only hosting
```

## 검수 체크리스트

### PC / 노트북
- `https://hearu2nite.netlify.app/` 오른쪽에 어두운 MasterOS 배경이 남지 않아야 합니다.
- `https://master-app-platform.web.app/`도 동일한 전체 화면 밝은 로그인으로 보여야 합니다.
- 주소 뒤에 `?v=`를 붙이지 않아도 최신 화면이 보여야 합니다.

### Android / iPhone
- 로그인 카드가 화면 밖으로 밀리지 않아야 합니다.
- 회원가입 / 비밀번호 찾기 전환 버튼이 정상 클릭되어야 합니다.
- 키보드가 올라와도 입력창 접근이 가능해야 합니다.

### Galaxy Fold Cover
- 좁은 화면에서 로고와 로그인 카드가 겹치지 않아야 합니다.
- 입력창, 로그인 버튼, 회원가입, 비밀번호 찾기가 모두 보여야 합니다.

### Galaxy Fold Open / Tablet
- 화면이 좌측 일부만 차지하지 않아야 합니다.
- 로그인 배경이 전체 화면을 덮어야 합니다.
- 카드가 과도하게 커지지 않고 중앙에 안정적으로 배치되어야 합니다.

## GitHub Summary

fix: stabilize login viewport and Firebase hosting auto deploy

## GitHub Description

- Force STEP7-1.2 CSS cache refresh from index.html
- Make the public login gate cover the full viewport independent of legacy parent width constraints
- Add responsive rules for desktop, mobile, Fold cover/open, tablet, and landscape layouts
- Add Firebase Hosting production deploy workflow for main branch pushes
- Preserve Firebase Auth, approval, router, admin, runtime, and platform engine logic
