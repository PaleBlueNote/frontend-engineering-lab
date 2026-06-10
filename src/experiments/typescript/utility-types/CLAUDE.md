# Utility Types 직접 구현

> 핵심 질문: "Partial<T>가 내부적으로 어떻게 동작하는가?"

## 이론

**Mapped Types**: 기존 타입의 키를 반복하며 새 타입 생성.

```ts
// Mapped Type 기본 문법
type MyMapped<T> = {
  [K in keyof T]: T[K]; // T의 모든 키를 순회
};
```

## 구현할 것

### 1단계: 내장 Utility Types 직접 구현

```ts
// Partial<T>: 모든 프로퍼티를 optional로
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Required<T>: 모든 프로퍼티를 required로 (- modifier로 ? 제거)
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

// Readonly<T>: 모든 프로퍼티를 readonly로
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Pick<T, K>: 특정 키만 선택
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit<T, K>: 특정 키 제외
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

// Record<K, V>: 키-값 타입 생성
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};
```

### 2단계: 실전 활용 예시

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// API 응답: password 제외
type PublicUser = Omit<User, 'password'>;

// 업데이트 요청: id, createdAt 제외, 나머지 optional
type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt'>>;

// 폼 에러: 각 필드에 에러 메시지
type FormErrors = Partial<Record<keyof Omit<User, 'id' | 'createdAt'>, string>>;
```

### 3단계: 커스텀 Utility Types

```ts
// DeepPartial: 중첩 객체까지 모두 optional
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// Nullable: 모든 프로퍼티에 null 허용
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// NonNullableProps: 모든 프로퍼티에서 null/undefined 제거
type NonNullableProps<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

// 함수 파라미터 타입 추출
function createUser(name: string, age: number) {}
type CreateUserParams = Parameters<typeof createUser>; // [string, number]
type FirstParam = CreateUserParams[0]; // string
```

### 4단계: 인터랙티브 타입 탐색기

TypeScript Playground 스타일:
- 타입 정의 코드 표시
- 각 Utility Type 적용 전/후 타입 비교
- hover 시 타입 추론 결과 표시

## 면접 포인트

**Q: "Partial<T>를 직접 구현해보세요"**
A: Mapped Type으로 구현합니다. `[K in keyof T]?`로 모든 키를 optional로 만듭니다.

**Q: "Pick과 Omit의 차이는?"**
A: Pick은 지정한 키만 남깁니다. Omit은 지정한 키를 제거합니다. Omit은 내부적으로 `Pick<T, Exclude<keyof T, K>>`로 구현됩니다.
