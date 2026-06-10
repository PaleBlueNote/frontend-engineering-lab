# Day 10: Immutability

> 핵심 질문: "왜 React는 state를 직접 수정하면 안 되는가?"

## 이론

**React의 변경 감지 방식**: `===` 참조 비교. 같은 객체를 수정해도 참조가 같으면 변경을 감지하지 못함.

```js
const state = { count: 0 };
state.count = 1; // 직접 수정
state === state; // true → React가 변경을 감지 못함 → 리렌더링 없음

const newState = { ...state, count: 1 }; // 새 객체 생성
state === newState; // false → React가 변경 감지 → 리렌더링 발생
```

**불변 업데이트 패턴**:

| 작업 | 가변(나쁨) | 불변(좋음) |
|------|-----------|-----------|
| 값 수정 | `obj.key = val` | `{ ...obj, key: val }` |
| 배열 추가 | `arr.push(item)` | `[...arr, item]` |
| 배열 삭제 | `arr.splice(i, 1)` | `arr.filter((_, idx) => idx !== i)` |
| 중첩 수정 | `obj.a.b = val` | `{ ...obj, a: { ...obj.a, b: val } }` |

## 구현할 것

### 1단계: 직접 수정 vs 불변 업데이트 비교
```jsx
// 나쁜 예시: 직접 수정 → 리렌더링 안 됨
const [items, setItems] = useState([1, 2, 3]);
const badAdd = () => {
  items.push(4); // 같은 배열 참조
  setItems(items); // React: 같은 배열이네? 변경 없음
};

// 좋은 예시: 새 배열 생성
const goodAdd = () => {
  setItems([...items, 4]); // 새 배열 → 리렌더링
};
```

### 2단계: 중첩 객체 불변 업데이트
```jsx
const [user, setUser] = useState({
  profile: { name: 'Alice', address: { city: 'Seoul' } }
});

// 중첩 업데이트
const updateCity = (city) => {
  setUser(prev => ({
    ...prev,
    profile: {
      ...prev.profile,
      address: { ...prev.profile.address, city }
    }
  }));
};
```

### 3단계: Immer로 가변 문법으로 불변 업데이트
```bash
npm i immer use-immer
```
```jsx
import { useImmer } from 'use-immer';
const [user, updateUser] = useImmer(initialUser);
const updateCity = (city) => {
  updateUser(draft => {
    draft.profile.address.city = city; // 직접 수정하는 것처럼 작성, 내부적으로 불변
  });
};
```

### 4단계: structuredClone vs JSON.parse/stringify vs immer 성능 비교

## 측정 방법

1. **렌더링 카운터** — 직접 수정 시 렌더링 횟수 vs 불변 업데이트 시 횟수
2. **React DevTools Profiler** — 리렌더링 원인 확인

## 면접 포인트

**Q: "React에서 불변성을 유지해야 하는 이유는?"**
A: React가 상태 변경을 `===` 참조 비교로 감지하기 때문입니다. 객체를 직접 수정하면 참조가 바뀌지 않아 리렌더링이 발생하지 않습니다.

**Q: "깊은 복사(Deep Copy) 방법은?"**
A: `structuredClone()` (최신 브라우저), `JSON.parse(JSON.stringify(obj))` (함수/undefined 제외), lodash `_.cloneDeep()`. 성능은 structuredClone이 가장 좋습니다.
