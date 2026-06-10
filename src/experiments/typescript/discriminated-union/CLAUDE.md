# Discriminated Union (판별 유니온)

> 핵심 질문: "불가능한 상태를 타입으로 표현 불가능하게 만드는 방법은?"

## 이론

**Discriminated Union**: 공통 리터럴 타입 필드(판별자)로 유니온 타입을 구분.

```ts
// 나쁜 방법: 가능한 모든 경우를 optional로
interface State {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: User;       // 언제 있어야 하는지 불명확
  error?: string;    // 언제 있어야 하는지 불명확
}
// 불가능한 상태 표현 가능: { status: 'idle', data: user } ← 모순

// 좋은 방법: Discriminated Union
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }  // success일 때만 data 존재
  | { status: 'error'; error: string }; // error일 때만 error 존재
// 불가능한 상태 자체를 타입으로 표현 불가능
```

## 구현할 것

### 1단계: 비동기 상태 머신

```ts
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; updatedAt: Date }
  | { status: 'error'; error: Error; retryCount: number };

function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' });

  // 타입 좁히기 (narrowing)
  if (state.status === 'success') {
    state.data; // ✅ T 타입으로 접근 가능
  }
  if (state.status === 'error') {
    state.error.message; // ✅ Error 타입
    state.retryCount;    // ✅ number
    state.data;          // ❌ 컴파일 에러 — error 상태에 data 없음
  }
}
```

### 2단계: UI 컴포넌트에서 활용

```tsx
function DataView<T>({ state, renderData }: { 
  state: FetchState<T>;
  renderData: (data: T) => React.ReactNode;
}) {
  switch (state.status) {
    case 'idle':
      return <button>데이터 불러오기</button>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <>{renderData(state.data)}</>; // 타입 안전하게 data 접근
    case 'error':
      return <ErrorView message={state.error.message} retry={() => {}} />;
  }
  // TypeScript: switch가 모든 case를 처리하지 않으면 경고
}
```

### 3단계: Exhaustive Check (모든 케이스 처리 강제)

```ts
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

function handleState(state: FetchState<User>) {
  switch (state.status) {
    case 'idle': return 'idle';
    case 'loading': return 'loading';
    case 'success': return state.data.name;
    case 'error': return state.error.message;
    default:
      return assertNever(state); // FetchState에 새 status 추가 시 컴파일 에러 → 처리 누락 방지
  }
}
```

### 4단계: 인터랙티브 데모

- 각 상태 버튼 클릭 → 해당 상태로 전환
- TypeScript 컴파일러가 각 상태에서 어떤 필드 접근을 허용/거부하는지 표시

## 면접 포인트

**Q: "Discriminated Union이란 무엇인가요?"**
A: 공통 리터럴 타입 필드(판별자)를 가진 유니온 타입입니다. TypeScript가 판별자 값으로 타입을 좁혀 각 케이스에서 해당 타입의 속성에만 접근할 수 있도록 합니다. "불가능한 상태를 타입으로 표현 불가능하게" 만들 수 있습니다.
