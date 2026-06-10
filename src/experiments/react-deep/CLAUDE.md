# Section 4: React 렌더링 심화

React가 어떻게 렌더링을 결정하고 최적화하는지 내부 동작을 실측한다.

## 핵심 개념

- **Reconciliation** — Virtual DOM diffing으로 최소 DOM 업데이트 결정. key가 없으면 O(n³) → key 있으면 O(n)
- **Fiber** — 렌더링을 중단/재개 가능한 작업 단위. 각 컴포넌트가 하나의 Fiber 노드
- **Concurrent Mode** — 우선순위 기반 렌더링. 긴급 업데이트(사용자 입력)가 지연 업데이트(목록 렌더링)보다 먼저

## 실험 목록

| 실험 | 경로 | 면접 빈출도 |
|------|------|-----------|
| Reconciliation & Virtual DOM | `./reconciliation/` | ★★★ |
| React.memo / useMemo / useCallback 비용 | `./memoization-cost/` | ★★★ |
| useTransition & useDeferredValue | `./concurrent-mode/` | ★★ |
| useEffect vs useLayoutEffect 타이밍 | `./effect-timing/` | ★★★ |
| React 19 Compiler auto-memo | `./react-compiler/` | ★★ |

## 공통 측정 도구

- **React DevTools → Profiler 탭** — 컴포넌트별 렌더링 시간, 리렌더링 이유
- **why-did-you-render** — 불필요한 리렌더링 원인 콘솔 출력
  ```bash
  npm i @welldone-software/why-did-you-render
  ```
- **렌더링 카운터 패턴** — `useRef`로 카운터, 화면에 표시

## 이 섹션 완료 후 면접 답변 가능 질문

- "React의 렌더링 과정을 설명해주세요 (Virtual DOM, Reconciliation)" → reconciliation
- "useMemo와 useCallback의 차이는? 항상 써야 하나요?" → memoization-cost
- "React Concurrent Mode란 무엇인가요?" → concurrent-mode
- "useEffect와 useLayoutEffect의 차이는?" → effect-timing
- "리렌더링을 최적화하는 방법을 말씀해주세요" → 모든 실험
