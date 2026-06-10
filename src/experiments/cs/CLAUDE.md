# Section 2: CS & JavaScript Core

JavaScript 엔진이 메모리와 실행 컨텍스트를 어떻게 관리하는지, CS 원리를 통해 이해한다.

## 핵심 관점

- **Map은 왜 Array보다 탐색이 빠른가?** → 해시 테이블(O(1)) vs 선형 탐색(O(n))
- **클로저가 메모리 누수를 일으키는 이유** → GC의 참조 그래프: 참조가 살아있으면 수거 안 됨
- **immutable 업데이트가 React와 연결되는 이유** → 참조 동등성(===)으로 변경 감지
- **Web Worker가 필요한 상황** → 메인 스레드 블로킹 → UI 프리즈
- **useMemo의 실제 비용** → 클로저 생성 + 의존성 배열 비교 비용 vs 재계산 비용

## 실험 목록

| Day | 실험 | 경로 | 상태 |
|-----|------|------|------|
| Day 8 | Array vs Map/Set | `./array-vs-map/` | ⏳ |
| Day 9 | Memory Leak | `./memory-leak/` | ⏳ |
| Day 10 | Immutability | `./immutability/` | ⏳ |
| Day 11 | Web Workers | `./web-worker/` | ⏳ |
| Day 14 | Memoization | `./memoization/` | ⏳ |

## 공통 측정 도구

- **Chrome DevTools → Memory 탭** — Heap Snapshot으로 객체 잔존 여부 확인
- **performance.now()** — μs 단위 실행 시간 측정
- **Chrome DevTools → Performance 탭** — 메인 스레드 블로킹(Long Task) 측정

## 이 섹션 완료 후 면접 답변 가능 질문

- "배열 대신 Map을 써야 하는 상황은?" → Day 8
- "클로저란 무엇인가요? 메모리 누수와 어떤 관계인가요?" → Day 9
- "React에서 불변성을 유지해야 하는 이유?" → Day 10
- "Web Worker는 언제 사용하나요?" → Day 11
- "useMemo와 useCallback은 항상 쓰는 게 좋은가요?" → Day 14
