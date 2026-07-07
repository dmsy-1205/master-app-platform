# HearU2nite STEP7-1 적용 가이드

## 적용 파일
- `index.html`
- `assets/css/hearu-step7-identity.css`

## 적용 방법
1. GitHub Desktop에서 `Repository → Show in Explorer`로 프로젝트 루트를 엽니다.
2. ZIP 안의 파일을 프로젝트 루트에 그대로 덮어씁니다.
3. 반드시 `index.html` 안에 `hearu-step7-identity.css`가 들어갔는지 확인합니다.
4. 브라우저에서 `Ctrl + F5`로 강력 새로고침합니다.

## 변경 범위
- MasterOS 사용자 노출 문구를 HearU2nite Platform으로 교체
- 기존 CSS보다 나중에 로드되는 STEP7 override CSS 추가
- 밝은 플랫폼 디자인, 카드, 버튼, 반응형 navigation 적용

## 절대 건드리지 않은 영역
- Firebase
- Auth
- Approval Engine
- Access Gate
- Runtime
- Router
- UID 구조
- 앱 실행 로직

## GitHub Summary
`feat: apply HearU2nite STEP7-1 identity override layer`

## Description
`Add a safe post-loaded HearU2nite identity CSS layer and rebrand visible MasterOS labels while preserving Firebase, authentication, approval, runtime, router, and UID behavior.`
