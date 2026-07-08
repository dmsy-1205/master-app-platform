# HearU2nite STEP7-1.3 Login Layout Polish Fix

## 목적
STEP7-1.2 적용 후 PC 화면에서 발견된 UI 문제를 수정합니다.

## 수정 내용
- PC 화면에서 불필요한 세로 스크롤 제거
- 푸터가 좌측 하단에 잘려 보이는 문제 수정
- 로그인 카드 위치를 시각적으로 더 자연스럽게 상향 조정
- 카드 높이와 여백을 viewport 높이에 맞게 압축
- 태블릿 / Galaxy Fold 펼침 화면에서 카드 위치 균형 조정
- 모바일 / Galaxy Fold 접힘 화면은 스크롤 허용으로 키보드 대응 유지
- 가로모드에서는 로그인 카드가 한 화면에 들어오도록 compact layout 적용
- CSS 캐시 버전 step7-1-3 적용

## 포함 파일
- index.html
- assets/css/login-identity.css
- firebase.json
- _headers
- .github/workflows/firebase-hosting-merge.yml
- STEP7-1.3_APPLY_GUIDE.md

## 적용 방법
1. ZIP 압축을 프로젝트 루트에 덮어쓰기 합니다.
2. GitHub Desktop에서 변경 파일을 확인합니다.
3. Commit 후 Push 합니다.
4. Netlify 자동 배포를 확인합니다.
5. Firebase 자동 배포는 GitHub Actions에서 확인합니다. 실패하면 임시로 `firebase deploy --only hosting`을 실행합니다.

## GitHub Summary
fix: polish STEP7-1 login layout across viewport sizes

## GitHub Description
Refine the HearU2nite login identity layout after STEP7-1.2 by removing unnecessary desktop scroll, correcting footer placement, improving card positioning, and preserving mobile/Fold/tablet adaptive behavior. Auth, Firebase, router, approval, and platform engine logic remain untouched.

## QA 기준
- PC: 세로 스크롤 없이 한 화면 안에 로그인 카드와 푸터가 정상 표시
- Mobile: 화면 폭 깨짐 없음, 키보드 대응을 위해 세로 스크롤 허용
- Galaxy Fold Cover: 카드가 화면 폭을 넘지 않음
- Galaxy Fold Open: 카드가 중앙 균형을 유지함
- Tablet: 과도한 하단 여백/상단 밀림 없음
- Landscape: 카드가 지나치게 아래로 밀리지 않음
