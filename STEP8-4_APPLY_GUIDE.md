# STEP8-4 Mobile Layout Restore & Design Direction Prep

## 적용 기준
- STEP8-3 적용 후 모바일/Fold 화면에서 본문이 왼쪽 좁은 영역에 몰리고 오른쪽이 비는 문제를 복구하기 위한 전용 수정입니다.
- 디자인 리뉴얼 전, 모바일 레이아웃 안정화를 먼저 끝내기 위한 단계입니다.

## 포함 파일
- index.html
- assets/css/platform-shell.css

## 적용 방법
1. 기존 프로젝트에서 위 파일만 교체합니다.
2. GitHub Desktop으로 커밋합니다.
3. Netlify 배포 완료 후 PC / Android / Fold에서 확인합니다.

## 검수 항목
- 스마트폰에서 본문 카드가 화면 폭을 정상 사용해야 합니다.
- 오른쪽에 큰 빈 공간이 남지 않아야 합니다.
- 메뉴 버튼은 좌측 상단에 유지되어야 합니다.
- 메뉴 클릭 시 좌측 드로어가 열려야 합니다.
- 일반 사용자에게 Admin Center가 보이면 안 됩니다.
- 활동 기록 메뉴가 좌측 메뉴에서 보이면 안 됩니다.
- 관리자 App 관리 화면의 회색 박스가 밝은 카드형으로 보여야 합니다.
- PC 화면의 좌측 메뉴 + 중앙 콘텐츠 구조는 유지되어야 합니다.

## 디자인 방향 메모
모바일 복구 후 HearU2nite 전체 디자인은 별도 리뉴얼 STEP에서 확정합니다.
추천 후보는 다음 3가지입니다.
1. App Store / Google Play 계열 앱 허브형
2. Notion / Linear 계열 SaaS 콘솔형
3. X / Threads 계열 피드형 플랫폼

현재 HearU2nite 목적상 1번 앱 허브형 + 2번 SaaS 콘솔형 결합이 가장 적합합니다.
