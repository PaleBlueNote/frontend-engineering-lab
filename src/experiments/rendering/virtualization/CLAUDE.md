# Day 4: Virtualization (Windowing)

> 핵심 질문: "DOM 노드 10,000개와 50개의 성능 차이는 얼마나 나는가?"

## 이론

- **문제**: DOM 노드는 생성 자체가 비쌈. 1만 개를 렌더링하면 초기 로딩 + 스크롤 시 모두 느림
- **해결 원리**: 화면에 보이는 아이템만 DOM에 유지, 나머지는 제거. 스크롤 위치에 따라 동적으로 교체
- **Windowing**: 전체 목록의 높이는 유지하되 (빈 공간으로), 뷰포트에 들어오는 아이템만 렌더링

```
전체 컨테이너 높이: 10,000 × 40px = 400,000px (실제 DOM은 없음)
뷰포트: 스크롤 위치 기준 ±버퍼 범위의 아이템만 DOM에 존재
```

## 구현할 것

### 1단계: 비교 기준 (최적화 없음)
```jsx
// 1만 개 그냥 렌더링
{Array.from({ length: 10000 }).map((_, i) => (
  <div key={i} className="h-10 border-b flex items-center px-4">
    아이템 {i}
  </div>
))}
```

### 2단계: react-window 적용
```bash
npm i react-window
```
```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={500}        // 뷰포트 높이
  itemCount={10000}   // 전체 아이템 수
  itemSize={40}       // 아이템 고정 높이
  width="100%"
>
  {({ index, style }) => (
    <div style={style} className="border-b flex items-center px-4">
      아이템 {index}
    </div>
  )}
</FixedSizeList>
```

### 3단계: 측정 지표 비교

| 지표 | before | after |
|------|--------|-------|
| 초기 렌더링 시간 | ? ms | ? ms |
| DOM 노드 수 | 10,000개 | ~20개 |
| 스크롤 FPS | ? | 60 |
| 메모리 사용량 | ? MB | ? MB |

### 4단계: 직접 구현 (심화)
react-window 없이 `IntersectionObserver` + 스크롤 이벤트로 직접 구현

## 측정 방법

1. **Chrome DevTools → Performance** — 초기 렌더링 타임라인, Scripting 시간
2. **Elements 탭** — DOM 노드 수 확인 (Ctrl+Shift+C → 개수 비교)
3. **stats.js** — 스크롤 중 FPS
4. **Memory 탭** — Heap 크기 비교

## 면접 포인트

**Q: "대량 리스트를 어떻게 최적화하나요?"**
A: 가상화(Windowing)를 사용합니다. react-window 같은 라이브러리를 쓰면 뷰포트에 보이는 아이템만 DOM에 유지하여 초기 렌더링 속도와 스크롤 성능을 크게 개선할 수 있습니다.

**Q: "react-window와 react-virtualized의 차이는?"**
A: react-window는 더 가볍고 API가 단순합니다. react-virtualized는 테이블, 그리드 등 더 복잡한 레이아웃을 지원합니다. 대부분의 경우 react-window로 충분합니다.
