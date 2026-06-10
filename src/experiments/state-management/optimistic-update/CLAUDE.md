# 낙관적 업데이트 (Optimistic Update)

> 핵심 질문: "좋아요 버튼을 누르면 서버 응답 전에 UI를 업데이트하려면?"

## 이론

**낙관적 업데이트**: 서버 응답을 기다리지 않고 UI를 즉시 업데이트. 서버 실패 시 롤백.

```
일반 방식:
클릭 → API 요청 → 200ms 대기 → UI 업데이트 (지연 느낌)

낙관적 업데이트:
클릭 → UI 즉시 업데이트 + API 요청 → 실패 시 롤백
```

## 구현할 것

### 1단계: 기본 낙관적 업데이트 (수동)

```jsx
const [liked, setLiked] = useState(false);
const [likeCount, setLikeCount] = useState(post.likes);
const [isLoading, setIsLoading] = useState(false);

const handleLike = async () => {
  // 즉시 UI 업데이트 (낙관적)
  const prevLiked = liked;
  const prevCount = likeCount;
  setLiked(!liked);
  setLikeCount(c => liked ? c - 1 : c + 1);

  try {
    await toggleLike(post.id);
    // 성공: UI 그대로 유지
  } catch (err) {
    // 실패: 롤백
    setLiked(prevLiked);
    setLikeCount(prevCount);
    alert('좋아요 처리에 실패했습니다');
  }
};
```

### 2단계: React 19 useOptimistic

```jsx
import { useOptimistic } from 'react';

const [optimisticLiked, setOptimisticLiked] = useOptimistic(
  liked,                          // 실제 상태
  (currentLiked, newLiked) => newLiked // 낙관적 업데이트 함수
);

const handleLike = async () => {
  setOptimisticLiked(!liked); // 즉시 UI 업데이트
  try {
    const result = await toggleLike(post.id);
    setLiked(result.liked); // 서버 결과로 실제 상태 업데이트
  } catch {
    // useOptimistic이 자동으로 이전 상태로 롤백
  }
};
```

### 3단계: React Query + 낙관적 업데이트

```jsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: toggleLike,
  onMutate: async (postId) => {
    // 진행 중인 refetch 취소 (경쟁 조건 방지)
    await queryClient.cancelQueries({ queryKey: ['posts'] });

    // 현재 상태 스냅샷
    const previous = queryClient.getQueryData(['posts']);

    // 낙관적 업데이트
    queryClient.setQueryData(['posts'], (old) =>
      old.map(p => p.id === postId ? { ...p, liked: !p.liked } : p)
    );

    return { previous }; // 롤백용
  },
  onError: (err, postId, context) => {
    // 에러 시 롤백
    queryClient.setQueryData(['posts'], context.previous);
  },
  onSettled: () => {
    // 성공/실패 모두 서버 데이터로 동기화
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

### 4단계: 시각화 - 세 가지 UX 비교

| 방식 | 좋아요 클릭 후 | 실패 시 |
|------|---------------|---------|
| 일반 | 200ms 후 UI 업데이트 | 에러 표시 |
| 낙관적 (수동) | 즉시 업데이트 | 롤백 + 에러 |
| useOptimistic | 즉시 업데이트 | 자동 롤백 |

네트워크 탭에서 500ms 지연 시뮬레이션 후 체감 차이 비교.

## 면접 포인트

**Q: "낙관적 업데이트란 무엇인가요?"**
A: 서버 응답을 기다리지 않고 예상되는 결과로 UI를 즉시 업데이트하는 패턴입니다. 서버 요청 실패 시 이전 상태로 롤백합니다. 좋아요, 팔로우 버튼처럼 성공률이 높고 즉각적인 피드백이 중요한 곳에 사용합니다.
