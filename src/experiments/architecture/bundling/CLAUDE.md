# Day 21: Bundling (Tree Shaking & Code Splitting)

> 핵심 질문: "import한 라이브러리가 번들에 얼마나 영향을 주는가?"

## 이론

**Tree Shaking**: 사용하지 않는 export를 번들에서 제거. ES Module(`import/export`) 정적 분석으로 가능.
CommonJS(`require`)는 런타임에 결정 → Tree Shaking 불가.

**Code Splitting**: 번들을 여러 청크로 분리 → 필요한 청크만 로드 → 초기 번들 크기 감소.

| 방식 | 특징 |
|------|------|
| Route-based splitting | 페이지별로 청크 분리. `React.lazy + Suspense` |
| Component-based splitting | 특정 컴포넌트를 동적으로 로드 |
| Vendor splitting | 라이브러리를 별도 청크 (변경 없으면 캐시 유지) |

## 구현할 것

### 1단계: rollup-plugin-visualizer 설치
```bash
npm i -D rollup-plugin-visualizer
```
```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';
export default {
  plugins: [visualizer({ open: true, gzipSize: true })]
};
```
→ `npm run build` 후 브라우저에서 번들 시각화 자동 오픈

### 2단계: Tree Shaking 실험
```js
// utils.js - named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b; // 사용 안 함

// App.jsx
import { add } from './utils'; // multiply는 번들에서 제외됨 (Tree Shaking)
```

번들 분석: `multiply`가 번들에 포함됐는지 확인.

### 3단계: Route-based Code Splitting
```jsx
import { lazy, Suspense } from 'react';
const HeavyPage = lazy(() => import('./pages/HeavyPage'));

// 라우터에서
<Suspense fallback={<div>로딩 중...</div>}>
  <Route path="/heavy" element={<HeavyPage />} />
</Suspense>
```

### 4단계: 비교 지표

| 측정 항목 | 분리 전 | 분리 후 |
|-----------|---------|---------|
| 초기 번들 크기 (gzip) | ? KB | ? KB |
| 초기 로딩 시간 | ? ms | ? ms |
| /heavy 페이지 첫 방문 | - | 추가 청크 로드 |

## 측정 방법

1. `npm run build` → `dist/` 폴더 파일 크기 확인
2. visualizer 결과 — 어떤 라이브러리가 번들의 몇 %인지 확인
3. Network 탭 → 페이지 전환 시 청크 파일 로드 확인

## 면접 포인트

**Q: "번들 크기를 어떻게 줄이나요?"**
A: Tree Shaking으로 사용하지 않는 코드를 제거하고, Code Splitting으로 초기 로딩에 필요한 코드만 로드합니다. 또한 rollup-plugin-visualizer로 어떤 라이브러리가 번들을 차지하는지 분석해 대안을 찾습니다.

**Q: "Tree Shaking이 동작하지 않는 경우는?"**
A: CommonJS(`require`)를 사용하는 라이브러리는 Tree Shaking이 되지 않습니다. ES Module을 지원하는 라이브러리를 선택하거나, `lodash-es`처럼 ESM 버전을 사용해야 합니다.
