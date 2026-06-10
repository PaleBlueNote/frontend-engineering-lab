# Stacking Context & z-index

> 핵심 질문: "z-index를 9999로 해도 왜 뒤에 있는가?"

## 이론

**Stacking Context**: z-index 비교가 일어나는 독립적인 레이어 공간.
z-index는 **같은 stacking context 내에서만** 비교된다.

**Stacking Context 생성 조건** (주요):
- `position: absolute/relative/fixed/sticky` + `z-index: auto가 아닌 값`
- `opacity < 1`
- `transform`, `filter`, `backdrop-filter` 적용
- `isolation: isolate`
- `display: flex/grid`인 부모의 자식에 `z-index` 적용

**핵심 개념**:
```
부모 z-index: 1
  └─ 자식 z-index: 9999

부모 z-index: 2
  └─ 자식 z-index: 1

자식 9999보다 자식 1이 앞에 있음
이유: 부모(z:2) > 부모(z:1) 이므로
     자식은 부모의 stacking context 안에 갇힘
```

## 구현할 것

### 1단계: z-index가 예상대로 동작하지 않는 예시

```jsx
// 문제 상황
<div style={{ position: 'relative', zIndex: 1 }}> {/* stacking context 1 */}
  <div style={{ position: 'absolute', zIndex: 9999, background: 'red' }}>
    모달 (z:9999)
  </div>
</div>

<div style={{ position: 'relative', zIndex: 2, background: 'blue' }}> {/* stacking context 2 */}
  파란 박스
</div>
// 결과: 파란 박스(z-index:2 부모)가 빨간 모달(z-index:9999)보다 앞에 나타남
```

### 2단계: 해결 방법들

```jsx
// 해결 1: 모달을 최상위 stacking context로 이동 (Portal 사용)
const Modal = ({ children }) => {
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', zIndex: 9999 }}>{children}</div>,
    document.body // body는 최상위 stacking context
  );
};

// 해결 2: isolation: isolate로 명시적 격리
<div style={{ isolation: 'isolate' }}>
  내부 z-index 경쟁 격리
</div>
```

### 3단계: 인터랙티브 stacking context 탐색기

```jsx
// 현재 요소가 stacking context를 생성하는지 확인하는 함수
function createsStackingContext(element) {
  const style = getComputedStyle(element);
  return (
    style.transform !== 'none' ||
    style.opacity !== '1' ||
    style.filter !== 'none' ||
    (style.position !== 'static' && style.zIndex !== 'auto') ||
    style.isolation === 'isolate'
  );
}
```

### 4단계: Chrome DevTools에서 확인
- Elements 탭 → 요소 선택 → Computed 탭 → "Stacking context" 항목 확인
- Layers 탭에서 레이어 트리 확인

## 면접 포인트

**Q: "z-index가 예상대로 동작하지 않는 이유는?"**
A: z-index는 같은 Stacking Context 내에서만 비교됩니다. 부모가 새 Stacking Context를 만들면 자식의 z-index 값이 아무리 커도 부모의 z-index에 종속됩니다.

**Q: "Stacking Context를 생성하는 CSS 속성은?"**
A: `position + z-index`, `opacity < 1`, `transform`, `filter`, `isolation: isolate` 등이 있습니다. 모달/팝업은 body에 직접 렌더링(Portal)하거나 isolation으로 격리해야 합니다.
