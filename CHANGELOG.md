# CHANGELOG

## master-app-platform-step09-v4
- App Store 카드 액션 영역을 재정렬했습니다.
- 즐겨찾기 버튼을 큰 텍스트 버튼에서 작은 아이콘 버튼으로 변경했습니다.
- 실행 버튼을 카드 하단 우측 중심 CTA로 정리했습니다.
- 관리자 앱 관리 화면에 앱 삭제 기능을 추가했습니다.
- 삭제 전 확인창을 추가하여 실수 삭제를 줄였습니다.
- 기존 앱 등록 활성 비활성 실행 로그 기능은 유지했습니다.

## master-app-platform-step09-v3
- 전역 검색 기능 추가
- App Store 검색 기능 활성화
- 앱 즐겨찾기 기능 추가
- Notification Center 추가
- 사용자 프로필 메뉴 추가
- 최근 실행 기록 Dashboard 위젯 추가
- 활동 로그 전용 화면 추가
- 기존 STEP9-v2 관리자 SPA와 앱 실행 로직 유지

## master-app-platform-step09-v2
- 사용자 Dashboard UX 리뉴얼
- App Store 2.0 카드 구조 적용
- 사용자 KPI 카드 추가
- 빠른 실행 위젯 추가
- 추천 앱 실행 영역 추가

## master-app-platform-step09-v1
- 관리자 SPA 메뉴 분리
- Admin Center Overview / 승인 관리 / 앱 관리 / 개발 도구 탭 구성


## STEP9-v5
- 즐겨찾기를 localStorage 준비 기능에서 Firebase 사용자별 저장 기능으로 확장했습니다.
- userFavorites/{uid}/{appId} 와 users/{uid}/favoriteApps/{appId} 경로에 즐겨찾기를 동기화합니다.
- 관리자 앱 등록 폼에 초보자용 가이드 예시 채우기 미리보기 입력 검증을 추가했습니다.
