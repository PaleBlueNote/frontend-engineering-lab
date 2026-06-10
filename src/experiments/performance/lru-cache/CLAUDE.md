# LRU 캐시 구현

> 핵심 질문: "O(1) 시간복잡도로 get/put을 구현하는 자료구조는?"

## 이론

**LRU (Least Recently Used)**: 가장 오래 사용되지 않은 항목부터 캐시에서 제거.

**O(1) 구현 방법**: Map의 두 가지 특성 활용:
1. `Map.get(key)` → O(1)
2. Map은 삽입 순서를 유지

```
Map의 순서: [oldest ← ... → newest]
get(key): key를 삭제 후 재삽입 → 맨 뒤(newest)로 이동
put(key): 용량 초과 시 Map.keys().next().value (oldest) 삭제
```

## 구현할 것

### 1단계: LRU Cache 클래스

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // 최근 사용으로 표시: 삭제 후 재삽입
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key); // 기존 항목 제거
    } else if (this.cache.size >= this.capacity) {
      // 가장 오래된 항목(첫 번째) 제거
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }

  // 현재 상태 시각화용
  getState() {
    return [...this.cache.entries()].map(([k, v]) => ({ key: k, value: v }));
  }
}
```

### 2단계: 인터랙티브 시각화 컴포넌트

```jsx
const LRUVisualizer = () => {
  const [capacity, setCapacity] = useState(4);
  const [cacheState, setCacheState] = useState([]);
  const [log, setLog] = useState([]);
  const cacheRef = useRef(new LRUCache(capacity));

  const handleGet = (key) => {
    const result = cacheRef.current.get(key);
    setCacheState(cacheRef.current.getState());
    setLog(prev => [...prev, `get(${key}) → ${result === -1 ? 'miss' : result}`]);
  };

  const handlePut = (key, value) => {
    cacheRef.current.put(key, value);
    setCacheState(cacheRef.current.getState());
    setLog(prev => [...prev, `put(${key}, ${value})`]);
  };

  return (
    <div>
      {/* 캐시 상태: 왼쪽 = 가장 오래됨, 오른쪽 = 가장 최근 */}
      <div className="flex gap-2">
        {cacheState.map(({ key, value }) => (
          <div key={key} className="border p-2 rounded">
            {key}: {value}
          </div>
        ))}
      </div>
      {/* 작업 로그 */}
      <div className="mt-4 font-mono text-sm">
        {log.map((entry, i) => <div key={i}>{entry}</div>)}
      </div>
    </div>
  );
};
```

### 3단계: 캐시 히트율 측정

```js
function testHitRate(cache, operations) {
  let hits = 0, misses = 0;
  operations.forEach(({ type, key, value }) => {
    if (type === 'get') {
      cache.get(key) !== -1 ? hits++ : misses++;
    } else {
      cache.put(key, value);
    }
  });
  return hits / (hits + misses);
}

// 다양한 capacity에서 히트율 변화 측정
[2, 4, 8, 16, 32].forEach(cap => {
  const cache = new LRUCache(cap);
  const hitRate = testHitRate(cache, workload);
  console.log(`capacity=${cap}: ${(hitRate * 100).toFixed(1)}% hit rate`);
});
```

### 4단계: React Query / SWR 연결 (심화)

```
LRU 캐시 원리 → React Query의 query cache
React Query도 capacity 기반으로 오래된 쿼리 제거
gcTime(이전 cacheTime) 옵션으로 메모리 보관 시간 제어
```

## 면접 포인트

**Q: "LRU 캐시를 O(1)으로 구현하는 방법은?"**
A: JavaScript의 Map은 삽입 순서를 유지하므로, get 시 해당 항목을 삭제 후 재삽입해 "최근 사용"으로 표시합니다. 첫 번째 항목이 항상 가장 오래된 항목이므로 용량 초과 시 삭제합니다.

**Q: "일반적으로 사용하는 캐싱 전략은?"**
A: LRU 외에도 LFU(가장 적게 사용된 것 제거), FIFO(먼저 들어온 것 제거), TTL(시간 기반 만료)이 있습니다. React Query는 TTL + 백그라운드 갱신 방식을 사용합니다.
