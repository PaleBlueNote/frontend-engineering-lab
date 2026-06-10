# Section 3: Architecture & Network

네트워크, 보안, 번들링 — 브라우저 밖에서 일어나는 일들을 이해한다.

## 핵심 질문들

- "Cache-Control: max-age=3600 이면 브라우저는 어떤 요청을 보내는가?"
- "마이크로태스크와 매크로태스크의 실행 순서는?"
- "CORS preflight가 언제 발생하고 어떻게 해결하는가?"
- "HTTP/2의 multiplexing이 HTTP/1.1의 무엇을 해결하는가?"
- "Tree Shaking이 번들에서 코드를 제거하는 원리는?"

## 실험 목록

| Day | 실험 | 경로 | 상태 |
|-----|------|------|------|
| Day 15 | HTTP Caching | `./http-caching/` | ⏳ |
| Day 16 | Event Loop | `./event-loop/` | ⏳ |
| Day 17-18 | Security (CORS & XSS) | `./security/` | ⏳ |
| Day 20 | Network Protocols | `./network-protocol/` | ⏳ |
| Day 21 | Bundling | `./bundling/` | ⏳ |

## 공통 측정 도구

- **Chrome DevTools → Network 탭** — 요청 헤더, 응답 헤더, 캐시 상태(from disk cache / from memory cache)
- **Chrome DevTools → Application 탭** — Cache Storage, Service Worker
- **rollup-plugin-visualizer** — 번들 구성 시각화 (`npm i -D rollup-plugin-visualizer`)

## 이 섹션 완료 후 면접 답변 가능 질문

- "브라우저 캐싱 전략에 대해 설명해주세요" → Day 15
- "이벤트 루프를 설명해주세요" → Day 16
- "CORS가 무엇인지, 왜 필요한지 설명해주세요" → Day 17-18
- "XSS 공격을 어떻게 방어하나요?" → Day 17-18
- "코드 스플리팅은 어떻게 구현하나요?" → Day 21
