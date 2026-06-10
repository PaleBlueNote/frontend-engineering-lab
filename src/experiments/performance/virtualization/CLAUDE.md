# Virtualization 심화 (직접 구현)

> 핵심 질문: "react-window 없이 가상 스크롤을 직접 구현할 수 있는가?"

## 이론 (Section 1 Day 4와 연계)

Day 4에서 react-window 사용법을 배웠다면, 여기서는 **같은 원리를 직접 구현**한다.

## 구현할 것

### 1단계: 핵심 계산 로직

```js
function useVirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  // 화면에 보여야 할 아이템 범위 계산
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  // 버퍼: 스크롤 시 깜빡임 방지
  const bufferCount = 3;
  const renderStart = Math.max(0, startIndex - bufferCount);
  const renderEnd = Math.min(items.length, endIndex + bufferCount);

  const visibleItems = items.slice(renderStart, renderEnd).map((item, i) => ({
    item,
    index: renderStart + i,
    offsetY: (renderStart + i) * itemHeight,
  }));

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
  };
}
```

### 2단계: 렌더링 컴포넌트

```jsx
const VirtualList = ({ items, itemHeight = 50, containerHeight = 500 }) => {
  const { visibleItems, totalHeight, onScroll } = useVirtualList({
    items, itemHeight, containerHeight
  });

  return (
    <div
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
      onScroll={onScroll}
    >
      {/* 전체 높이를 차지하는 빈 공간 */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, offsetY }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offsetY,
              width: '100%',
              height: itemHeight,
            }}
          >
            아이템 {index}: {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3단계: 가변 높이 아이템 (심화)

```js
// 각 아이템 높이가 다를 때 오프셋 미리 계산
function buildOffsets(items, getHeight) {
  const offsets = [0];
  items.forEach((item, i) => {
    offsets.push(offsets[i] + getHeight(item));
  });
  return offsets;
}

// 이진 탐색으로 현재 스크롤 위치의 아이템 찾기 O(log n)
function findIndex(offsets, scrollTop) {
  let lo = 0, hi = offsets.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (offsets[mid] <= scrollTop) lo = mid + 1;
    else hi = mid;
  }
  return lo - 1;
}
```

### 4단계: react-window vs 직접 구현 비교

| 측정 항목 | react-window | 직접 구현 |
|-----------|--------------|-----------|
| 초기 번들 크기 | +6KB (gzip) | 0 |
| DOM 노드 수 | ~20개 | ~20개 |
| 스크롤 FPS | 60 | 60 |
| 가변 높이 지원 | VariableSizeList | 직접 구현 필요 |

## 면접 포인트

**Q: "가상 스크롤의 원리를 설명해주세요"**
A: 전체 리스트 높이만큼의 빈 컨테이너를 만들고, 현재 스크롤 위치를 기준으로 뷰포트에 들어오는 아이템만 절대 위치로 렌더링합니다. 스크롤 시 렌더링 아이템 범위를 업데이트합니다.
