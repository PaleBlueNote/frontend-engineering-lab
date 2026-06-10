# Debounce & Throttle 직접 구현

> 핵심 질문: "라이브러리 없이 Debounce를 구현해보세요"

## 이론 (Section 1 Day 6과 연계)

Section 1 Day 6에서 개념과 시각화를 다뤘다면, 여기서는 **직접 구현**에 집중한다.

## 구현할 것

### 1단계: Debounce 완전 구현

```js
function debounce(fn, delay, options = {}) {
  const { leading = false, trailing = true } = options;
  let timerId;
  let lastArgs;
  let isInvoked = false;

  const invoke = (args) => {
    isInvoked = true;
    return fn(...args);
  };

  const debounced = (...args) => {
    lastArgs = args;
    const isFirstCall = !timerId;

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      if (trailing && lastArgs) invoke(lastArgs);
      isInvoked = false;
    }, delay);

    // leading edge: 첫 번째 호출 즉시 실행
    if (leading && isFirstCall) invoke(args);
  };

  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };

  debounced.flush = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
      if (lastArgs) invoke(lastArgs);
    }
  };

  return debounced;
}
```

### 2단계: Throttle 완전 구현

```js
function throttle(fn, limit, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastRun = 0;
  let timerId;

  return (...args) => {
    const now = Date.now();
    const remaining = limit - (now - lastRun);

    if (remaining <= 0) {
      // 충분한 시간이 지남 → 즉시 실행
      if (timerId) { clearTimeout(timerId); timerId = null; }
      lastRun = now;
      fn(...args);
    } else if (trailing && !timerId) {
      // 마지막 호출 보장 (trailing)
      timerId = setTimeout(() => {
        lastRun = Date.now();
        timerId = null;
        fn(...args);
      }, remaining);
    }
  };
}
```

### 3단계: 단위 테스트

```js
// Debounce 테스트 (Jest/Vitest 사용 가능)
describe('debounce', () => {
  it('delay 이전 여러 번 호출 → 마지막 1번만 실행', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(); debounced(); debounced();
    expect(fn).not.toHaveBeenCalled();

    await new Promise(r => setTimeout(r, 150));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancel()로 예약된 호출 취소', async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();

    await new Promise(r => setTimeout(r, 150));
    expect(fn).not.toHaveBeenCalled();
  });
});
```

### 4단계: 검색창에 실제 적용
```jsx
const [query, setQuery] = useState('');
const [apiCallCount, setApiCallCount] = useState(0);

const debouncedSearch = useMemo(
  () => debounce((q) => {
    setApiCallCount(c => c + 1);
    // 실제 API 호출
  }, 300),
  []
);

const handleChange = (e) => {
  setQuery(e.target.value);
  debouncedSearch(e.target.value);
};
```

## 면접 포인트

**Q: "Debounce를 직접 구현해보세요"**
A: setTimeout + clearTimeout 패턴으로 구현합니다. 매 호출 시 이전 타이머를 취소하고 새로 설정해, 마지막 호출 후 delay ms가 지났을 때만 실행합니다.

**Q: "leading edge debounce란 무엇인가요?"**
A: 기본 debounce는 마지막 호출 후 실행(trailing)인데, leading edge는 첫 번째 호출을 즉시 실행하고 이후 연속 호출을 무시합니다. 버튼 중복 클릭 방지에 유용합니다.
