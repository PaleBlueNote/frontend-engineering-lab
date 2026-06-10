# Image Lazy Loading 직접 구현

> 핵심 질문: "IntersectionObserver API로 Lazy Loading을 직접 구현하면 어떻게 되는가?"

## 이론 (Section 1 Day 5와 연계)

Day 5에서 개념을 배웠다면, 여기서는 **React 커스텀 훅으로 재사용 가능하게 구현**한다.

## 구현할 것

### 1단계: useLazyImage 커스텀 훅

```js
function useLazyImage(src, options = {}) {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el); // 한 번만 실행
        }
      },
      {
        rootMargin: options.rootMargin ?? '200px', // 200px 전부터 로드
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isLoaded, setIsLoaded, shouldLoad: isInView };
}
```

### 2단계: LazyImage 컴포넌트

```jsx
function LazyImage({ src, alt, width, height, className }) {
  const { ref, isLoaded, setIsLoaded, shouldLoad } = useLazyImage(src);

  return (
    <div
      ref={ref}
      style={{ width, height, backgroundColor: '#f0f0f0' }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {/* 실제 이미지 (뷰포트 근처일 때만 로드) */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
```

### 3단계: 측정 대시보드

```jsx
// 페이지 로드 시 총 이미지 요청 수 추적
const [stats, setStats] = useState({
  totalImages: 20,
  loadedImages: 0,
  savedRequests: 0,
});

// 각 이미지 로드 완료 시 카운터 업데이트
```

### 4단계: blur-up 효과 (심화)

```jsx
// 초저화질 썸네일 → 원본 이미지 로드 후 전환
function BlurUpImage({ src, thumbnailSrc, ...props }) {
  const { ref, shouldLoad, isLoaded, setIsLoaded } = useLazyImage(src);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* 저화질 즉시 로드 */}
      <img src={thumbnailSrc} style={{ filter: isLoaded ? 'none' : 'blur(20px)', transition: 'filter 0.3s' }} />
      {/* 고화질 지연 로드 */}
      {shouldLoad && (
        <img
          src={src}
          onLoad={() => setIsLoaded(true)}
          style={{ position: 'absolute', inset: 0, opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      )}
    </div>
  );
}
```

## 면접 포인트

**Q: "IntersectionObserver란 무엇인가요?"**
A: 요소가 뷰포트(또는 지정 컨테이너)와 교차하는지 비동기로 감지하는 API입니다. 스크롤 이벤트 없이 효율적으로 요소 가시성을 감지할 수 있어 Lazy Loading, 무한 스크롤, 애니메이션 트리거에 사용됩니다.
