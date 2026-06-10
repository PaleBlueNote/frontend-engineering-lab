# Section 8: CSS & 브라우저 동작

"이 스타일이 왜 이렇게 적용되는지"를 명확하게 설명할 수 있어야 한다.

## 핵심 개념 요약

| 개념 | 핵심 | 자주 나오는 버그 |
|------|------|-----------------|
| BFC | 독립된 렌더링 컨테이너 | float 클리어 안 됨, margin collapse |
| Stacking Context | z-index 비교 범위 격리 | z-index 높여도 앞에 안 나옴 |
| Specificity | (inline, ID, class, element) 4자리 점수 | 스타일이 왜 안 먹히나 |
| Flexbox | 1차원 공간 분배 | 자식이 늘어나거나 넘침 |
| Grid | 2차원 레이아웃 설계 | 복잡한 레이아웃에서 Flex보다 직관적 |

## 실험 목록

| 실험 | 경로 | 면접 빈출도 |
|------|------|-----------|
| BFC (Block Formatting Context) | `./bfc/` | ★★ |
| Stacking Context & z-index | `./stacking-context/` | ★★ |
| CSS Specificity 계산기 | `./specificity/` | ★★ |
| Flexbox vs Grid 선택 기준 | `./flexbox-vs-grid/` | ★★★ |

## 이 섹션 완료 후 면접 답변 가능 질문

- "BFC가 무엇이고 어떻게 생성되나요?" → bfc
- "z-index가 예상대로 동작하지 않을 때 원인은?" → stacking-context
- "CSS 우선순위(Specificity)가 결정되는 방법은?" → specificity
- "Flexbox와 Grid의 차이는? 언제 어떤 걸 쓰나요?" → flexbox-vs-grid
