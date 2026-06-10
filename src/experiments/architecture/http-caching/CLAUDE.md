# Day 15: HTTP Caching

> 핵심 질문: "같은 URL에 요청했는데 왜 네트워크 탭에서 어떤 건 200이고 어떤 건 304인가?"

## 이론

**캐싱 흐름**:

```
브라우저 캐시 확인
  ├─ 캐시 없음 → 서버 요청 → 200 응답 + 캐시 저장
  ├─ 캐시 있음, 만료 안 됨 → 요청 없이 바로 사용 (200 from cache)
  └─ 캐시 있음, 만료됨 → 조건부 요청 → 변경 없음: 304 / 변경됨: 200 새 데이터
```

**핵심 헤더**:

| 헤더 | 역할 | 예시 |
|------|------|------|
| `Cache-Control: max-age=3600` | 3600초(1시간) 캐시 유효 | 정적 파일 |
| `Cache-Control: no-cache` | 캐시 저장하되 항상 서버에 재검증 | HTML |
| `Cache-Control: no-store` | 캐시 저장 자체 불가 | 민감한 데이터 |
| `ETag: "abc123"` | 리소스 버전 식별자 | 조건부 요청용 |
| `Last-Modified` | 마지막 수정 시각 | 조건부 요청용 |
| `Stale-While-Revalidate` | 만료됐어도 일단 캐시 반환 후 백그라운드 재검증 | 빠른 응답 필요 시 |

## 구현할 것

### Vite 개발 서버에서는 캐시 동작 확인이 어려우므로 간단한 Node.js 서버 사용
```bash
# lab/ 내 간단한 서버 스크립트
node cache-server.js
```

### cache-server.js 예시
```js
const http = require('http');
const server = http.createServer((req, res) => {
  const etag = '"v1.0"';
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304); // Not Modified
    return res.end();
  }
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=60',
    'ETag': etag,
  });
  res.end(JSON.stringify({ data: 'hello', time: Date.now() }));
});
server.listen(3001);
```

### 실험 단계
1. `max-age=60` → 60초 내 같은 요청 → Network 탭에서 "(from disk cache)" 확인
2. `no-cache` → 매번 304 또는 200 반환
3. `no-store` → 항상 새 요청

## 측정 방법

1. **Chrome DevTools → Network 탭**
   - "Disable cache" 체크 해제
   - 상태 코드: 200 / 304 / 200 (from disk cache) / 200 (from memory cache)
2. **응답 헤더 확인** — Age, Cache-Control, ETag 값

## 면접 포인트

**Q: "브라우저 캐싱 전략을 설명해주세요"**
A: Cache-Control 헤더로 캐시 유효 기간을 설정합니다. `max-age`는 그 시간 동안 재요청 없이 사용, `no-cache`는 캐시는 하되 항상 재검증, `no-store`는 캐시 자체를 하지 않습니다. ETag나 Last-Modified로 변경 여부를 확인해 304를 받으면 전송 없이 캐시를 재사용합니다.

**Q: "304와 200(from cache)의 차이는?"**
A: 304는 서버에 조건부 요청을 보내고 "변경 없음"을 확인한 것입니다. 200(from cache)는 서버에 요청조차 하지 않고 바로 캐시에서 반환한 것입니다.
