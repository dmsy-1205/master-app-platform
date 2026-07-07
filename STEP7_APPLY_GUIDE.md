# HearU2nite STEP7 Design System 적용 가이드

## 기준 파일

- Base: `HearU2nite_v1.1_STEP5_ROLLBACK_BASE_FULL.zip`
- Output: `HearU2nite_STEP7_DesignSystem_modified_files_only.zip`

## 수정/추가 파일

1. `index.html`
   - 사용자 노출 브랜드 문구를 HearU2nite Platform 기준으로 변경
   - 기존 ID, data-route, Firebase/Router/Approval 관련 구조 유지
   - STEP7 CSS override 파일 로드 추가

2. `assets/css/hearu-step7-design-system.css`
   - HearU2nite 디자인 토큰 추가
   - PC/노트북/Android/iPhone/Galaxy Fold 접힘/펼침 대응 CSS 추가
   - 기존 JS 기능을 건드리지 않는 시각/레이아웃 override layer

## 변경하지 않은 핵심 영역

- Firebase 구조
- Approval Engine
- Access Gate
- Runtime
- Manifest
- SDK
- UID 구조
- 로그인 방식
- 기존 JS 모듈 로딩 순서

## 실제 검수 기준

1. 노트북
2. Android 일반폰
3. iPhone
4. Galaxy Fold 접힘 화면
5. Galaxy Fold 펼침 화면

## 적용 방법

기존 프로젝트 루트에 ZIP 내부 파일을 덮어쓰기 합니다.

- `index.html` 덮어쓰기
- `assets/css/hearu-step7-design-system.css` 추가

문제가 생기면 `index.html`에서 아래 한 줄만 제거하면 STEP7 디자인 override가 비활성화됩니다.

```html
<link rel="stylesheet" href="./assets/css/hearu-step7-design-system.css">
```

## 주의

이번 STEP7은 기능 추가가 아니라 Platform Identity와 Cross-device UI 기반 작업입니다. 동작 로직은 기존 기준 버전을 유지합니다.
