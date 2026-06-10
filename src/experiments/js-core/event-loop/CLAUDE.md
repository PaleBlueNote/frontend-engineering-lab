# 이벤트 루프 시각화

> 핵심 질문: "Promise.then과 setTimeout 중 어느 것이 먼저 실행되는가? 왜?"

## 이론

**JavaScript 실행 모델**:

```
콜 스택(Call Stack)
  ↓ 비어있을 때
마이크로태스크 큐 처리 (전부)
  ↓ 마이크로태스크 큐가 빌 때
매크로태스크 큐에서 하나 처리
  ↓
렌더링 (필요한 경우)
  ↓
반복
```

| 큐 | 포함 항목 | 처리 방식 |
|----|-----------|-----------|
| 마이크로태스크 | `Promise.then`, `queueMicrotask`, `MutationObserver` | 콜 스택 빌 때 **전부** 처리 |
| 매크로태스크 | `setTimeout`, `setInterval`, `I/O`, `requestAnimationFrame` | **하나씩** 처리 후 마이크로태스크 확인 |

## 구현할 것

### 1단계: 실행 순서 시각화 컴포넌트

```js
const tasks = []; // 실행 로그

function addLog(label, type) {
  tasks.push({ label, type, time: performance.now() });
}

// 실험 코드
addLog('동기 코드 1', 'sync');
setTimeout(() => addLog('setTimeout 1', 'macro'), 0);
Promise.resolve().then(() => addLog('Promise 1', 'micro'));
queueMicrotask(() => addLog('queueMicrotask', 'micro'));
setTimeout(() => addLog('setTimeout 2', 'macro'), 0);
Promise.resolve().then(() => addLog('Promise 2', 'micro'));
addLog('동기 코드 2', 'sync');

// 예상 순서: 동기1 → 동기2 → Promise1 → queueMicrotask → Promise2 → setTimeout1 → setTimeout2
```

시각화: 타임라인 바 차트로 각 태스크 실행 순서 표시

### 2단계: async/await = Promise 재작성
```js
async function fetchData() {
  console.log('A');         // 동기
  const data = await fetch(url); // Promise + 마이크로태스크
  console.log('B');         // await 이후 = 마이크로태스크 콜백
}
fetchData();
console.log('C');           // 동기

// 순서: A → C → B
// 이유: await 이후 코드는 Promise.then 콜백 = 마이크로태스크
```

### 3단계: 마이크로태스크 무한 루프 (위험 예시)
```js
// 마이크로태스크 큐는 전부 처리하므로 무한 루프 = UI 완전 블로킹
function dangerous() {
  Promise.resolve().then(dangerous); // 절대 하면 안 됨
}
// setTimeout 재귀는 매크로태스크 → 사이사이 렌더링 가능
```

### 4단계: React 자동 배치와 이벤트 루프
```jsx
// React 18: 이벤트 핸들러, setTimeout, Promise 모두 자동 배치
const handleClick = () => {
  setA(1); // 즉시 렌더링 안 함
  setB(2); // 함께 배치
  // → 렌더링 1번만 발생
};

setTimeout(() => {
  setA(1); // React 18: 여기서도 배치
  setB(2); // 렌더링 1번
}, 100);
```

## 측정 방법

1. **console.log + performance.now()** — 실행 순서와 타임스탬프
2. **시각화 컴포넌트** — 콜 스택 / 큐 상태를 박스로 표현

## 면접 포인트

**Q: "이벤트 루프를 설명해주세요"**
A: JS는 싱글 스레드로 콜 스택에서 코드를 실행합니다. 비동기 작업 완료 시 콜백을 큐에 추가합니다. 콜 스택이 비면 마이크로태스크 큐(Promise.then)를 전부 처리 후, 매크로태스크 큐(setTimeout)에서 하나를 처리합니다. 이 사이에 필요하면 렌더링이 발생합니다.

**Q: "setTimeout(fn, 0)의 실행 시간이 정확히 0ms인가요?"**
A: 아닙니다. 매크로태스크 큐에 추가되고, 앞의 마이크로태스크 처리와 현재 실행 중인 태스크가 끝난 후 실행됩니다. 실제로는 최소 4ms(HTML 스펙)의 지연이 있습니다.
