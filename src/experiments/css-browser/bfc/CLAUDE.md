# BFC (Block Formatting Context)

> 핵심 질문: "왜 overflow: hidden이 float된 자식을 포함하는가?"

## 이론

**BFC**: 독립된 렌더링 컨테이너. BFC 내부 요소는 외부 레이아웃에 영향을 주지 않음.

**BFC 생성 조건** (하나라도 해당되면 BFC):
- `overflow`: hidden, auto, scroll (visible 제외)
- `display`: flex, grid, inline-block, table-cell
- `position`: absolute, fixed
- `float`: left, right

**BFC가 해결하는 문제**:

| 문제 | 원인 | BFC 해결 방법 |
|------|------|---------------|
| Float 포함 안 됨 | float 자식은 일반 흐름에서 벗어남 | 부모에 BFC 생성 → float 자식 포함 |
| Margin Collapse | 인접 block의 margin이 겹침 | BFC 경계에서는 collapse 안 일어남 |

## 구현할 것

### 1단계: Float 클리어 문제와 해결

```html
<!-- 문제: float 자식이 부모를 벗어남 -->
<div class="parent">       <!-- 높이 = 0 -->
  <div class="float-child" style="float:left; height:100px">자식</div>
</div>
<!-- 해결법 1: overflow: hidden (BFC 생성) -->
<div class="parent" style="overflow: hidden">

<!-- 해결법 2: display: flow-root (명시적 BFC, 부작용 없음) -->
<div class="parent" style="display: flow-root">

<!-- 해결법 3: clearfix (고전적 방법) -->
<div class="parent clearfix">
<!-- .clearfix::after { content: ''; display: block; clear: both; } -->
```

### 2단계: Margin Collapse 시각화

```jsx
// Margin Collapse 발생: 위아래 block 요소의 margin이 합산이 아닌 겹침
<div style={{ marginBottom: 30 }}>요소 1</div>
<div style={{ marginTop: 20 }}>요소 2</div>
// 실제 간격: 30px (30 + 20 아님)

// BFC로 margin collapse 방지
<div style={{ overflow: 'hidden' }}> {/* BFC */}
  <div style={{ marginBottom: 30 }}>요소 1</div>
</div>
<div style={{ marginTop: 20 }}>요소 2</div>
// 실제 간격: 50px (BFC 경계에서는 collapse 없음)
```

### 3단계: 인터랙티브 데모

- BFC on/off 토글 버튼
- float 자식 포함 여부 시각화 (부모 배경색으로 확인)
- margin collapse 간격 측정 표시

### 4단계: `display: flow-root` vs `overflow: hidden`

```css
/* overflow: hidden: BFC 생성 + 콘텐츠 잘림 부작용 */
.container { overflow: hidden; }

/* display: flow-root: BFC 생성 전용, 부작용 없음 (모던 방법) */
.container { display: flow-root; }
```

## 면접 포인트

**Q: "BFC란 무엇인가요?"**
A: Block Formatting Context는 독립된 레이아웃 컨테이너입니다. BFC 내부 요소는 외부 레이아웃에 영향을 받지 않습니다. Float 자식을 포함하거나 Margin Collapse를 방지할 때 활용됩니다.

**Q: "float 클리어를 하는 방법은?"**
A: 부모에 `overflow: hidden`, `display: flow-root`, 또는 clearfix 패턴을 적용합니다. 모던 레이아웃(Flexbox, Grid)을 쓰면 float 자체가 불필요합니다.
