# 클로저 (Closure)

> 핵심 질문: "왜 루프에서 만든 함수가 모두 같은 값을 출력하는가?"

## 이론

**클로저**: 함수가 선언될 때의 렉시컬 환경(외부 스코프)을 기억하는 함수.
외부 함수가 종료된 후에도 내부 함수는 외부 변수에 접근 가능.

```js
function outer() {
  let count = 0;                  // 외부 변수
  return function inner() {       // 클로저
    count++;                      // 외부 변수 접근
    return count;
  };
}
const counter = outer();         // outer 종료됐지만
counter(); // 1                  // count는 여전히 살아있음
counter(); // 2
```

**GC와 클로저**: 클로저가 외부 변수를 참조하는 한, 그 변수는 GC 수거 대상이 아님.

## 구현할 것

### 1단계: 클래식 루프 문제
```js
// var 사용 시 (공유 스코프)
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(() => console.log(i));
}
funcs[0](); // 3 (기대: 0)
funcs[1](); // 3 (기대: 1)
// 이유: var는 함수 스코프 → 모든 함수가 같은 i를 참조

// let 사용 시 (블록 스코프 → 각자의 i)
for (let i = 0; i < 3; i++) {
  funcs.push(() => console.log(i));
}
funcs[0](); // 0 ✅
funcs[1](); // 1 ✅

// 또는 IIFE로 해결 (let 이전 방식)
for (var i = 0; i < 3; i++) {
  funcs.push(((j) => () => console.log(j))(i));
}
```

### 2단계: 인터랙티브 데모
- 버튼 클릭 → 위 세 가지 케이스 실행 결과를 화면에 표시
- 각 케이스별 스코프 시각화 (박스 다이어그램)

### 3단계: 클로저 활용 패턴
```js
// 1. 데이터 은닉 (private 변수 모사)
function createCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

// 2. 팩토리 함수
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);
const triple = multiplier(3);

// 3. 부분 적용(Partial Application)
function add(a) {
  return (b) => a + b;
}
const add5 = add(5);
```

### 4단계: 클로저 메모리 누수 확인
```js
// 누수 예시: 대형 데이터를 클로저에 캡처
function setup() {
  const largeData = new Array(1_000_000).fill('data'); // 큰 배열
  const handler = () => {
    console.log(largeData.length); // largeData 전체를 캡처
  };
  document.addEventListener('click', handler);
  // handler를 제거하지 않으면 largeData도 GC 안 됨
}
```
→ DevTools Memory 탭에서 heap 크기 확인

## 면접 포인트

**Q: "클로저란 무엇인가요?"**
A: 함수가 자신이 선언된 렉시컬 환경을 기억하는 것입니다. 외부 함수가 반환된 후에도 내부 함수는 외부 변수에 접근할 수 있습니다.

**Q: "클로저의 실제 활용 사례는?"**
A: 데이터 은닉(private 변수 모사), 팩토리 함수, 커링, 이벤트 핸들러에서 상태 유지 등에 사용합니다. React의 useState도 내부적으로 클로저를 활용합니다.

**Q: "var와 let의 스코프 차이는?"**
A: var는 함수 스코프, let/const는 블록 스코프입니다. 루프에서 var를 사용하면 모든 이터레이션이 같은 변수를 공유하고, let은 이터레이션마다 새 바인딩이 생성됩니다.
