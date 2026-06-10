# Day 3: Frame Control

> 핵심 질문: "왜 setInterval(fn, 16)은 항상 60fps가 되지 않는가?"

## 이론

- **V-Sync**: 모니터 주사율(보통 60Hz)에 맞춰 화면 갱신. 1프레임 = 16.67ms
- **requestAnimationFrame(rAF)**: 다음 V-Sync 직전에 콜백 실행 → 정확히 프레임 타이밍에 동기화
- **setInterval(fn, 16)**: JS 타이머는 이벤트 루프 상태에 따라 지연 발생. 16ms가 정확히 지켜지지 않음
- **rAF 자동 중지**: 백그라운드 탭에서 rAF 콜백 자동 중단 → 배터리 절약. setInterval은 계속 실행

## 구현할 것

### 컴포넌트 구조
```
FrameControl/
  index.jsx     ← 메인 실험 컴포넌트
```

### 구현 단계

**1단계: 두 방식으로 동일한 애니메이션 구현**
```js
// setInterval 방식
intervalRef.current = setInterval(() => {
  positionRef.current = (positionRef.current + 2) % 100;
  setPos(positionRef.current);
}, 16);

// rAF 방식
const loop = (timestamp) => {
  positionRef.current = (positionRef.current + 2) % 100;
  setPos(positionRef.current);
  rafRef.current = requestAnimationFrame(loop);
};
rafRef.current = requestAnimationFrame(loop);
```

**2단계: 타이머 정확도 측정**
```js
// 실제 콜백 간격을 배열에 기록
const intervals = [];
let lastTime = performance.now();
const measure = () => {
  const now = performance.now();
  intervals.push(now - lastTime); // 실제 간격(ms)
  lastTime = now;
};
```

**3단계: 히스토그램 시각화**
- X축: 실제 콜백 간격(ms), Y축: 빈도
- setInterval: 분산이 큼 (불규칙), rAF: 16.67ms 근처에 집중

**4단계: 메인 스레드 부하 테스트**
```js
// 무거운 동기 작업으로 블로킹
const heavyTask = () => {
  const start = performance.now();
  while (performance.now() - start < 50) {} // 50ms 블로킹
};
```
→ setInterval은 밀려서 프레임 폭발, rAF는 블로킹 후 재개 시 자동 건너뜀

## 측정 방법

1. stats.js FPS 패널 — 두 방식 각각 FPS 비교
2. 콜백 간격 히스토그램 — 정확도 시각화
3. 탭 전환 테스트 — 백그라운드 시 rAF 중단 여부 확인

## 면접 포인트

**Q: "requestAnimationFrame을 왜 쓰나요?"**
A: 브라우저 렌더링 사이클에 동기화되어 V-Sync에 맞춰 실행됩니다. 백그라운드 탭에서 자동으로 중단되어 배터리를 절약하고, 프레임 드롭 시 자동으로 건너뛰어 타이밍을 유지합니다.

**Q: "60fps란 무엇인가요?"**
A: 1초에 60개 프레임. 1프레임 예산 = 16.67ms. 이 시간 안에 JS 실행 + 렌더링을 모두 완료해야 합니다.

**Q: "rAF 콜백에서 무거운 계산을 하면 어떻게 되나요?"**
A: 해당 프레임 예산(16.67ms)을 초과해 다음 프레임이 밀립니다. 무거운 계산은 Web Worker로 분리해야 합니다.
