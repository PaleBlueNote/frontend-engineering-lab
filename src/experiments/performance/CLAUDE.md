# Section 6: 성능 최적화 패턴

"어떻게 최적화했나요?"에 코드와 측정 데이터로 답할 수 있도록.

## 핵심 원칙

1. **측정 없는 최적화는 추측** — 항상 before/after 데이터를 수집
2. **최적화는 비용이다** — useMemo도 클로저 생성 + 의존성 비교 비용이 있음
3. **병목 찾기 우선** — 느린 부분을 먼저 찾고 그 부분만 최적화

## 실험 목록

| 실험 | 경로 | 면접 빈출도 |
|------|------|-----------|
| Debounce & Throttle 직접 구현 | `./debounce-throttle/` | ★★★ |
| Virtualization (Windowing) | `./virtualization/` | ★★★ |
| Image Lazy Loading 직접 구현 | `./lazy-loading/` | ★★ |
| Code Splitting 시각화 | `./code-splitting/` | ★★ |
| LRU 캐시 구현 | `./lru-cache/` | ★★ |

## 공통 측정 도구

- **performance.now()** — μs 단위 함수 실행 시간
- **stats.js** — 실시간 FPS 오버레이
- **Chrome DevTools → Network 탭** — 요청 수, 전송 크기
- **Chrome DevTools → Performance 탭** — Long Task, 메인 스레드 블로킹

## 이 섹션 완료 후 면접 답변 가능 질문

- "Debounce와 Throttle을 직접 구현해보세요" → debounce-throttle
- "10만 개 아이템을 리스트로 보여줘야 한다면?" → virtualization
- "이미지 지연 로딩을 어떻게 구현하나요?" → lazy-loading
- "번들 크기를 줄이는 방법은?" → code-splitting
- "캐싱 전략을 설명해주세요" → lru-cache
