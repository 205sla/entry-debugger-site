# Entry Debugger 소개 사이트

Entry Debugger(엔트리 디버깅 툴)의 기능과 사용 범위, 개인정보 처리방침을 안내하는 정적 웹사이트입니다.

## 사이트

- **공개 주소:** [https://entry-debugger.205.kr](https://entry-debugger.205.kr)
- **Chrome 웹스토어:** [엔트리 디버깅 툴 설치](https://chromewebstore.google.com/detail/%EC%97%94%ED%8A%B8%EB%A6%AC-%EB%94%94%EB%B2%84%EA%B9%85-%ED%88%B4/meginahneajajhniecgebilpldnabkob)
- **개인정보 처리방침:** [https://entry-debugger.205.kr/privacy.html](https://entry-debugger.205.kr/privacy.html)

## 주요 파일

- `index.html`: 소개 페이지
- `privacy.html`: 개인정보 처리방침
- `page.css`, `tokens.css`: 사이트 스타일
- `site.js`, `debug-demo.js`: 화면 동작과 데모
- `CNAME`: `entry-debugger.205.kr` 사용자 도메인 설정

## 로컬 확인

저장소 루트에서 정적 서버를 실행합니다.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173`으로 접속합니다.

## 관련 프로젝트

확장 프로그램 본체는 상위 `Entry Debugger` 저장소의 `entry-debugger-extension/`에서 관리합니다.
