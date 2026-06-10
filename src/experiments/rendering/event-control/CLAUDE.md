# Day 6: Event Control (Debounce & Throttle)

> 핵심 질문: "검색창 입력 시 API를 몇 번 호출해야 하는가?"

## 이론

| 패턴 | 동작 | 사용 사례 |
|------|------|-----------|
| **Debounce** | 마지막 이벤트 후 N ms 뒤에 딱 1번 실행 | 검색창 입력, resize 완료 후 처리 |
| **Throttle** | N ms마다 최대 1번 실행 (중간 이벤트 무시) | 스크롤 이벤트, 마우스 이동, 게임 입력 |

```
Debounce:  이벤트 ─── 이벤트 ─── 이벤트 ─────── [N ms 경과] → 실행
Throttle:  이벤트 → 실행, 이벤트(무시), [N ms] → 이벤트 → 실행
```

## 구현할 것

### 1단계: 직접 구현 (라이브러리 없이)
```js
// Debounce
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
function throttle(fn, limit) {
  let lastRun = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn(...args);
    }
  };
}
```

### 2단계: 시각화 컴포넌트
- 입력창 또는 슬라이더 이동 → 이벤트 발생 타임라인 표시
- 이벤트 발생 횟수(총) vs 실제 함수 호출 횟수 카운터
- 세 가지 비교: 최적화 없음 / debounce(300ms) / throttle(100ms)

### 3단계: 측정 지표

| 상황 | 총 이벤트 | 함수 호출 |
|------|-----------|-----------|
| 최적화 없음 | 100 | 100 |
| debounce 300ms | 100 | 1-3 |
| throttle 100ms | 100 | ~10 |

### 4단계: 취소 가능한 debounce (심화)
```js
// 진행 중인 API 요청도 취소
const debouncedSearch = useMemo(() => {
  let controller;
  return debounce(async (query) => {
    controller?.abort();
    controller = new AbortController();
    const data = await fetch(`/api/search?q=${query}`, {
      signal: controller.signal
    });
    // ...
  }, 300);
}, []);
```

## 측정 방법

1. **Network 탭** — API 요청 수 비교 (최적화 없음 vs debounce)
2. **직접 카운터** — 이벤트 발생 수 / 함수 실행 수 화면에 표시
3. **타임라인 시각화** — 각 이벤트와 실행 시점을 점으로 표시

## 면접 포인트

**Q: "Debounce와 Throttle의 차이는? 언제 각각 쓰나요?"**
A: Debounce는 마지막 이벤트 후 일정 시간 뒤 한 번 실행합니다. 입력이 멈췄을 때 처리하는 검색창에 적합합니다. Throttle은 일정 간격으로 최대 한 번 실행합니다. 스크롤처럼 연속적으로 발생하지만 최신 위치가 중요한 경우에 적합합니다.

**Q: "Debounce를 직접 구현해보세요"**
A: setTimeout + clearTimeout 패턴으로 구현합니다. (위 코드 참고)

**Q: "Leading edge debounce란?"**
A: 첫 번째 이벤트는 즉시 실행하고, 이후 연속 이벤트는 무시하다가 일정 시간 후 다시 허용. 버튼 중복 클릭 방지에 유용합니다.
