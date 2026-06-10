# Section 1: Rendering & UX

브라우저 렌더링 파이프라인을 직접 측정하며 "왜 버벅이는가?"를 데이터로 설명하는 능력을 기른다.

## 브라우저 렌더링 파이프라인 5단계

```
Parse HTML/CSS → Style → Layout(Reflow) → Paint(Repaint) → Composite
```

| 단계 | 트리거 | 비용 |
|------|--------|------|
| Layout(Reflow) | width, height, top, left 변경 | 가장 비쌈 |
| Paint(Repaint) | color, background, box-shadow 변경 | 중간 |
| Composite | transform, opacity 변경 | 가장 저렴 (GPU) |

## 실험 목록

| Day | 실험 | 경로 | 상태 |
|-----|------|------|------|
| Day 1-2 | Reflow vs Repaint | `./reflow-repaint/` | ✅ |
| Day 3 | Frame Control | `./frame-control/` | 🔄 |
| Day 4 | Virtualization | `./virtualization/` | ⏳ |
| Day 5 | Image Optimization | `./image-optimization/` | ⏳ |
| Day 6 | Event Control | `./event-control/` | ⏳ |

## 공통 측정 도구

- **stats.js** — 실시간 FPS/ms 패널 (모든 실험에 기본 장착)
- **Chrome DevTools → Performance 탭** — 렌더링 타임라인, Layout/Paint 비용
- **Chrome DevTools → Layers 탭** — GPU 컴포지트 레이어 확인
- **Chrome DevTools → Rendering 탭** — Paint flashing(초록 깜빡임), Layout shift regions

## 이 섹션 완료 후 면접 답변 가능 질문

- "Reflow와 Repaint의 차이를 설명하세요" → Day 1-2
- "GPU 가속이란 무엇인가요?" → Day 1-2
- "requestAnimationFrame을 왜 사용하나요?" → Day 3
- "리스트 1만 개를 어떻게 렌더링하겠어요?" → Day 4
- "이미지 최적화 방법을 말씀해주세요" → Day 5
- "Debounce와 Throttle의 차이는? 언제 쓰나요?" → Day 6
