# React Reconciliation & Virtual DOM

> 핵심 질문: "key가 없을 때 리스트 업데이트가 왜 느린가?"

## 이론

**Virtual DOM**: 실제 DOM의 메모리 내 표현. 변경 전/후 Virtual DOM을 비교(Diffing)해 최소한의 실제 DOM 업데이트만 수행.

**Diffing 알고리즘 규칙**:
1. 다른 타입의 요소 (`div` → `span`) → 트리 전체 재생성
2. 같은 타입의 요소 → 속성만 업데이트
3. 리스트 → `key`로 이전/이후 항목 매칭

**key가 없을 때 리스트 업데이트 문제**:
```
이전: [A, B, C]
이후: [X, A, B, C]  // X를 앞에 추가

key 없음: 인덱스 기준 비교
  → 위치 0: A→X (업데이트), 위치 1: B→A (업데이트), ... 전체 업데이트 = O(n)

key 있음: key 기준 매칭
  → X는 새 항목(생성), A,B,C는 이동 = O(1)에 가까움
```

## 구현할 것

### 1단계: key 유무에 따른 DOM 재사용 시각화
```jsx
// 각 아이템에 input 상태를 유지
// key 없음: 앞에 추가 → 기존 input 값이 밀림 (DOM 재사용 실패)
// key 있음: 앞에 추가 → 기존 input 값 유지 (DOM 재사용 성공)
const [items, setItems] = useState(['B', 'C', 'D']);
const addFront = () => setItems(prev => ['A', ...prev]);

// key 없음
items.map(item => <div><input placeholder={item} /></div>)

// key 있음
items.map(item => <div key={item}><input placeholder={item} /></div>)
```

### 2단계: 렌더링 횟수 측정
```jsx
// 리스트 아이템에 렌더링 카운터 추가
const ListItem = ({ id, value }) => {
  const countRef = useRef(0);
  countRef.current++;
  return (
    <div>
      {value} (렌더링: {countRef.current}회)
    </div>
  );
};
```

### 3단계: Fiber 탐색 (심화)
```js
// React DevTools에서 __reactFiber 내부 구조 탐색
const el = document.querySelector('#root');
const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber'));
console.log(el[fiberKey]); // Fiber 노드 트리 확인
```

## 측정 방법

1. **Chrome DevTools → Elements 탭** — DOM 업데이트 시 강조 표시 (노란 깜빡임)
2. **React DevTools → Profiler** — 렌더링된 컴포넌트와 이유
3. **렌더링 카운터** — 실제 리렌더링 횟수

## 면접 포인트

**Q: "React의 Reconciliation을 설명해주세요"**
A: Virtual DOM의 이전/이후 상태를 Diffing 알고리즘으로 비교해 실제 DOM 변경을 최소화하는 과정입니다. 같은 타입이면 속성만 업데이트하고, 다른 타입이면 서브트리를 재생성합니다.

**Q: "key를 index로 쓰면 안 되는 이유는?"**
A: 리스트 앞에 아이템을 추가하거나 순서가 바뀌면 인덱스가 바뀝니다. React는 key가 같으면 같은 컴포넌트라고 판단하므로, 기존 상태가 엉뚱한 아이템에 유지될 수 있습니다. 고유하고 안정적인 ID를 key로 사용해야 합니다.
