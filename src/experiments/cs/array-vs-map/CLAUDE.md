# Day 8: Array vs Map/Set

> 핵심 질문: "탐색이 O(1)과 O(n)이 실제로 얼마나 차이 나는가?"

## 이론

| 자료구조 | 탐색 | 삽입 | 삭제 | 내부 구조 |
|----------|------|------|------|-----------|
| Array | O(n) | O(1) 끝에 추가 | O(n) | 연속 메모리 |
| Map | O(1) 평균 | O(1) 평균 | O(1) 평균 | 해시 테이블 |
| Set | O(1) 평균 | O(1) 평균 | O(1) 평균 | 해시 테이블 |
| Object | O(1) 평균 | O(1) | O(1) | 해시 테이블 |

**해시 테이블 원리**: key를 해시 함수로 버킷 인덱스로 변환 → 바로 접근. 충돌 발생 시 O(n)으로 저하될 수 있지만 평균은 O(1).

**Map vs Object 차이**:
- Map: 모든 타입을 key로 사용, 삽입 순서 보장, `size` 속성
- Object: string/symbol만 key, 프로토타입 체인 존재

## 구현할 것

### 1단계: 벤치마크 설정
```js
// 데이터 생성
const N = 100_000;
const arr = Array.from({ length: N }, (_, i) => ({ id: i, name: `user_${i}` }));
const map = new Map(arr.map(item => [item.id, item]));
const obj = Object.fromEntries(arr.map(item => [item.id, item]));

// 탐색 대상 (랜덤)
const targets = Array.from({ length: 1000 }, () => Math.floor(Math.random() * N));
```

### 2단계: 탐색 성능 측정
```js
// Array.find - O(n)
const arraySearch = () => {
  const start = performance.now();
  targets.forEach(id => arr.find(item => item.id === id));
  return performance.now() - start;
};

// Map.get - O(1)
const mapSearch = () => {
  const start = performance.now();
  targets.forEach(id => map.get(id));
  return performance.now() - start;
};
```

### 3단계: 데이터 크기별 비교 차트
- X축: N (100 / 1,000 / 10,000 / 100,000 / 1,000,000)
- Y축: 검색 시간(ms)
- 선 2개: Array vs Map → O(n) vs O(1) 시각화

### 4단계: 중복 제거 비교
```js
// Array filter - O(n²)
const dedupeArray = arr => arr.filter((v, i, self) => self.indexOf(v) === i);

// Set - O(n)
const dedupeSet = arr => [...new Set(arr)];
```

## 측정 방법

1. `performance.now()` 으로 각 연산 시간 측정
2. 여러 번 반복 후 평균값 사용 (JIT 최적화 워밍업 포함)
3. 결과를 막대 차트로 시각화

## 면접 포인트

**Q: "배열 대신 Map을 써야 하는 상황은?"**
A: 키로 빠르게 탐색해야 할 때입니다. 예를 들어 유저 ID로 유저 데이터를 찾거나, 중복 여부를 확인할 때 Map/Set이 Array보다 훨씬 빠릅니다.

**Q: "Map과 Object의 차이는?"**
A: Map은 모든 타입을 키로 사용할 수 있고, 삽입 순서를 보장하며, `size`로 크기를 바로 알 수 있습니다. Object는 string/symbol만 키로 가능하고 프로토타입 오염 위험이 있어 순수 데이터 저장에는 Map이 더 안전합니다.
