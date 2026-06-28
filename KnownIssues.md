# KnownIssues

- Firebase Authentication 사용자 계정 자체 삭제는 관리자 SDK 또는 서버 기능이 필요함
- 현재 퇴출은 users/applications 상태값 기반의 플랫폼 접근 차단 방식
- 회원별 앱 접근 권한은 다음 단계에서 추가 예정
- Firebase Rules 강화 전까지 운영 배포 전 보안 점검 필요


## 보안 참고
외부 Netlify 생활관리 앱은 URL 직접 접근을 완전히 막을 수 없습니다. STEP10 Firebase Rules 적용이 필요합니다.


## STEP9-v8 기준 남은 이슈
- 생활관리 앱 원본은 아직 외부 Netlify 주소 직접 접근이 가능하다.
- 완전 보호는 STEP10 Firebase Rules App Token Gateway Platform Loader에서 처리해야 한다.
- 앱 수가 크게 늘어날 경우 STEP11에서 App Store 페이징 검색 카테고리 고도화가 필요하다.
