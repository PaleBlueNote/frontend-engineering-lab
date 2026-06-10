# useTransition & useDeferredValue

> 핵심 질문: "검색어 입력 시 리스트가 버벅이는 현상을 어떻게 없애는가?"

## 이론

**Concurrent Mode의 핵심**: React가 렌더링 작업의 우선순위를 정할 수 있음.
- **긴급(Urgent)**: 사용자 직접 입력 — 즉시 반영해야 함
- **지연(Transition)**: 데이터로 인한 UI 업데이트 — 뒤로 미뤄도 됨

```
기존: 입력 → setQuery → 리스트 필터링(느림) → 입력 글자 표시 (지연)
Concurrent: 입력 → 글자 즉시 표시 + 리스트 필터링은 백그라운드
```

**useTransition**: 상태 업데이트를 transition(지연 작업)으로 표시.
**useDeferredValue**: 값의 업데이트를 지연. 외부 라이브러리 등 직접 transition 적용이 어려울 때.

## 구현할 것

### 1단계: 버벅임 재현
```jsx
const [query, setQuery] = useState('');
const filteredItems = items.filter(item =>
  item.name.includes(query) // 10,000개 필터링 = 느림
);

// 입력 시 필터링이 끝날 때까지 input이 업데이트 안 됨
<input value={query} onChange={e => setQuery(e.target.value)} />
```

### 2단계: useTransition 적용
```jsx
const [query, setQuery] = useState('');
const [deferredQuery, setDeferredQuery] = useState('');
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  setQuery(e.target.value); // 즉시 업데이트 (긴급)
  startTransition(() => {
    setDeferredQuery(e.target.value); // 지연 업데이트 (transition)
  });
};

const filteredItems = items.filter(item =>
  item.name.includes(deferredQuery) // deferredQuery로 필터링
);

// isPending: 필터링 진행 중일 때 true → 로딩 표시
<input value={query} onChange={handleChange} />
{isPending && <span>검색 중...</span>}
```

### 3단계: useDeferredValue 방식
```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query); // 자동으로 지연된 값

const filteredItems = useMemo(() =>
  items.filter(item => item.name.includes(deferredQuery)),
  [deferredQuery]
);
```

### 4단계: 시각화
- 입력창 + 필터링된 아이템 수 + FPS 패널
- Transition 없음: 입력 지연 눈에 띔
- Transition 있음: 입력 즉시 반응, 리스트는 순차 업데이트

## 측정 방법

1. **stats.js FPS** — 타이핑 중 FPS 비교
2. **React DevTools Profiler** — Transition 중 렌더링 우선순위 확인
3. **체감** — 실제로 타이핑해보며 차이 확인

## 면접 포인트

**Q: "useTransition과 useDeferredValue의 차이는?"**
A: useTransition은 상태 업데이트를 직접 transition으로 표시하며, isPending 상태를 제공합니다. useDeferredValue는 값 자체를 지연시키며, 외부에서 오는 값이나 직접 transition 적용이 어려운 경우에 사용합니다.

**Q: "Concurrent Mode란 무엇인가요?"**
A: React 18부터 도입된 렌더링 모델로, 렌더링 작업에 우선순위를 부여해 긴급한 업데이트(사용자 입력)가 먼저 처리되도록 합니다. 이를 통해 UI가 대량 업데이트 중에도 응답성을 유지할 수 있습니다.
