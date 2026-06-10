# 타입 좁히기 (Type Narrowing)

> 핵심 질문: "typeof, instanceof, 커스텀 타입 가드의 차이는?"

## 이론

**Type Narrowing**: 조건문 안에서 더 구체적인 타입으로 좁히는 것.
TypeScript의 흐름 분석(Flow Analysis)이 자동으로 처리.

```ts
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase(); // ✅ string 타입으로 좁혀짐
  } else {
    value.toFixed(2);   // ✅ number 타입으로 좁혀짐
  }
}
```

## 구현할 것

### 1단계: 5가지 Narrowing 방법

```ts
// 1. typeof
function log(value: string | number | boolean) {
  if (typeof value === 'string') return value.length;
  if (typeof value === 'number') return value.toFixed(2);
  return value ? 'true' : 'false';
}

// 2. instanceof
function formatDate(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString(); // Date 메서드 접근 ✅
  }
  return new Date(value).toISOString();
}

// 3. in 연산자 (프로퍼티 존재 여부)
interface Dog { bark(): void; }
interface Cat { meow(): void; }
function makeSound(animal: Dog | Cat) {
  if ('bark' in animal) {
    animal.bark(); // Dog ✅
  } else {
    animal.meow(); // Cat ✅
  }
}

// 4. Discriminated Union (판별자)
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function area(shape: Shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  }
  return shape.side ** 2;
}

// 5. 커스텀 타입 가드 (Type Predicate)
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processUnknown(value: unknown) {
  if (isString(value)) {
    value.toUpperCase(); // ✅ string으로 좁혀짐
  }
}
```

### 2단계: Assertion Functions (TypeScript 3.7+)

```ts
// value가 string이 아니면 throw
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`);
  }
}

function process(value: unknown) {
  assertIsString(value);
  value.toUpperCase(); // ✅ assert 이후 string으로 좁혀짐
}
```

### 3단계: 인터랙티브 타입 탐색기

각 Narrowing 방법별:
- 타입 에러 발생 케이스 표시
- 각 분기에서 허용/거부되는 메서드 목록
- "왜 에러인가?" 설명 패널

### 4단계: 실전 패턴 - API 응답 처리

```ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: number };

function handleResult<T>(result: ApiResult<T>) {
  if (result.ok) {
    processData(result.data); // ✅ T 타입
  } else {
    logError(result.error, result.code); // ✅ string, number
    // result.data // ❌ ok=false일 때 data 없음
  }
}
```

## 면접 포인트

**Q: "타입 가드(Type Guard)란 무엇인가요?"**
A: 런타임에 타입을 확인하는 표현식으로, TypeScript가 조건 분기 내에서 타입을 좁히도록 안내합니다. `typeof`, `instanceof`, `in` 연산자가 내장 타입 가드이고, `value is Type` 반환 타입을 가진 함수로 커스텀 타입 가드를 만들 수 있습니다.

**Q: "unknown과 any의 차이는?"**
A: `any`는 모든 타입 체크를 끕니다. `unknown`은 사용 전 타입 좁히기가 필요합니다. 외부 데이터(API 응답, JSON.parse 결과)는 `any` 대신 `unknown`으로 받고 타입 가드로 좁히는 것이 안전합니다.
