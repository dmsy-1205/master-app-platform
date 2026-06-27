# Master App Platform STEP 4

## 목표
회원 신청 시스템 구현

## 기준 프로젝트
- master-app-platform-step03-v1

## 절대 원칙
- 기존 our-baby-care 프로젝트 수정 금지
- 기존 Firebase 수정 금지
- master-app-platform Firebase만 사용

## STEP 4에서 추가된 기능

### 1. 회원가입 기본 상태 변경
회원가입 시 users/{uid}에 저장되는 status가 기존 active에서 new로 변경되었습니다.

```text
users
  uid
    email
    role: user
    status: new
    createdAt
```

### 2. 로그인 후 상태 확인
로그인하면 users/{uid}의 role과 status를 확인합니다.

```text
role admin
  index.html 유지

status new
  pages/apply.html 이동

status pending
  pages/pending.html 이동

status approved
  pages/dashboard.html 이동

status rejected
  pages/apply.html 이동
```

### 3. 회원 신청 페이지 추가
새 파일

```text
pages/apply.html
pages/application.js
```

신청 시 아래 경로에 저장됩니다.

```text
applications
  uid
    uid
    email
    name
    phone
    company
    memo
    status: pending
    createdAt
```

동시에 users/{uid}/status가 pending으로 변경됩니다.

### 4. 승인 대기 화면 추가
새 파일

```text
pages/pending.html
```

### 5. 사용자 대시보드 기본 화면 추가
새 파일

```text
pages/dashboard.html
```

현재는 승인된 사용자만 접근하는 기본 화면입니다.
STEP6 이후 앱 목록이 연결됩니다.

## 업로드 방법
1. 이 ZIP 파일 압축 해제
2. GitHub 저장소에 전체 파일 덮어쓰기 업로드
3. Commit changes 클릭
4. Netlify 자동 배포 확인
5. 배포 완료 후 사이트 접속

## 테스트 방법

### 테스트 1 신규 회원가입
1. 사이트 접속
2. 새 이메일로 회원가입
3. 로그인 상태에서 자동으로 회원 신청 페이지로 이동하는지 확인

### 테스트 2 회원 신청
1. 이름 입력
2. 연락처 입력
3. 소속 입력 선택
4. 메모 입력 선택
5. 신청하기 클릭
6. 승인 대기 페이지로 이동하는지 확인

### 테스트 3 Firebase 확인
Realtime Database에서 아래 경로를 확인합니다.

```text
applications/{uid}
users/{uid}/status = pending
```

### 테스트 4 기존 관리자 계정
1. STEP3에서 관리자 등록한 계정으로 로그인
2. 관리자 계정은 신청 페이지로 이동하지 않고 index.html에 남는지 확인

## 주의
이번 STEP4는 신청 시스템까지만 구현합니다.
관리자가 신청 목록을 보고 승인하는 기능은 STEP5에서 구현합니다.

## 다음 단계
STEP5 승인 시스템
- 관리자 신청 목록 보기
- 승인 버튼
- 거절 버튼
- users/{uid}/status approved 또는 rejected 변경
- applications/{uid}/status approved 또는 rejected 변경
