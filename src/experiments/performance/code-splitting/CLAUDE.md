# Code Splitting 시각화

> 핵심 질문: "동적 import가 초기 로딩 시간에 어떤 영향을 주는가?"

## 이론 (Section 3 Day 21과 연계)

Day 21이 Tree Shaking 중심이라면, 여기서는 **Code Splitting의 전략과 실제 측정**에 집중한다.

## 구현할 것

### 1단계: 현재 번들 크기 측정 (baseline)
```bash
npm run build
ls -la dist/assets/*.js # 번들 크기 확인
```

### 2단계: Route-based Splitting

```jsx
// Before: 모든 페이지를 한 번에 번들
import HeavyDashboard from './pages/HeavyDashboard';
import Analytics from './pages/Analytics';

// After: 필요할 때 로드
const HeavyDashboard = lazy(() => import('./pages/HeavyDashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

// 라우터
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/dashboard" element={<HeavyDashboard />} />
    <Route path="/analytics" element={<Analytics />} />
  </Routes>
</Suspense>
```

### 3단계: 무거운 컴포넌트 분리 (Component-based)
```jsx
// 차트 라이브러리처럼 큰 컴포넌트만 분리
const ChartComponent = lazy(() => import('./components/ChartComponent'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  return (
    <div>
      <button onClick={() => setShowChart(true)}>차트 보기</button>
      {showChart && (
        <Suspense fallback={<div>차트 로딩 중...</div>}>
          <ChartComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### 4단계: Prefetch로 사전 로드
```jsx
// 마우스 hover 시 미리 로드
const prefetchDashboard = () => {
  import('./pages/HeavyDashboard'); // 화면에 표시하지 않고 다운로드만
};

<Link
  to="/dashboard"
  onMouseEnter={prefetchDashboard}
>
  대시보드
</Link>
```

### 5단계: 비교 측정

| 측정 항목 | Splitting 전 | Splitting 후 |
|-----------|--------------|--------------|
| 초기 JS 번들 (gzip) | ? KB | ? KB |
| 초기 FCP | ? ms | ? ms |
| /dashboard 첫 방문 추가 로드 | 없음 | ? KB |

### 6단계: Webpack Bundle Analyzer (Vite용)
```bash
npm i -D rollup-plugin-visualizer
```
```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';
export default {
  plugins: [visualizer({ filename: 'dist/stats.html', gzipSize: true, open: true })]
};
```
→ `npm run build` 후 자동으로 분석 페이지 열림

## 면접 포인트

**Q: "React.lazy와 Suspense를 설명해주세요"**
A: React.lazy는 동적 import로 컴포넌트를 로드합니다. Suspense는 lazy 컴포넌트가 로드되는 동안 fallback UI를 표시합니다. 페이지 단위로 분리하면 초기 번들 크기를 크게 줄일 수 있습니다.

**Q: "prefetch와 preload의 차이는?"**
A: preload는 현재 페이지에서 곧 필요한 리소스를 높은 우선순위로 미리 로드합니다. prefetch는 다음 페이지에서 필요할 것 같은 리소스를 낮은 우선순위로 미리 다운로드합니다.
