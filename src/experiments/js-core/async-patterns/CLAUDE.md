# 비동기 패턴 비교

> 핵심 질문: "async/await를 쓰면 Promise를 이해하지 않아도 되는가?"

## 이론

**비동기 패턴 진화**:
```
Callback → Promise → async/await
    (가독성 향상, 하지만 모두 이벤트 루프 기반)
```

**async/await는 Promise의 문법적 설탕**:
```js
async function getData() {
  const result = await fetch(url);
  return result.json();
}

// 완전히 동일한 코드
function getData() {
  return fetch(url).then(result => result.json());
}
```

## 구현할 것

### 1단계: 세 가지 방식으로 동일한 API 호출
```js
// 방식 1: Callback (구식)
function getUser(id, onSuccess, onError) {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(onSuccess)
    .catch(onError);
}
getUser(1, 
  (user) => console.log(user), 
  (err) => console.error(err)
); // Callback Hell 발생 가능

// 방식 2: Promise 체이닝
fetch(`/api/users/1`)
  .then(r => r.json())
  .then(user => fetch(`/api/posts?userId=${user.id}`))
  .then(r => r.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));

// 방식 3: async/await
async function getUserPosts(userId) {
  try {
    const userRes = await fetch(`/api/users/${userId}`);
    const user = await userRes.json();
    const postsRes = await fetch(`/api/posts?userId=${user.id}`);
    return postsRes.json();
  } catch (err) {
    console.error(err);
  }
}
```

### 2단계: 병렬 실행 vs 순차 실행
```js
// 순차 실행 (느림 - 합산 시간)
const user = await fetchUser(1);    // 500ms 대기
const posts = await fetchPosts(1);  // 500ms 대기
// 총 1000ms

// 병렬 실행 (빠름 - 최대 시간)
const [user, posts] = await Promise.all([
  fetchUser(1),   // 동시 시작
  fetchPosts(1),  // 동시 시작
]);
// 총 500ms

// Promise.allSettled: 하나 실패해도 나머지 결과 반환
const results = await Promise.allSettled([
  fetchUser(1),
  fetchPosts(1),
]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  else handleError(r.reason);
});
```

### 3단계: 에러 핸들링 비교
```js
// async/await: try/catch
async function safe() {
  try {
    const data = await riskyOperation();
    return data;
  } catch (err) {
    return defaultValue; // 실패 시 기본값
  }
}

// 유틸리티 패턴 (Go 스타일)
async function safeAsync(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err, null];
  }
}
const [err, user] = await safeAsync(fetchUser(1));
if (err) { /* 에러 처리 */ }
```

### 4단계: 취소 패턴 (AbortController)
```js
const controller = new AbortController();

// 요청 시작
const fetchWithAbort = fetch(url, { signal: controller.signal });

// 3초 후 취소
setTimeout(() => controller.abort(), 3000);

try {
  const data = await fetchWithAbort;
} catch (err) {
  if (err.name === 'AbortError') console.log('요청 취소됨');
}
```

## 시각화

- 타임라인: 순차 vs 병렬 실행 시간 비교 막대 차트
- 에러 케이스: 각 방식별 에러 처리 흐름 표시

## 면접 포인트

**Q: "async/await와 Promise의 차이는?"**
A: async/await는 Promise를 더 읽기 쉽게 쓰는 문법적 설탕입니다. 내부적으로는 동일한 Promise를 사용하며 이벤트 루프에서 마이크로태스크로 처리됩니다.

**Q: "Promise.all과 Promise.allSettled의 차이는?"**
A: Promise.all은 하나라도 실패하면 전체가 reject됩니다. Promise.allSettled는 모든 Promise가 완료(성공 or 실패)될 때까지 기다리고 각각의 결과를 반환합니다.

**Q: "async 함수는 항상 Promise를 반환하나요?"**
A: 네. async 함수는 항상 Promise를 반환합니다. `return 1`을 하면 `Promise.resolve(1)`과 동일합니다.
