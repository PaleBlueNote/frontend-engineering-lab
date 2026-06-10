# CORS Preflight 시각화

> 핵심 질문: "OPTIONS 요청이 언제 발생하고, 서버에서 어떻게 처리해야 하는가?"

## 이론

**Simple Request (Preflight 불필요)**:
- 메서드: GET, POST, HEAD
- Content-Type: text/plain, multipart/form-data, application/x-www-form-urlencoded
- 커스텀 헤더 없음

**Preflight가 필요한 경우 (이 외 모두)**:
- PUT, DELETE, PATCH
- Content-Type: application/json
- 커스텀 헤더 (Authorization 등)

**CORS 헤더 설명**:

| 헤더 | 역할 |
|------|------|
| `Access-Control-Allow-Origin` | 허용할 출처 (*, 또는 특정 도메인) |
| `Access-Control-Allow-Methods` | 허용할 메서드 |
| `Access-Control-Allow-Headers` | 허용할 헤더 |
| `Access-Control-Max-Age` | Preflight 결과 캐시 시간(초) |
| `Access-Control-Allow-Credentials` | 쿠키 포함 여부 |

## 구현할 것

### 1단계: 간단한 CORS 테스트 서버

```js
// cors-server.js (Node.js)
const http = require('http');

const handlers = {
  '/no-cors': (req, res) => {
    // CORS 헤더 없음 → 브라우저가 차단
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: '이 응답은 브라우저에서 볼 수 없음' }));
  },
  '/with-cors': (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:5173',
    });
    res.end(JSON.stringify({ message: '성공!' }));
  },
  '/credentials': (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      });
      return res.end();
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
    });
    res.end(JSON.stringify({ message: 'JSON + Authorization 허용됨' }));
  },
};

http.createServer((req, res) => {
  const handler = handlers[req.url];
  if (handler) handler(req, res);
  else res.writeHead(404).end();
}).listen(3001);
```

### 2단계: 실험 시나리오

```jsx
const experiments = [
  {
    label: '1. Simple GET (Preflight 없음)',
    request: () => fetch('http://localhost:3001/with-cors'),
    expected: '바로 200 응답',
  },
  {
    label: '2. JSON POST (Preflight 발생)',
    request: () => fetch('http://localhost:3001/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' },
      body: JSON.stringify({ data: 'test' }),
    }),
    expected: 'OPTIONS 후 POST',
  },
  {
    label: '3. CORS 헤더 없음 (차단)',
    request: () => fetch('http://localhost:3001/no-cors'),
    expected: '브라우저 차단',
  },
];
```

### 3단계: Network 탭 관찰 포인트
- 시나리오 2: OPTIONS 요청 먼저 → 204 → POST 요청 → 200
- 요청 헤더: `Origin: http://localhost:5173`
- 응답 헤더: `Access-Control-Allow-*` 값 확인
- 시나리오 3: 응답은 오지만 브라우저가 접근 차단 → console에 CORS 에러

## 면접 포인트

**Q: "CORS Preflight는 언제 발생하나요?"**
A: Simple Request 조건(GET/POST/HEAD + 기본 Content-Type + 커스텀 헤더 없음)을 벗어날 때 발생합니다. JSON API 호출이나 Authorization 헤더를 사용하면 Preflight가 발생합니다.

**Q: "CORS 에러를 어떻게 해결하나요?"**
A: 서버에서 적절한 CORS 헤더를 추가합니다. 프론트엔드에서는 Vite의 proxy 설정으로 개발 환경에서 우회하거나, 쿠키가 필요하면 `credentials: 'include'` + `Access-Control-Allow-Credentials: true`를 사용합니다.
