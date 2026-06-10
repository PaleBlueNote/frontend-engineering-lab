# Day 14: Memoization

> 핵심 질문: "useMemo는 항상 쓸수록 좋은가?"

## 이론

**메모이제이션**: 동일한 입력에 대한 결과를 캐싱하여 재계산 방지.
**비용 vs 이득**: 클로저 생성 + 의존성 배열 비교 비용 < 재계산 비용 → 메모이제이션 의미 있음.

```
useMemo 비용: 클로저 생성 + deps 배열 비교 (Object.is)
이득: 무거운 계산 스킵

단순한 연산이면: 비용 > 이득 → useMemo 오히려 느림
```

## 구현할 것

### 1단계: useMemo 이득이 있는 경우
```jsx
// 무거운 계산 (피보나치, 정렬, 필터링 등)
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.value - b.value); // O(n log n)
}, [items]);
// items가 바뀌지 않으면 재계산 없음
```

### 2단계: useMemo 이득이 없는 경우
```jsx
// 너무 단순한 계산
const double = useMemo(() => count * 2, [count]);
// count * 2 계산 비용 < 클로저+deps 비교 비용 → useMemo 없는 게 빠름
```

### 3단계: useCallback과 참조 동등성
```jsx
// useCallback 없으면: 리렌더링마다 새 함수 → 자식 컴포넌트도 리렌더링
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []); // 함수 참조 고정 → React.memo 자식이 리렌더링 안 됨
```

### 4단계: 측정 - 언제 쓰고 언제 안 써야 하는지
| 상황 | useMemo 효과 |
|------|-------------|
| 1000개 배열 필터링 | 의미 있음 |
| `a + b` 덧셈 | 없음 (오히려 느림) |
| 자식에 함수 prop 전달 + React.memo | useCallback 의미 있음 |
| 자식이 React.memo가 아님 | useCallback 의미 없음 |

### 5단계: LRU 캐시 직접 구현
```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // 삽입 순서 = 최근 사용 순서
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // 맨 뒤로 이동 = 최근 사용
    return val;
  }
  put(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity)
      this.map.delete(this.map.keys().next().value); // 가장 오래된 것 제거
    this.map.set(key, val);
  }
}
```

## 면접 포인트

**Q: "useMemo와 useCallback의 차이는?"**
A: useMemo는 계산 결과값을 메모이제이션합니다. useCallback은 함수 자체를 메모이제이션합니다. `useCallback(fn, deps)`는 `useMemo(() => fn, deps)`와 같습니다.

**Q: "useMemo를 항상 써야 하나요?"**
A: 아닙니다. 메모이제이션 자체에 클로저 생성과 의존성 비교 비용이 있습니다. 재계산이 충분히 비쌀 때만 의미가 있습니다. React 19 Compiler는 이를 자동으로 판단합니다.

**Q: "LRU 캐시를 어떻게 구현하나요?"**
A: Map의 삽입 순서 보장 특성을 활용합니다. get 시 해당 항목을 삭제 후 재삽입(맨 뒤로), 용량 초과 시 첫 번째 항목(가장 오래된 것) 삭제합니다.
