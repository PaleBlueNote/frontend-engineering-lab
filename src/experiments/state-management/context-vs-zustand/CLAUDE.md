# Context vs Zustand 리렌더링 비교

> 핵심 질문: "같은 전역 상태를 Context와 Zustand로 구현하면 렌더링이 얼마나 다른가?"

## 이론

**Zustand의 핵심**: selector로 구독 → 선택한 값이 변경될 때만 리렌더링.

```js
// Context: count가 바뀌면 user를 쓰는 컴포넌트도 리렌더링
const { user } = useContext(AppContext); // 전체 value 구독

// Zustand: user가 바뀔 때만 리렌더링
const user = useStore(state => state.user); // user만 구독
```

## 구현할 것

### 1단계: Zustand 설치
```bash
npm i zustand
```

### 2단계: 동일한 상태를 두 방식으로 구현

**Context 방식**:
```jsx
const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Alice', score: 0 });
  const [notifications, setNotifications] = useState([]);
  return (
    <AppContext.Provider value={{ user, setUser, notifications, setNotifications }}>
      {children}
    </AppContext.Provider>
  );
};
```

**Zustand 방식**:
```js
import { create } from 'zustand';
const useAppStore = create((set) => ({
  user: { name: 'Alice', score: 0 },
  notifications: [],
  setUser: (user) => set({ user }),
  addNotification: (n) => set(state => ({
    notifications: [...state.notifications, n]
  })),
}));
```

### 3단계: 컴포넌트별 리렌더링 비교

```jsx
// 알림 카운트만 보여주는 컴포넌트
// Context: user가 바뀌어도 리렌더링
const NotifBadge_Context = () => {
  const { notifications } = useContext(AppContext);
  renderCount.current++;
  return <span>{notifications.length} (렌더: {renderCount.current})</span>;
};

// Zustand: notifications이 바뀔 때만 리렌더링
const NotifBadge_Zustand = () => {
  const count = useAppStore(state => state.notifications.length); // selector
  renderCount.current++;
  return <span>{count} (렌더: {renderCount.current})</span>;
};
```

### 4단계: 리렌더링 횟수 대시보드

| 액션 | Context NotifBadge | Zustand NotifBadge |
|------|--------------------|--------------------|
| user 이름 변경 | ✅ 리렌더링 | ❌ 리렌더링 없음 |
| user 점수 변경 | ✅ 리렌더링 | ❌ 리렌더링 없음 |
| 알림 추가 | ✅ 리렌더링 | ✅ 리렌더링 |

### 5단계: Zustand devtools 연동 (심화)
```js
import { devtools } from 'zustand/middleware';
const useStore = create(devtools((set) => ({ /* ... */ })));
// Redux DevTools에서 상태 변경 추적 가능
```

## 면접 포인트

**Q: "Zustand를 선택하는 기준은 무엇인가요?"**
A: Context는 자주 변경되는 전역 상태에 적합하지 않습니다. Zustand는 selector 기반으로 변경된 값을 구독하는 컴포넌트만 리렌더링해 성능이 더 좋습니다. 또한 보일러플레이트가 없고, Redux DevTools와 연동 가능합니다.

**Q: "Redux 대신 Zustand를 쓰는 이유는?"**
A: Redux는 action, reducer, store 설정 등 보일러플레이트가 많습니다. Zustand는 create 함수 하나로 스토어를 정의하고 hooks로 바로 사용합니다. 코드량이 크게 줄고 TypeScript 지원도 좋습니다.
