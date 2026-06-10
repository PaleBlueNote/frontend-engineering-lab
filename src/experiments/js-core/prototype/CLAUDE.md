# 프로토타입 체인

> 핵심 질문: "class 키워드는 기존 프로토타입과 무엇이 다른가?"

## 이론

**프로토타입 체인**: 프로퍼티/메서드를 찾을 때 현재 객체 → 프로토타입 → 프로토타입의 프로토타입 → ... → null 순으로 탐색.

```js
const arr = [1, 2, 3];
arr.map       // arr 자체에 없음
  → arr.__proto__ (Array.prototype) 에 있음 → 반환
arr.toString  // Array.prototype에도 없음
  → Array.prototype.__proto__ (Object.prototype) 에 있음 → 반환
```

**class는 프로토타입의 문법적 설탕(Syntactic Sugar)**:
```js
// ES5 방식
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} speaks`;
};

// ES6 class (완전히 동일한 동작)
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} speaks`; }
}

// 확인
typeof Animal; // 'function' (!!! class가 아님)
Animal.prototype.speak; // 존재
```

## 구현할 것

### 1단계: 프로토타입 체인 시각화
```js
// 체인 탐색 함수
function getPrototypeChain(obj) {
  const chain = [];
  let current = obj;
  while (current !== null) {
    chain.push(current.constructor?.name || 'Object.prototype');
    current = Object.getPrototypeOf(current);
  }
  return chain;
}

getPrototypeChain([]); 
// ['Array', 'Object', 'Object.prototype (null)']

getPrototypeChain(new Map());
// ['Map', 'Object', 'Object.prototype (null)']
```

### 2단계: class vs prototype 비교 (side-by-side)
```js
// Prototype 방식
function Dog(name, breed) {
  this.name = name;
  this.breed = breed;
}
Dog.prototype.bark = function() { return `${this.name}: 왈!`; };

// Class 방식
class Cat {
  constructor(name, breed) {
    this.name = name;
    this.breed = breed;
  }
  meow() { return `${this.name}: 야옹!`; }
}

// 두 방식이 내부적으로 같음을 확인
console.log(typeof Dog === typeof Cat); // true (둘 다 'function')
console.log(Dog.prototype.bark);
console.log(Cat.prototype.meow);
```

### 3단계: 상속 구현
```js
// Prototype 방식
function ServiceDog(name, service) {
  Dog.call(this, name, 'service'); // super() 역할
  this.service = service;
}
ServiceDog.prototype = Object.create(Dog.prototype);
ServiceDog.prototype.constructor = ServiceDog;

// Class 방식 (가독성 훨씬 좋음)
class ServiceCat extends Cat {
  constructor(name, service) {
    super(name, 'service'); // 동일
    this.service = service;
  }
}
```

### 4단계: `hasOwnProperty` vs 프로토타입 프로퍼티
```js
const dog = new Dog('Rex', 'Labrador');
dog.hasOwnProperty('name');  // true (인스턴스 자신)
dog.hasOwnProperty('bark');  // false (프로토타입에 있음)
'bark' in dog;               // true (체인 전체 탐색)
```

## 면접 포인트

**Q: "프로토타입 기반 상속이란?"**
A: JavaScript 객체는 프로토타입 객체를 참조하며, 메서드/프로퍼티를 찾을 때 현재 객체에 없으면 프로토타입 체인을 따라 올라갑니다. class 문법은 이 프로토타입 체인을 더 읽기 쉽게 표현한 문법적 설탕입니다.

**Q: "class와 function의 차이는?"**
A: `typeof MyClass === 'function'`이므로 내부적으로 함수입니다. 차이는 class는 호이스팅이 되지 않고, 반드시 new로 호출해야 하며, strict 모드가 기본 적용됩니다.
