# STEP7-5 Fold/Mobile Navigation Fix

## 목적
Galaxy Fold / Mobile / Tablet 화면에서 상단 메뉴가 2열 전체 펼침으로 과도하게 공간을 차지하는 문제를 수정합니다.

## 수정 파일
- index.html
- style.css
- workspace.js

## 적용 방법
1. 현재 정상 작동 중인 HearU2nite 프로젝트에서 위 3개 파일을 교체합니다.
2. GitHub에 커밋/푸시합니다.
3. Netlify 배포 완료 후 Galaxy Fold 화면에서 확인합니다.

## 검수 항목
- Fold 화면에서 상단 메뉴가 로고 + 메뉴 버튼 형태로 축소되는지 확인
- 메뉴 버튼 클릭 시 메뉴 목록이 펼쳐지는지 확인
- 메뉴 선택 후 자동으로 메뉴가 닫히는지 확인
- Home / 내 앱 / 앱 둘러보기 / 앱 신청 / 활동 기록 / 공지사항 / 고객지원 이동 확인
- 관리자 계정에서 Admin Center 표시 및 이동 확인
- 일반 사용자 계정에서 Admin Center 숨김 유지 확인
- 앱 실행 기능 재확인

## 주의
Firebase Rules, 앱 실행 보안 로직, 승인 로직은 수정하지 않았습니다.
