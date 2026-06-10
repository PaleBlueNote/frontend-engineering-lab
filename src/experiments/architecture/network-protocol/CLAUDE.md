# Day 20: Network Protocols

> 핵심 질문: "HTTP/2가 HTTP/1.1보다 빠른 이유는 무엇인가?"

## 이론

| 특성 | HTTP/1.1 | HTTP/2 |
|------|----------|--------|
| 연결 방식 | 요청마다 순차 처리 (Keep-Alive 있어도 HOL Blocking) | 하나의 TCP 연결로 병렬 처리 (Multiplexing) |
| 헤더 | 매 요청마다 텍스트 전송 | HPACK 압축, 중복 헤더 제거 |
| 서버 푸시 | 없음 | 서버가 클라이언트 요청 전에 리소스 미리 전송 가능 |
| 보안 | HTTP 또는 HTTPS | 사실상 TLS 필수 |

**Head-of-Line (HOL) Blocking**: HTTP/1.1에서 앞선 요청이 느리면 뒤 요청이 기다림.
**Multiplexing**: HTTP/2에서 여러 스트림을 하나의 TCP 연결에서 동시에 처리.

## 구현할 것

### 시각화: 리소스 로드 워터폴 비교

**시뮬레이션** (실제 HTTP/2 서버 없이 브라우저 동작 시뮬레이션):

```jsx
// HTTP/1.1 시뮬레이션: 6개 병렬 연결 제한, 나머지는 큐잉
const http11Simulation = async () => {
  const resources = Array.from({ length: 20 }, (_, i) => `resource_${i}`);
  const PARALLEL_LIMIT = 6; // HTTP/1.1 브라우저 한계

  const results = [];
  for (let i = 0; i < resources.length; i += PARALLEL_LIMIT) {
    const batch = resources.slice(i, i + PARALLEL_LIMIT);
    await Promise.all(batch.map(r => simulateFetch(r, 100))); // 각 100ms
    results.push(...batch);
  }
  return results;
};

// HTTP/2 시뮬레이션: 모두 병렬
const http2Simulation = async () => {
  const resources = Array.from({ length: 20 }, (_, i) => `resource_${i}`);
  return Promise.all(resources.map(r => simulateFetch(r, 100)));
};
```

### 워터폴 차트 시각화
- X축: 시간(ms), Y축: 리소스 번호
- HTTP/1.1: 6개씩 묶여 순차적으로 완료되는 모습
- HTTP/2: 모두 동시에 시작, 동시에 완료

### 실제 확인 방법
1. Chrome DevTools → Network 탭 → Protocol 컬럼 표시
2. `h2` = HTTP/2, `http/1.1` = HTTP/1.1
3. Vercel 배포된 앱은 HTTP/2 사용 확인 가능

## 측정 방법

1. 시뮬레이션 총 로드 시간 비교 (20개 리소스)
2. Network 탭에서 실제 배포 앱의 프로토콜 확인

## 면접 포인트

**Q: "HTTP/1.1과 HTTP/2의 차이를 설명해주세요"**
A: HTTP/2는 Multiplexing을 지원해 하나의 TCP 연결로 여러 요청을 병렬 처리합니다. HTTP/1.1은 연결당 한 번에 하나의 요청만 처리하거나 브라우저당 6개 병렬 연결로 제한됩니다. 또한 HTTP/2는 헤더 압축(HPACK)으로 전송량을 줄입니다.

**Q: "HTTP/1.1에서 성능 최적화 방법은?"**
A: 도메인 샤딩(여러 서브도메인으로 병렬 연결 우회), 리소스 번들링(파일 수 감소), CSS 스프라이트 등이 있습니다. HTTP/2에서는 이런 우회책이 불필요합니다.
