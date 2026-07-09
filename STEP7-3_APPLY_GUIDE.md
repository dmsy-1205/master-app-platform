# HearU2nite STEP7-3 Platform Home UX Remodeling

## 목적
로그인 후 Home 화면을 통계 중심 콘솔에서 사용자 중심 Launch Home으로 개편합니다.

## 수정 범위
- `index.html`
- `assets/css/platform-shell.css`
- `STEP7-3_APPLY_GUIDE.md`

## 핵심 변경
- 좌측 메뉴 순서를 사용자 행동 흐름에 맞게 조정
- Home 상단에 대표 앱 실행 카드 추가
- 기존 통계 카드는 보조 상태 영역으로 축소
- 계정/UID/신청 정보는 접이식 상세 정보로 이동
- 즐겨찾기/공지 영역은 Home 하단 보조 카드로 유지
- 앱 둘러보기 Featured 문구를 대표 앱 중심으로 정리

## 보존한 기능
- Firebase Auth 변경 없음
- Router JS 변경 없음
- 승인 구조 변경 없음
- 앱 실행 버튼 ID 유지
- 즐겨찾기/공지 데이터 연결 ID 유지
- Admin Center 구조 변경 없음

## 적용 방법
1. ZIP 압축을 풉니다.
2. 프로젝트 루트에 그대로 덮어씁니다.
3. GitHub Desktop에서 변경 파일을 확인합니다.
4. Commit 후 Push합니다.
5. Firebase 자동 배포가 실패하면 수동으로 `firebase deploy --only hosting`을 실행합니다.

## GitHub Summary
`feat: remodel STEP7-3 platform home UX`

## GitHub Description
`Rework the authenticated Home screen into a user-first launch experience with flagship app access, simplified status cards, and improved platform flow while preserving Router, Firebase, approval, and app launch logic.`

## QA
- 로그인 후 Home 진입 확인
- 대표 앱 실행 버튼 동작 확인
- 새로고침 버튼 동작 확인
- 앱 둘러보기 링크 이동 확인
- 좌측 메뉴 전체 이동 확인
- Netlify/Firebase 화면 일치 확인
- PC/모바일/Fold/태블릿 레이아웃 확인
