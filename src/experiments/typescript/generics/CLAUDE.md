# TypeScript Generics 제약 조건

> 핵심 질문: "T extends 없이 제네릭을 쓰면 어떤 문제가 생기는가?"

## 이론

**제네릭**: 타입을 파라미터로 받아 재사용 가능한 타입/함수를 만드는 것.

```ts
// 제네릭 없음: any → 타입 안전성 없음
function first(arr: any[]): any { return arr[0]; }

// 제네릭 있음: 입력 타입 유지
function first<T>(arr: T[]): T { return arr[0]; }
const n = first([1, 2, 3]);    // n: number ✅
const s = first(['a', 'b']);   // s: string ✅
```

**제약 조건 (extends)**:
```ts
// 제약 없음: T가 어떤 타입인지 모름 → .length 접근 불가
function len<T>(arg: T): number {
  return arg.length; // ❌ T에 length가 있는지 모름
}

// 제약 있음: T가 length를 가짐을 보장
function len<T extends { length: number }>(arg: T): number {
  return arg.length; // ✅
}
len('hello'); // string.length = 5 ✅
len([1, 2, 3]); // array.length = 3 ✅
len(42); // ❌ number에 length 없음 → 컴파일 에러
```

## 구현할 것

### 1단계: 기본 제네릭 패턴

```ts
// API 응답 래퍼
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(): Promise<ApiResponse<User>> { /* ... */ }
async function fetchList(): Promise<ApiResponse<Post[]>> { /* ... */ }

// 컴포넌트 props
interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onRowClick: (row: T) => void;
}
```

### 2단계: keyof + 제네릭 조합

```ts
// 안전한 객체 키 접근
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30 };
getProperty(user, 'name');  // string ✅
getProperty(user, 'age');   // number ✅
getProperty(user, 'email'); // ❌ 컴파일 에러 (키 존재 안 함)
```

### 3단계: 조건부 타입과 제네릭

```ts
// 배열이면 원소 타입 추출, 아니면 그대로
type Unwrap<T> = T extends (infer U)[] ? U : T;

type A = Unwrap<string[]>;  // string
type B = Unwrap<number>;    // number
type C = Unwrap<User[]>;    // User
```

### 4단계: 실전 예시 - 폼 상태 타입

```ts
// 어떤 타입의 폼이든 동작하는 useForm 훅
function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  return { values, errors, setValue };
}

// 사용 시 자동 타입 추론
const form = useForm({ name: '', age: 0, email: '' });
form.setValue('name', 'Alice');  // ✅ string
form.setValue('age', 30);        // ✅ number
form.setValue('age', 'thirty'); // ❌ string 넣으면 컴파일 에러
```

## 면접 포인트

**Q: "Generics를 왜 쓰나요?"**
A: 타입 안전성을 유지하면서 재사용 가능한 코드를 작성할 수 있습니다. `any` 대신 제네릭을 쓰면 컴파일 타임에 타입 에러를 잡을 수 있고, IDE 자동완성도 동작합니다.

**Q: "T extends의 역할은?"**
A: 제네릭 타입 T가 특정 타입 구조를 가지도록 제약합니다. 제약이 없으면 T에 어떤 속성도 없다고 가정해야 하므로 아무것도 접근할 수 없습니다.
