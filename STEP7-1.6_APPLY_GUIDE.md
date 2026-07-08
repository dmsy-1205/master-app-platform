# HearU2nite STEP7-1.6 Login Auth Visibility Fix

## 목적
로그인 성공 알림 후에도 로그인 화면이 계속 남아 있는 문제를 수정합니다.

## 원인
STEP7-1 로그인 전용 CSS가 `.login-gate`에 `display: grid !important`를 사용했습니다.
기존 `auth.js`는 로그인 성공 후 public section을 `style.display = "none"`으로 숨기는데, CSS의 `!important`가 이를 덮어 로그인 화면이 계속 보였습니다.

## 수정 파일
- `index.html`
- `auth.js`
- `assets/css/login-identity.css`
- `STEP7-1.6_APPLY_GUIDE.md`

## 검수
1. Netlify와 Firebase 주소 모두 접속
2. 로그인
3. "로그인 성공" 확인 후 로그인 화면이 사라지는지 확인
4. Dashboard / App Store / Admin Center 접근 확인
5. 로그아웃 후 로그인 화면이 다시 보이는지 확인

## GitHub Summary
`fix: restore authenticated shell after login identity CSS`

## GitHub Description
`Fix STEP7-1 login gate visibility so the public login screen no longer overrides authenticated workspace display after successful Firebase login.`
