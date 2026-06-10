# Context API 리렌더링 함정

> 핵심 질문: "Context value의 일부만 바뀌었는데 왜 모든 소비자가 리렌더링되는가?"

## 이론

**Context 리렌더링 규칙**:
Context value가 변경되면 해당 Context를 소비하는 **모든 컴포넌트가 리렌더링**된다.
React.memo로 감싸도 Context 소비자는 리렌더링을 막을 수 없다.

```jsx
// 이 Context에 { user, theme, language }가 있다면
// user만 바뀌어도 theme, language를 쓰는 컴포넌트도 리렌더링
```

**근본 원인**: Context는 참조 비교로 변경을 감지. 객체/배열은 매 렌더링마다 새 참조.

## 구현할 것

### 1단계: 문제 재현

```jsx
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Alice' });
  const [count, setCount] = useState(0);

  return (
    <AppContext.Provider value={{ user, count, setUser, setCount }}>
      {children}
    </AppContext.Provider>
  );
};

// count만 바뀌어도 user를 쓰는 컴포넌트가 리렌더링됨
const UserDisplay = () => {
  const { user } = useContext(AppContext);
  renderCount.current++; // 렌더링 횟수 추적
  return <div>사용자: {user.name} (렌더: {renderCount.current})</div>;
};

const Counter = () => {
  const { count, setCount } = useContext(AppContext);
  return <button onClick={() => setCount(c => c + 1)}>카운트: {count}</button>;
};
```

→ Counter 클릭 시 UserDisplay도 리렌더링 → 문제

### 2단계: Context 분리로 해결

```jsx
// Context를 용도별로 분리
const UserContext = createContext();
const CounterContext = createContext();

// user 바뀜 → UserContext 소비자만 리렌더링
// count 바뀜 → CounterContext 소비자만 리렌더링
```

### 3단계: value 메모이제이션

```jsx
const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Alice' });
  const [count, setCount] = useState(0);

  // count가 바뀌어도 user Context value는 새 참조 안 만들어짐
  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const counterValue = useMemo(() => ({ count, setCount }), [count]);

  return (
    <UserContext.Provider value={userValue}>
      <CounterContext.Provider value={counterValue}>
        {children}
      </CounterContext.Provider>
    </UserContext.Provider>
  );
};
```

### 4단계: 렌더링 횟수 시각화

| 방식 | Counter 클릭 시 UserDisplay 렌더링 |
|------|----------------------------------|
| 단일 Context | ✅ 리렌더링 발생 |
| Context 분리 | ❌ 리렌더링 없음 |
| value 메모이제이션 | ❌ 리렌더링 없음 |

## 면접 포인트

**Q: "Context API의 단점은 무엇인가요?"**
A: Context value가 변경되면 해당 Context를 소비하는 모든 컴포넌트가 리렌더링됩니다. 전역 상태가 자주 변경되거나 소비자가 많으면 불필요한 리렌더링이 많이 발생합니다. 이 경우 Zustand같은 selector 기반 상태 관리를 사용하는 것이 좋습니다.

**Q: "Context 성능 문제를 어떻게 해결하나요?"**
A: Context를 목적별로 분리하거나 value를 useMemo로 안정화합니다. 또는 Zustand/Jotai처럼 변경된 값을 구독하는 컴포넌트만 리렌더링하는 라이브러리를 사용합니다.
