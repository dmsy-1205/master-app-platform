# HearU2nite STEP7-1.5 Cross-Device Size Tuning

## 목적
STEP7-1.4 실제 검수 결과를 기준으로 로그인 화면의 기기별 크기를 정밀 조정한다.

## 수정 범위
- index.html: login-identity.css 캐시 버전 step7-1-5로 갱신
- assets/css/login-identity.css: PC / Tablet / Fold Open / Fold Cover / Mobile 사이즈 튜닝
- firebase.json: 기존 캐시 방지 설정 유지
- _headers: Netlify 캐시 방지 설정 유지
- .github/workflows/firebase-hosting-merge.yml: Firebase main push 자동 배포 설정 유지

## 검수 포인트
1. PC
   - 카드가 STEP7-1.4보다 약 10~15% 커졌는지
   - 세로 스크롤이 생기지 않는지
   - 푸터가 중앙 하단에 보이는지

2. 휴대폰 / Fold Cover
   - 카드가 화면을 과도하게 꽉 채우지 않는지
   - 제목/입력창/버튼이 이전보다 작아졌는지
   - 하단 푸터가 정상적으로 보이는지

3. Fold Open / Tablet
   - 휴대폰처럼 과하게 확대되지 않는지
   - 카드가 중앙에 안정적으로 배치되는지

## GitHub Summary
fix: tune STEP7-1 login sizing across devices

## GitHub Description
Refine STEP7-1 login sizing after cross-device QA. Restores desktop card readability while reducing mobile and Fold Cover scale. Preserves Firebase Auth, Router, Access Gate, approval structure, cache headers, and Firebase hosting workflow.
