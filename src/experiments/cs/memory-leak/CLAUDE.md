# Day 9: Memory Leak

> 핵심 질문: "컴포넌트가 언마운트됐는데 왜 메모리에 남아있는가?"

## 이론

**GC(Garbage Collection)**: 더 이상 참조되지 않는 객체를 메모리에서 해제.
참조가 하나라도 살아있으면 GC가 수거하지 않는다.

**프론트엔드에서 메모리 누수가 발생하는 주요 패턴**:

| 패턴 | 원인 | 해결 |
|------|------|------|
| 이벤트 리스너 미제거 | 컴포넌트 언마운트 후에도 DOM 이벤트가 컴포넌트 참조 유지 | `removeEventListener` |
| setInterval/setTimeout 미정리 | 타이머가 계속 실행되며 클로저 참조 유지 | `clearInterval` / `clearTimeout` |
| 클로저의 대형 객체 캡처 | 클로저가 의도치 않게 큰 객체를 캡처 | 필요한 값만 캡처 |
| 전역 변수 누적 | 모듈 수준 변수에 계속 데이터 추가 | WeakMap 사용 |
| Observer 미해제 | IntersectionObserver, ResizeObserver 등 | `observer.disconnect()` |

## 구현할 것

### 1단계: 누수 발생 시나리오 (의도적으로 구현)
```jsx
// 나쁜 예시: 정리 없는 이벤트 리스너
useEffect(() => {
  const handler = () => {
    setCount(count + 1); // 클로저로 count 캡처
  };
  window.addEventListener('click', handler);
  // cleanup 없음!
}, [count]);
```

### 2단계: 올바른 정리
```jsx
// 좋은 예시: cleanup 포함
useEffect(() => {
  const handler = () => setCount(c => c + 1); // 함수형 업데이트로 클로저 의존성 제거
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler); // cleanup
}, []); // 의존성 없음
```

### 3단계: 누수 시나리오별 데모 버튼
- 버튼 클릭 → 컴포넌트 마운트 → 다시 클릭 → 언마운트
- 누수 있음: 언마운트 후 메모리 증가
- 누수 없음: 언마운트 후 메모리 반환

### 4단계: WeakRef / WeakMap 활용 (심화)
```js
// WeakMap: key가 GC되면 항목도 자동 제거
const cache = new WeakMap();
cache.set(domNode, expensiveData); // domNode가 제거되면 캐시도 자동 정리
```

## 측정 방법

1. **Chrome DevTools → Memory 탭**
   - "Take Heap Snapshot" → 컴포넌트 마운트 → 언마운트 → 다시 스냅샷
   - 스냅샷 비교: 객체가 남아있으면 누수
2. **Performance Monitor 패널** — 실시간 JS 힙 크기 그래프

## 면접 포인트

**Q: "클로저란 무엇인가요?"**
A: 함수가 선언될 때의 렉시컬 환경(스코프)을 기억하는 함수입니다. 외부 함수가 종료된 후에도 내부 함수가 외부 변수에 접근할 수 있습니다.

**Q: "React에서 메모리 누수를 방지하는 방법은?"**
A: useEffect의 cleanup 함수에서 이벤트 리스너, 타이머, Observer를 제거합니다. 비동기 요청은 AbortController로 취소합니다.

**Q: "WeakRef와 WeakMap이 일반 참조와 다른 점은?"**
A: Weak 참조는 GC의 수거를 막지 않습니다. 객체가 다른 곳에서 참조되지 않으면 Weak 참조가 있어도 GC가 수거합니다.
