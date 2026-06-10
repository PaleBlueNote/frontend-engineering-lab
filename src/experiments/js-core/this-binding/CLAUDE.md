# this 바인딩 4가지 규칙

> 핵심 질문: "이벤트 핸들러에서 this가 undefined인 이유는?"

## 이론

**this 결정 규칙 (우선순위 순)**:

| 규칙 | 방법 | 결과 |
|------|------|------|
| 1. new 바인딩 | `new Foo()` | 새 객체 |
| 2. 명시적 바인딩 | `.call()`, `.apply()`, `.bind()` | 지정한 객체 |
| 3. 암시적 바인딩 | `obj.method()` | obj |
| 4. 기본 바인딩 | `method()` (단독 호출) | undefined (strict) / window |

**화살표 함수**: 자체 this 없음. 선언 시점의 외부 스코프 this를 캡처 (렉시컬 this).

```js
const obj = {
  name: 'Alice',
  greet: function() {
    console.log(this.name); // 'Alice' (암시적 바인딩)
  },
  greetArrow: () => {
    console.log(this?.name); // undefined (화살표: 선언 시점 = 모듈 스코프)
  }
};
```

## 구현할 것

### 1단계: 4가지 바인딩 규칙 인터랙티브 데모

```js
function showThis() {
  return this; // 호출 방식에 따라 다름
}

// 기본 바인딩
showThis(); // undefined (strict mode)

// 암시적 바인딩
const obj = { name: 'obj', showThis };
obj.showThis(); // { name: 'obj', showThis: f }

// 명시적 바인딩
showThis.call({ name: 'explicit' }); // { name: 'explicit' }
const bound = showThis.bind({ name: 'bound' });
bound(); // { name: 'bound' }

// new 바인딩
function Person(name) { this.name = name; }
const p = new Person('Alice'); // { name: 'Alice' }
```

### 2단계: 이벤트 핸들러 this 문제

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  // 방법 1: bind (생성자에서)
  handleClick1() { this.setState({ count: this.state.count + 1 }); }

  // 방법 2: 화살표 함수 클래스 필드
  handleClick2 = () => { this.setState({ count: this.state.count + 1 }); }

  render() {
    return (
      <>
        {/* this = undefined (엄격 모드) */}
        <button onClick={this.handleClick1}>실패</button>

        {/* bind로 수정 */}
        <button onClick={this.handleClick1.bind(this)}>성공</button>

        {/* 화살표 함수 - 렉시컬 this */}
        <button onClick={this.handleClick2}>성공</button>

        {/* 인라인 화살표 함수 */}
        <button onClick={() => this.handleClick1()}>성공 (단, 매 렌더링 새 함수)</button>
      </>
    );
  }
}
```

### 3단계: call / apply / bind 차이
```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const user = { name: 'Alice' };

greet.call(user, 'Hello', '!');     // 즉시 실행, 인수 개별 전달
greet.apply(user, ['Hello', '!']);  // 즉시 실행, 인수 배열 전달
const boundGreet = greet.bind(user); // 새 함수 반환, 나중에 실행
boundGreet('Hi', '?');
```

## 면접 포인트

**Q: "this 바인딩을 설명해주세요"**
A: this는 함수가 어떻게 호출되느냐에 따라 결정됩니다. 객체 메서드로 호출 시 그 객체, call/apply/bind로 명시적 지정, new로 생성 시 새 객체, 단독 호출 시 undefined(엄격 모드)입니다. 화살표 함수는 자체 this가 없고 선언 시점의 상위 스코프 this를 사용합니다.

**Q: "화살표 함수와 일반 함수의 this 차이는?"**
A: 일반 함수는 호출 방식에 따라 this가 동적으로 결정됩니다. 화살표 함수는 선언 시점의 외부 스코프 this를 고정(렉시컬)합니다. 이벤트 핸들러나 콜백에서 클래스의 this를 사용하려면 화살표 함수나 bind를 사용합니다.
