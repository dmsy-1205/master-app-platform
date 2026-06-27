# Master App Platform STEP 3

## 목표
관리자 권한 시스템 테스트

## 이전 완료
- STEP 1 Firebase Authentication 완료
- STEP 2 Realtime Database 읽기/쓰기/삭제 완료

## 이번 STEP 3 테스트 순서
1. GitHub에 파일 덮어쓰기 업로드
2. Netlify 자동 배포 확인
3. 사이트 접속
4. 로그인
5. 현재 계정을 관리자 등록 클릭
6. 관리자 권한 확인 클릭
7. 새로고침 후 로그인 상태에 권한 admin 표시 확인

## Firebase Database에 생성되는 경로
- users/{uid}
- admins/{uid}

## 주의
이번 단계의 관리자 등록 버튼은 테스트용입니다.
최종 서비스에서는 아무나 관리자가 될 수 없도록 Firebase Rules와 관리자 화면에서 제한합니다.
STEP 9 보안 단계에서 반드시 잠급니다.
