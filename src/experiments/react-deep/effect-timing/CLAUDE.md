# useEffect vs useLayoutEffect

> 핵심 질문: "툴팁 위치 계산 시 useEffect를 쓰면 왜 깜빡이는가?"

## 이론

**브라우저 렌더링 파이프라인과 Hook 실행 순서**:

```
1. React 렌더링 (Virtual DOM 계산)
2. DOM 업데이트 (실제 DOM 반영)
3. [useLayoutEffect 실행] ← Paint 전
4. 브라우저 Paint (화면에 표시)
5. [useEffect 실행] ← Paint 후
```

| Hook | 실행 시점 | 특징 | 사용 사례 |
|------|-----------|------|-----------|
| `useEffect` | Paint 이후 (비동기) | 화면이 먼저 그려진 후 실행 | API 호출, 이벤트 리스너, 대부분의 side effect |
| `useLayoutEffect` | Paint 이전 (동기) | DOM 측정/수정이 화면에 반영 전에 완료 | 툴팁 위치, 스크롤 위치, DOM 크기 측정 |

**깜빡임 발생 원리**:
```
useEffect로 위치 계산:
1. 초기 위치(0,0)로 렌더링
2. Paint → 화면에 0,0 위치로 표시 (사용자가 봄)
3. useEffect: 위치 계산 후 업데이트
4. 다시 Paint → 올바른 위치로 표시
→ 0,0 → 올바른 위치로 순간 이동(깜빡임)

useLayoutEffect로 위치 계산:
1. 초기 위치로 렌더링
2. useLayoutEffect: 위치 계산 후 업데이트 (Paint 전)
3. Paint → 올바른 위치로 바로 표시
→ 깜빡임 없음
```

## 구현할 것

### 1단계: 깜빡임 재현
```jsx
const Tooltip = ({ targetRef }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // useEffect: Paint 이후 실행 → 깜빡임 발생
  useEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, left: rect.left });
  }, []);

  return <div style={{ position: 'fixed', ...pos }}>툴팁</div>;
};
```

### 2단계: useLayoutEffect로 수정
```jsx
// useLayoutEffect: Paint 전 실행 → 깜빡임 없음
useLayoutEffect(() => {
  const rect = targetRef.current.getBoundingClientRect();
  setPos({ top: rect.bottom + 8, left: rect.left });
}, []);
```

### 3단계: 슬로우 모션으로 차이 시각화
```js
// 강제 지연으로 차이를 눈에 띄게
// Chrome DevTools → Rendering → Frame Rendering Stats 체크
// 또는 CPU 4x throttle로 차이 확인
```

### 4단계: 실행 순서 로그
```jsx
useEffect(() => {
  console.log('useEffect 실행'); // 나중에 찍힘
}, []);

useLayoutEffect(() => {
  console.log('useLayoutEffect 실행'); // 먼저 찍힘
}, []);

// 컴포넌트 렌더링 중
console.log('렌더링 중');
// 순서: 렌더링 중 → useLayoutEffect 실행 → useEffect 실행
```

## 측정 방법

1. **느린 CPU 시뮬레이션**: DevTools → Performance → CPU 4x Throttle
2. **화면 녹화**: 깜빡임 재현 후 슬로우 모션으로 확인
3. **console.log 타임스탬프**: 실행 순서 확인

## 면접 포인트

**Q: "useEffect와 useLayoutEffect의 차이는?"**
A: useEffect는 브라우저 Paint 이후 비동기로 실행됩니다. useLayoutEffect는 DOM 업데이트 후 Paint 전에 동기로 실행됩니다. DOM 크기 측정이나 위치 계산 후 즉시 DOM을 수정해야 할 때 useLayoutEffect를 사용합니다.

**Q: "useLayoutEffect를 항상 쓰면 어떻게 되나요?"**
A: useLayoutEffect는 동기로 실행되어 Paint를 차단합니다. 오래 걸리는 작업을 useLayoutEffect에 넣으면 화면이 업데이트되지 않는 현상이 발생합니다. 반드시 DOM 측정/수정이 필요한 경우에만 사용해야 합니다.
