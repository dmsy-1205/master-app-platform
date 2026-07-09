# STEP7-8 Twitter-like App Frame & Global Visual Frame Cleanup

## 목적
PC 화면에서 HearU2nite Platform이 지나치게 넓게 펼쳐지고 내부 콘텐츠가 비어 보이는 문제를 개선합니다.
X/Twitter처럼 왼쪽 고정 내비게이션과 가운데 작업 영역 중심의 프레임형 레이아웃으로 정리합니다.

## 수정 파일
- index.html
- assets/css/platform-shell.css

## 적용 방법
1. 기존 프로젝트 루트에 index.html을 덮어씁니다.
2. assets/css/platform-shell.css를 덮어씁니다.
3. GitHub에 커밋 후 Netlify 배포를 확인합니다.
4. 브라우저 캐시가 남아 있으면 강력 새로고침을 합니다.

## 검수 항목
- PC에서 좌측 메뉴가 Twitter/X처럼 고정된 세로 메뉴로 보이는지 확인합니다.
- PC에서 메인 콘텐츠가 너무 넓게 퍼지지 않고 중앙 프레임 안에 들어오는지 확인합니다.
- 관리자 화면의 회원 관리, 승인 관리, 데이터 관리, 운영 로그, 앱 관리에서 회색/어두운 박스와 흐린 글자가 개선되었는지 확인합니다.
- 테이블이 화면 밖으로 전체 레이아웃을 밀지 않고 내부 스크롤로 처리되는지 확인합니다.
- Mobile/Fold에서 메뉴가 가로 스크롤이 아니라 접힘/펼침 방식으로 작동하는지 확인합니다.
- 로그인, 승인, 앱 실행, 활동 기록, Admin Center 기능이 그대로 작동하는지 확인합니다.

## 변경하지 않은 것
Firebase Rules, 로그인/로그아웃 로직, 앱 승인 로직, Secure Launch, 활동 기록 데이터 저장, Admin Center SPA 비즈니스 로직은 수정하지 않았습니다.
