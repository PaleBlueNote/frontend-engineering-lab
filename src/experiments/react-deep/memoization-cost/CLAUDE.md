# React.memo / useMemo / useCallback 비용 측정

> 핵심 질문: "메모이제이션을 추가했는데 왜 더 느려졌는가?"

## 이론

**메모이제이션 비용**:
```
useMemo(() => compute(), [dep]) 의 실행 비용
= 클로저 생성 비용 + Object.is(prevDep, nextDep) 비교 비용

이득 > 비용 → 메모이제이션 의미 있음
이득 < 비용 → 메모이제이션이 오히려 느림
```

**React.memo**: 부모 리렌더링 시 props가 바뀌지 않으면 자식 리렌더링 스킵.
단, props가 객체/함수이면 매번 새 참조 → React.memo 의미 없음.

```jsx
// 부모가 리렌더링될 때마다 새 함수 생성 → React.memo 무효화
<Child onClick={() => doSomething()} />

// useCallback으로 함수 참조 고정
const handleClick = useCallback(() => doSomething(), []);
<Child onClick={handleClick} /> // 같은 참조 → React.memo 효과 있음
```

## 구현할 것

### 1단계: 불필요한 리렌더링 탐지
```bash
npm i @welldone-software/why-did-you-render
```
```js
// wdyr.js (개발 모드에서만)
import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';
if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, { trackAllPureComponents: true });
}
```

### 2단계: 세 가지 시나리오 비교

**시나리오 A: React.memo 없음**
```jsx
const Child = ({ value }) => {
  renderCount.current++;
  return <div>값: {value} (렌더: {renderCount.current})</div>;
};
// 부모 상태 변경 시마다 Child도 리렌더링
```

**시나리오 B: React.memo + 함수 prop (효과 없음)**
```jsx
const Child = React.memo(({ onClick }) => { /* ... */ });
// 부모에서 onClick={() => handler()} → 매번 새 함수 → memo 무효
```

**시나리오 C: React.memo + useCallback (효과 있음)**
```jsx
const handleClick = useCallback(() => handler(), []);
<Child onClick={handleClick} />
// 함수 참조 고정 → memo 효과 있음
```

### 3단계: useMemo 이득/손실 측정
```js
const performanceTest = () => {
  const N = 10000;
  // 케이스 1: 단순 계산에 useMemo (비용 > 이득)
  const t1 = performance.now();
  for (let i = 0; i < N; i++) Math.random() * 2;
  const simple = performance.now() - t1;

  // 케이스 2: 복잡한 계산에 useMemo (이득 > 비용)
  const t2 = performance.now();
  for (let i = 0; i < N; i++) heavyComputation(i);
  const heavy = performance.now() - t2;

  return { simple, heavy };
};
```

## 측정 방법

1. **why-did-you-render 콘솔 출력** — 리렌더링 원인 자동 표시
2. **렌더링 카운터** — 화면에 숫자로 표시
3. **React DevTools Profiler** — 각 컴포넌트 렌더링 시간과 이유

## 면접 포인트

**Q: "useMemo와 useCallback의 차이는?"**
A: useMemo는 계산된 값을 메모이제이션하고, useCallback은 함수 자체를 메모이제이션합니다. `useCallback(fn, deps)`는 `useMemo(() => fn, deps)`와 동일합니다.

**Q: "React.memo가 효과 없는 경우는?"**
A: props로 객체 리터럴이나 함수를 직접 전달하면 부모 리렌더링 시마다 새 참조가 생성돼 memo가 항상 리렌더링합니다. useMemo/useCallback으로 참조를 안정화해야 합니다.
