# STEP8-2 Mobile Responsive Layout & Role Navigation Fix

## 적용 파일
- index.html
- auth.js
- workspace.js
- assets/css/platform-shell.css

## 적용 방법
현재 GitHub 프로젝트에 같은 경로로 덮어쓴 뒤 배포합니다.
Firebase Rules, 승인 로직, 앱 실행 보안 로직은 변경하지 않았습니다.

## 필수 검수
1. PC 관리자 계정: 좌측 메뉴 + 가운데 프레임 정상 표시
2. PC 일반 사용자: Admin Center 메뉴 숨김
3. 모바일 일반 사용자: 메뉴 버튼은 보이고 본문이 화면 전체 폭 사용
4. 모바일/Fold: 오른쪽 빈 공간 없이 카드가 화면 안에 표시
5. UID 미노출
6. 즐겨찾기, 활동 기록, 공지, 고객지원, 관리자 화면 글자 가독성 확인
7. 승인된 HearMe2nite 앱 실행 정상 확인
