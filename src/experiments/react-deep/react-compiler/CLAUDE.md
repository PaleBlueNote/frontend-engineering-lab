# React 19 Compiler (Auto-Memoization)

> 핵심 질문: "React Compiler를 켜면 useMemo를 직접 쓰지 않아도 되는가?"

## 이론

**React Compiler (이전 명칭: React Forget)**: 빌드 타임에 컴포넌트를 분석해 자동으로 메모이제이션 적용.
- 개발자가 `useMemo`, `useCallback`을 수동으로 추가하지 않아도 됨
- 컴파일러가 "이 값은 이 의존성이 변할 때만 재계산"을 자동 추론

**React Compiler가 생성하는 코드 (개념)**:
```jsx
// 입력 (개발자 코드)
function TodoList({ todos, filter }) {
  const filtered = todos.filter(t => t.type === filter);
  return filtered.map(t => <TodoItem key={t.id} todo={t} />);
}

// 컴파일러 출력 (자동 메모이제이션 추가)
function TodoList({ todos, filter }) {
  const filtered = useMemo(() =>
    todos.filter(t => t.type === filter),
    [todos, filter]
  );
  return filtered.map(t => <TodoItem key={t.id} todo={t} />);
}
```

## 구현할 것

### 1단계: React Compiler 설치 (Vite + React 19)
```bash
npm i babel-plugin-react-compiler
```
```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
});
```

### 2단계: 컴파일러 on/off 비교 실험
```jsx
// 무거운 계산을 포함한 컴포넌트
function HeavyComponent({ items, filter }) {
  // 컴파일러 없음: 매 렌더링마다 재계산
  // 컴파일러 있음: items, filter 변경 시에만 재계산
  const filtered = items.filter(item => item.type === filter);
  const sorted = [...filtered].sort((a, b) => a.value - b.value);
  return <List items={sorted} />;
}
```

렌더링 카운터로 자동 메모이제이션 효과 측정

### 3단계: 컴파일된 코드 확인
```bash
# Babel REPL 또는 빌드 결과에서 확인
npm run build
# dist/ 파일에서 _memo, _cache 패턴 검색
```

### 4단계: 컴파일러가 처리 못하는 경우 (규칙 위반)
```jsx
// 컴파일러는 Rules of Hooks를 기반으로 작동
// 조건부 hook 호출 → 컴파일러 최적화 불가
if (condition) {
  const [state] = useState(0); // 규칙 위반 → 컴파일러 스킵
}
```

## 측정 방법

1. **렌더링 카운터** — Compiler on/off 시 렌더링 횟수 비교
2. **React DevTools Profiler** — Compiler on 시 "Memoized" 표시
3. **빌드 결과물** — `_memo` 패턴으로 자동 메모이제이션 코드 확인

## 면접 포인트

**Q: "React Compiler가 무엇인가요?"**
A: React 19에 도입된 빌드 타임 최적화 도구입니다. 컴포넌트 코드를 분석해 자동으로 메모이제이션을 추가합니다. 개발자가 useMemo, useCallback을 수동으로 추가하지 않아도 됩니다.

**Q: "React Compiler가 있으면 useMemo를 쓸 필요가 없나요?"**
A: 대부분의 경우 그렇습니다. 단, Rules of Hooks를 위반하거나 외부 상태(전역 변수, DOM 접근)에 의존하는 경우 컴파일러가 최적화를 포기합니다. 레거시 코드나 복잡한 패턴에서는 여전히 수동 메모이제이션이 필요할 수 있습니다.
