# HearU2nite STEP7-1.4 Cross-Device Login CSS Rebuild

## 목적
STEP7-1.3에서 남아 있던 PC 스크롤/푸터 잘림, 모바일 카드 과대 확대, Fold/Tablet 대응 불안정 문제를 해결하기 위해 로그인 전용 CSS를 누적 override 방식이 아니라 재작성 방식으로 정리했다.

## 포함 파일
- index.html
- assets/css/login-identity.css
- firebase.json
- _headers
- .github/workflows/firebase-hosting-merge.yml
- STEP7-1.4_APPLY_GUIDE.md

## 적용 방법
1. ZIP을 프로젝트 루트에 덮어쓴다.
2. GitHub Desktop에서 변경 파일을 확인한다.
3. Commit 후 Push한다.
4. Netlify 자동 배포를 확인한다.
5. Firebase 자동 배포는 GitHub Actions에서 확인한다. 실패하면 1회 수동으로 `firebase deploy --only hosting`을 실행한다.

## GitHub Summary
fix: rebuild login CSS for cross-device QA

## GitHub Description
Rebuild the HearU2nite public login identity stylesheet instead of stacking overrides. Fix desktop viewport composition, centered footer, mobile sizing, Fold Cover, Fold Open, tablet, and landscape behavior while preserving Firebase/Auth/Router logic.

## QA 체크
- PC: 오른쪽 기존 배경 노출 없음, 푸터 중앙, 불필요한 세로 스크롤 최소화
- Android/iPhone: 카드가 화면을 과도하게 차지하지 않음, 글자/입력창/버튼 크기 적정
- Galaxy Fold 접힘: 좁은 폭에서 좌우 잘림 없음
- Galaxy Fold 펼침: 태블릿형 폭에서 카드 과대 확대 없음
- Tablet: 중앙 카드와 브랜드 균형 유지
- Landscape: 입력/버튼 접근 가능

## 수정 금지 확인
다음 파일은 수정하지 않았다.
- auth.js
- firebase.js
- routing.js
- dashboard.js
- admin.js
- operation.js
- database.js
- security.js
