# Day 17-18: Security (CORS & XSS)

> 핵심 질문: "왜 브라우저는 다른 출처의 요청을 막는가?"

## 이론

### CORS (Cross-Origin Resource Sharing)

**Same-Origin Policy**: 프로토콜 + 호스트 + 포트가 모두 같아야 같은 출처.
```
https://example.com:443 (기준)
https://api.example.com:443  ← 호스트 다름 → Cross-Origin
http://example.com:443       ← 프로토콜 다름 → Cross-Origin
https://example.com:3000     ← 포트 다름 → Cross-Origin
```

**Preflight 요청**: Simple Request가 아닌 경우 OPTIONS 요청을 먼저 보내 서버 허용 여부 확인.
Simple Request 조건: GET/POST/HEAD + 기본 헤더 + Content-Type이 text/plain or multipart/form-data or application/x-www-form-urlencoded

### XSS (Cross-Site Scripting)

| 유형 | 설명 | 예시 |
|------|------|------|
| Reflected | URL 파라미터의 악성 코드가 즉시 응답에 포함 | `?q=<script>alert(1)</script>` |
| Stored | DB에 저장된 악성 코드가 다른 사용자에게 표시 | 게시판 댓글 |
| DOM-based | JS가 DOM을 직접 조작하며 발생 | `innerHTML = location.hash` |

## 구현할 것

### Day 17: CORS 시각화

**구성**: 간단한 Express 서버 (port 3001) + React 앱 (port 5173)

```js
// cors-server.js
const express = require('express');
const app = express();

// 실험 1: CORS 헤더 없음 → 브라우저 차단
app.get('/no-cors', (req, res) => res.json({ data: 'hello' }));

// 실험 2: CORS 허용
app.get('/with-cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.json({ data: 'hello' });
});

// 실험 3: Preflight 필요한 요청
app.options('/preflight', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});
app.post('/preflight', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ data: 'hello' });
});
```

**시각화**: 각 요청 시 Network 탭 스크린샷 + 에러 메시지 표시

### Day 18: XSS 방어 비교

```jsx
// 위험한 코드 (절대 사용 금지)
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// 안전한 코드: React 기본 이스케이프
<div>{userInput}</div>

// DOMPurify로 HTML을 허용해야 할 때
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

**실험**: `<img src=x onerror=alert(1)>` 입력 → 세 방식별 결과 비교

## 측정 방법

1. **Network 탭** — CORS 에러 메시지, OPTIONS 요청 여부
2. **Console 탭** — CORS 정책 위반 에러 내용
3. **XSS**: 실제 스크립트 실행 여부 확인

## 면접 포인트

**Q: "CORS가 무엇인지 설명해주세요"**
A: 브라우저의 Same-Origin Policy로 인해 다른 출처의 리소스는 기본적으로 차단됩니다. CORS는 서버가 특정 출처를 허용한다고 헤더로 알려주는 메커니즘입니다. 클라이언트가 아닌 서버에서 설정합니다.

**Q: "XSS를 어떻게 방어하나요?"**
A: 사용자 입력을 그대로 HTML로 렌더링하지 않습니다. React는 기본적으로 텍스트를 이스케이프합니다. HTML 렌더링이 필요하면 DOMPurify로 sanitize 후 사용합니다. CSP(Content Security Policy) 헤더로 인라인 스크립트 실행을 차단하는 것도 중요합니다.
