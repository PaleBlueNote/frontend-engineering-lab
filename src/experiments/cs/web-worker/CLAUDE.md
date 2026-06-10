# Day 11: Web Workers

> 핵심 질문: "무거운 계산이 UI를 멈추게 하는 이유는? 어떻게 해결하는가?"

## 이론

**JavaScript는 싱글 스레드**: 메인 스레드 하나에서 JS 실행 + 렌더링 + 이벤트 처리를 모두 담당.
무거운 계산이 메인 스레드를 점유하면 → UI 프리즈 (스크롤/클릭 불가).

**Web Worker**: 별도 스레드에서 JS 실행. 메인 스레드와 `postMessage`로 통신. DOM 접근 불가.

```
메인 스레드: UI 렌더링 + 이벤트 → postMessage → Worker
Worker 스레드: 무거운 계산  ────→ postMessage → 메인 스레드
```

## 구현할 것

### 1단계: 블로킹 예시
```jsx
const heavyCalc = () => {
  // 메인 스레드 점유 → UI 프리즈
  let result = 0;
  for (let i = 0; i < 1_000_000_000; i++) result += i;
  return result;
};
// 버튼 클릭 → 버튼이 눌린 상태로 멈춤, 스크롤 불가
```

### 2단계: Web Worker로 분리
```js
// worker.js
self.onmessage = (e) => {
  const { n } = e.data;
  let result = 0;
  for (let i = 0; i < n; i++) result += i;
  self.postMessage({ result });
};
```
```jsx
// 컴포넌트
const workerRef = useRef(null);
useEffect(() => {
  workerRef.current = new Worker(new URL('./worker.js', import.meta.url));
  workerRef.current.onmessage = (e) => setResult(e.data.result);
  return () => workerRef.current.terminate();
}, []);

const startCalc = () => {
  workerRef.current.postMessage({ n: 1_000_000_000 });
};
// 버튼 클릭 후에도 UI 정상 동작
```

### 3단계: 비교 시각화
- 메인 스레드 실행: 로딩 스피너가 멈추는 시간 측정
- Worker 실행: 스피너가 계속 돌고 계산 완료 시 결과 표시
- FPS 패널로 메인 스레드 블로킹 시각화

### 4단계: Comlink로 Worker 사용 간소화 (심화)
```bash
npm i comlink
```
```js
// worker.js
import { expose } from 'comlink';
expose({ heavyCalc: (n) => { /* ... */ } });
```
```js
// main
import { wrap } from 'comlink';
const worker = wrap(new Worker('./worker.js'));
const result = await worker.heavyCalc(1e9); // 마치 비동기 함수처럼
```

## 측정 방법

1. **stats.js FPS** — 계산 중 FPS 비교 (메인 스레드: 0fps vs Worker: 60fps)
2. **Performance 탭** — Long Task 블록 표시 여부
3. **계산 시간** — `performance.now()` 차이 (Worker 메시지 왕복 오버헤드 포함)

## 면접 포인트

**Q: "Web Worker는 언제 사용하나요?"**
A: CPU 집약적 작업(암호화, 대용량 데이터 파싱, 이미지 처리)을 메인 스레드에서 분리할 때 사용합니다. DOM에 접근할 수 없으므로 순수 계산 로직만 Worker로 이동합니다.

**Q: "Web Worker와 Service Worker의 차이는?"**
A: Web Worker는 무거운 계산을 메인 스레드에서 분리하는 용도입니다. Service Worker는 네트워크 요청을 가로채고 캐싱하는 프록시 역할로, 오프라인 지원 등 PWA에 사용됩니다.
