# Day 5: Image Optimization

> 핵심 질문: "이미지 20개가 있는 페이지에서 LCP를 어떻게 줄이는가?"

## 이론

| 기법 | 원리 | 효과 |
|------|------|------|
| Lazy Loading | 뷰포트 진입 시에만 로드 | 초기 요청 수 감소 |
| WebP 포맷 | PNG 대비 ~26%, JPEG 대비 ~25~34% 작음 | 전송 크기 감소 |
| srcset / sizes | 화면 크기에 맞는 해상도 이미지 선택 | 불필요한 큰 이미지 방지 |
| width/height 명시 | 브라우저가 공간 미리 확보 | CLS(Cumulative Layout Shift) 방지 |

**LCP (Largest Contentful Paint)**: 뷰포트에서 가장 큰 콘텐츠가 렌더링되는 시간. Core Web Vitals 핵심 지표.

## 구현할 것

### 1단계: 비교 기준 (최적화 없음)
```jsx
// 20개 이미지를 모두 즉시 로드
{images.map(src => <img key={src} src={src} alt="" />)}
```

### 2단계: `loading="lazy"` 적용
```jsx
<img src={src} alt="" loading="lazy" width={400} height={300} />
```

### 3단계: IntersectionObserver 직접 구현
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // data-src → src로 교체
      observer.unobserve(img);
    }
  });
}, { rootMargin: '200px' }); // 200px 미리 로드

imgRefs.current.forEach(img => observer.observe(img));
```

### 4단계: 비교 지표

| 지표 | 즉시 로드 | loading=lazy | IO 직접 구현 |
|------|-----------|--------------|-------------|
| 초기 네트워크 요청 수 | 20 | ~5 | ~5 |
| 초기 로드 시간 | ? ms | ? ms | ? ms |
| 스크롤 후 로드 타이밍 | - | 뷰포트 진입 시 | 200px 전 |

## 측정 방법

1. **Network 탭 → Disable cache 체크** — 실제 요청 수, 전송 크기
2. **Network 탭 → 슬로우 3G 스로틀링** — 차이가 더 명확하게 보임
3. **Lighthouse → LCP, FCP** 지표 비교

## 면접 포인트

**Q: "이미지 최적화 방법을 말씀해주세요"**
A: 크게 세 가지입니다. 1) WebP 등 효율적인 포맷 사용, 2) Lazy Loading으로 초기 로딩 요청 수 감소, 3) srcset으로 화면 크기에 맞는 해상도 제공. 추가로 width/height 명시로 CLS를 방지합니다.

**Q: "loading=lazy와 IntersectionObserver의 차이는?"**
A: `loading=lazy`는 브라우저 네이티브 구현으로 더 최적화되어 있고 코드가 없습니다. IntersectionObserver는 로드 타이밍(rootMargin 조절)이나 로드 전 placeholder 표시 등 커스터마이즈가 필요할 때 사용합니다.
