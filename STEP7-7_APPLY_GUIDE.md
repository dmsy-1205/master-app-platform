# STEP7-7 Global Visual Contrast Cleanup 적용 가이드

## 적용 목적
STEP7-6 적용 후에도 관리자 화면과 일부 사용자 화면에 남아 있던 구형 회색/다크 패널, 밝은 배경 위의 흰색 글자, 흐린 입력창, 가독성이 떨어지는 카드 영역을 전체적으로 정리합니다.

## 포함 파일
- index.html
- assets/css/platform-shell.css

## 적용 방법
1. 기존 프로젝트 기준으로 동일 경로에 파일을 덮어씁니다.
2. GitHub에 커밋/푸시합니다.
3. Netlify 배포 완료 후 브라우저 캐시를 새로고침합니다.

## 반드시 확인할 화면
- Desktop 관리자 Dashboard
- Desktop 회원 관리
- Desktop 승인 관리
- Desktop 데이터 관리
- Desktop 운영 로그
- Desktop 앱 관리
- Mobile Home
- Mobile 메뉴 열기/닫기
- Galaxy Fold 메뉴 열기/닫기
- 활동 기록 글자 가독성
- 앱 둘러보기 검색창/카드 가독성

## 변경하지 않은 영역
Firebase Rules, 로그인, 앱 승인, 앱 실행, Secure Launch, 활동 기록 데이터 로직, Admin Center SPA 라우팅 로직은 변경하지 않았습니다.
