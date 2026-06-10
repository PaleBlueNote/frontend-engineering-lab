# Section 7: 상태 관리 비교

"어떤 상황에 어떤 상태 관리 도구를 쓰는가?" — 판단 기준을 실측으로 확립한다.

## 상태 분류 기준

| 상태 종류 | 특징 | 권장 도구 |
|-----------|------|-----------|
| UI 상태 | isOpen, isLoading 등 로컬 | `useState` |
| 복잡한 로컬 상태 | 다단계 전환, 여러 필드 | `useReducer` |
| 전역 공유 상태 | 테마, 사용자 정보 | Context 또는 Zustand |
| 서버 상태 | API 데이터, 캐싱, 동기화 | React Query / SWR |
| 폼 상태 | 입력값, 유효성 | React Hook Form |

## 실험 목록

| 실험 | 경로 | 면접 빈출도 |
|------|------|-----------|
| Context API 리렌더링 함정 | `./context-rerender/` | ★★★ |
| Context vs Zustand 리렌더링 비교 | `./context-vs-zustand/` | ★★ |
| useState vs useReducer | `./state-vs-reducer/` | ★★★ |
| React 19 useOptimistic | `./optimistic-update/` | ★★ |

## 공통 측정 도구

- **why-did-you-render** — 불필요한 리렌더링 원인 콘솔 출력
- **렌더링 카운터** — 각 컴포넌트에 `useRef` 카운터 + 화면 표시
- **React DevTools → Profiler** — 렌더링 원인(props, state, context, hooks) 분석

## 이 섹션 완료 후 면접 답변 가능 질문

- "Context API의 단점은 무엇인가요?" → context-rerender
- "Redux 대신 Zustand를 선택하는 기준은?" → context-vs-zustand
- "useState와 useReducer 중 어떤 걸 쓸지 기준이 있나요?" → state-vs-reducer
- "낙관적 업데이트(Optimistic Update)란?" → optimistic-update
