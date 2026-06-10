# Day 1-2: Reflow vs Repaint

> 핵심 질문: "animate 속성 하나가 왜 FPS를 50 → 60으로 올리는가?"

## 이론

| 속성 변경 | 발생하는 단계 | 비용 |
|-----------|---------------|------|
| left, top, width, height | Layout → Paint → Composite | 가장 비쌈 |
| color, background, box-shadow | Paint → Composite | 중간 |
| transform, opacity | Composite only (GPU) | 가장 저렴 |

**GPU 레이어 승격 원리**: `transform: translate3d(0,0,0)` 또는 `will-change: transform` 을 선언하면 브라우저가 해당 요소를 별도 GPU 텍스처로 분리 → 이후 변경은 GPU에서만 처리 → 메인 스레드 차단 없음

## 이미 구현된 것 (index.jsx)

- 1000개 원이 `left` 이동(Reflow) vs `transform`(Composite) FPS 비교
- stats.js FPS 패널 오버레이
- 최적화/비최적화 모드 토글

## 추가 실험 아이디어

1. **`box-shadow` vs `filter: drop-shadow`** — 어느 쪽이 Repaint를 더 자주 일으키는가?
2. **`opacity: 0` vs `visibility: hidden` vs `display: none`** — 렌더링 비용 차이
3. **`will-change` 남용 비용** — 1000개 모두에 `will-change: transform` 걸면 VRAM 사용량은?
4. **강제 Reflow(Layout Thrashing)** — `element.offsetWidth` 읽기 → 쓰기 반복이 FPS에 미치는 영향

## 측정 방법

1. **stats.js FPS 패널** (이미 구현됨)
2. **Chrome DevTools → Performance 탭** → Record → 렌더링 → Layout/Paint 블록 시간 확인
3. **Chrome DevTools → Rendering 탭** → "Paint flashing" 체크 → 초록 깜빡임 영역 = Repaint 발생
4. **Chrome DevTools → Layers 탭** → GPU 레이어 승격 여부 시각화

## 면접 포인트

**Q: "transform이 왜 성능이 좋은가요?"**
A: Composite-only 속성이라 GPU에서만 처리됩니다. Layout과 Paint 단계를 건너뛰어 메인 스레드를 차단하지 않습니다.

**Q: "will-change는 항상 좋은가요?"**
A: 아닙니다. 레이어 승격 시 GPU 메모리(VRAM)를 추가 사용합니다. 남용하면 오히려 메모리 부족으로 성능 저하가 발생합니다.

**Q: "Reflow가 비싼 이유는?"**
A: 레이아웃 트리 전체를 재계산해야 하고, 변경된 요소의 하위 요소까지 영향을 받기 때문입니다.
