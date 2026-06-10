# HTTP/1.1 vs HTTP/2

> 핵심 질문: "HTTP/2가 HTTP/1.1보다 빠른 이유를 수치로 보여줄 수 있는가?"

## 이론 (Section 3 Day 20과 연계)

Day 20이 개념 이해 중심이라면, 여기서는 **실제 측정과 심화**에 집중한다.

## HTTP/1.1의 문제점

**HOL (Head-of-Line) Blocking**:
```
GET /style.css  ───→ 응답 기다리는 중...
GET /app.js     ─────────────────────→ (style.css 끝난 후에야 시작)
GET /logo.png   ──────────────────────────────────────→
```

**브라우저 워크어라운드**: 도메인당 최대 6개 TCP 연결 병렬 사용.
→ HTTP/2에서는 불필요 (오히려 연결 오버헤드만 추가).

## 구현할 것

### 1단계: 로드 시간 시뮬레이터

```jsx
// HTTP/1.1 시뮬레이션: 6개 병렬 연결 제한
async function simulateHTTP1(resources, latency = 100) {
  const PARALLEL_LIMIT = 6;
  const startTime = performance.now();
  const loaded = [];

  for (let i = 0; i < resources.length; i += PARALLEL_LIMIT) {
    const batch = resources.slice(i, i + PARALLEL_LIMIT);
    await Promise.all(batch.map(() =>
      new Promise(resolve => setTimeout(resolve, latency))
    ));
    loaded.push(...batch);
    // UI 업데이트
  }

  return performance.now() - startTime;
}

// HTTP/2 시뮬레이션: 모든 리소스 병렬 처리
async function simulateHTTP2(resources, latency = 100) {
  const startTime = performance.now();
  await Promise.all(resources.map(() =>
    new Promise(resolve => setTimeout(resolve, latency))
  ));
  return performance.now() - startTime;
}
```

### 2단계: 리소스 수별 성능 비교

```
리소스 6개:   HTTP/1.1 ≈ 100ms | HTTP/2 ≈ 100ms (차이 없음)
리소스 12개:  HTTP/1.1 ≈ 200ms | HTTP/2 ≈ 100ms (2배)
리소스 30개:  HTTP/1.1 ≈ 500ms | HTTP/2 ≈ 100ms (5배)
```

### 3단계: 헤더 압축 효과 시각화

```js
// HTTP/1.1: 모든 요청마다 전체 헤더 전송
const http1Headers = {
  'User-Agent': 'Mozilla/5.0 ...(100bytes)',
  'Accept': 'text/html,...(50bytes)',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cookie': 'session=abc123...(200bytes)',
  // 총 약 400bytes × 30 요청 = 12,000bytes 헤더
};

// HTTP/2 HPACK: 이전에 보낸 헤더는 인덱스로 대체
// 반복되는 헤더 = 수 바이트로 표현
```

### 4단계: 실제 앱에서 확인

```bash
# Vercel 배포된 앱에서 확인
# Chrome DevTools → Network 탭 → Protocol 컬럼 우클릭 → Protocol 체크
# h2 = HTTP/2, http/1.1 = HTTP/1.1
```

### 5단계: HTTP/3 (QUIC) 미래 맥락

```
HTTP/1.1 → TCP HOL Blocking 문제
HTTP/2   → HTTP 레벨은 해결, TCP 레벨 HOL은 여전히 존재
HTTP/3   → UDP + QUIC 프로토콜 → TCP 레벨 HOL도 해결
```

## 측정 방법

1. 시뮬레이터로 리소스 수별 로드 시간 비교 차트
2. 실제 앱 Network 탭에서 프로토콜 확인

## 면접 포인트

**Q: "HTTP/2의 핵심 개선점은?"**
A: 1) Multiplexing으로 하나의 TCP 연결에서 여러 요청 병렬 처리 — HOL Blocking 해결. 2) HPACK으로 헤더 압축 — 반복 헤더를 인덱스로 전송. 3) 서버 푸시로 클라이언트 요청 전에 리소스 미리 전송 가능.
