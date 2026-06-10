# Day 16: Event Loop

> 핵심 질문: "console.log 세 줄의 출력 순서를 예측할 수 있는가?"

## 이론

**실행 순서**:
1. **콜 스택(Call Stack)** — 현재 실행 중인 함수
2. **마이크로태스크 큐** — Promise.then, queueMicrotask, MutationObserver. 콜 스택 비워지면 **전부** 처리
3. **매크로태스크 큐(Task Queue)** — setTimeout, setInterval, I/O. 마이크로태스크 처리 후 **하나씩** 처리
4. **렌더링** — 매크로태스크와 매크로태스크 사이에 실행 (필요시)

```js
console.log('1');          // 콜 스택 (즉시)
setTimeout(() => console.log('2'), 0); // 매크로태스크 큐
Promise.resolve().then(() => console.log('3')); // 마이크로태스크 큐
console.log('4');          // 콜 스택 (즉시)

// 출력 순서: 1 → 4 → 3 → 2
```

**React의 setState batch 업데이트**도 이벤트 루프와 연관됨:
React 18+는 setTimeout, Promise 안에서도 자동 배치 처리.

## 구현할 것

### 1단계: 이벤트 루프 시각화 컴포넌트
- 콜 스택, 마이크로태스크 큐, 매크로태스크 큐를 박스로 표현
- "실행" 버튼 클릭 → 각 항목이 큐에 들어오고 나가는 애니메이션
- 예제 코드 선택 → 실행 순서 예측 → 실제 실행 결과 비교

### 2단계: 실행 순서 퀴즈
```js
// 퀴즈 1
async function main() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
}
main();
console.log('C');
// 정답: A → C → B
// 이유: await는 Promise.then으로 변환 → 마이크로태스크

// 퀴즈 2
setTimeout(() => console.log('T1'), 0);
Promise.resolve().then(() => {
  console.log('P1');
  setTimeout(() => console.log('T2'), 0);
}).then(() => console.log('P2'));
// 정답: P1 → P2 → T1 → T2
```

### 3단계: React setState 배치 동작
```jsx
const handleClick = () => {
  setCount(c => c + 1); // 바로 렌더링 안 함
  setName('Alice');      // 같이 배치
  // → 렌더링 1번만 발생
};

setTimeout(() => {
  setCount(c => c + 1); // React 18: 여기서도 배치 처리
}, 100);
```

## 측정 방법

1. **console.log 타임스탬프** — `console.log(performance.now(), '메시지')`
2. **Performance 탭** — Tasks, Microtasks 구분 확인

## 면접 포인트

**Q: "이벤트 루프를 설명해주세요"**
A: JS는 싱글 스레드로 콜 스택에서 코드를 실행합니다. 비동기 작업(타이머, 네트워크)이 완료되면 태스크 큐에 콜백을 넣습니다. 콜 스택이 비면 마이크로태스크 큐(Promise.then)를 모두 처리하고, 그 다음 매크로태스크 큐(setTimeout)를 하나 처리합니다.

**Q: "Promise와 setTimeout의 실행 순서는?"**
A: Promise.then(마이크로태스크)이 setTimeout(매크로태스크)보다 먼저 실행됩니다. 마이크로태스크 큐는 콜 스택이 빌 때마다 전부 처리되기 때문입니다.
