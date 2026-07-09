# STEP8-10 Mobile Drawer Route Action Fix

## 적용 기준
- 기준 ZIP: master-app-platform(2).zip 이후 STEP8-9 적용 상태
- 목적: 모바일 폭은 유지하면서 Drawer 메뉴 항목 클릭 이동을 복구한다.

## 적용 파일
아래 파일만 기존 프로젝트에 덮어쓴다.

- index.html
- workspace.js
- assets/css/platform-shell.css

## 배포 후 검수
1. 모바일에서 메뉴 버튼을 눌러 Drawer가 열리는지 확인
2. Home / 내 앱 / 앱 둘러보기 / 앱 신청 / 공지사항 / 고객지원 클릭 시 해당 화면으로 이동하는지 확인
3. 메뉴 선택 후 Drawer가 자동으로 닫히는지 확인
4. 모바일 화면 폭이 줄어들지 않는지 확인
5. 일반 사용자에게 Admin Center가 보이지 않는지 확인
6. PC 좌측 메뉴와 관리자 화면이 유지되는지 확인

## 보존 항목
Firebase, 로그인, 승인, 앱 실행 보안, 사용자 데이터 구조는 수정하지 않았다.
