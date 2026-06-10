# useState vs useReducer

> 핵심 질문: "언제 useState 대신 useReducer를 써야 하는가?"

## 이론

**useState**: 단순한 값. 상태 업데이트 로직이 컴포넌트 안에 분산.
**useReducer**: 복잡한 상태 전환 로직. 순수 함수 reducer로 중앙화.

```
useReducer가 유리한 경우:
1. 상태가 여러 개고 함께 업데이트되는 경우
2. 다음 상태가 이전 상태에 의존하는 경우
3. 상태 전환 로직을 컴포넌트 밖으로 분리하고 싶은 경우
4. 복잡한 상태 머신 (loading/error/success)
```

## 구현할 것

### 1단계: 폼 상태 - useState로 구현
```jsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  setError(null);
  try {
    await submitForm({ name, email });
    setSuccess(true);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};
// 5개의 useState → 서로 의존 관계, 관리 복잡
```

### 2단계: 동일한 폼 - useReducer로 구현
```jsx
const initialState = {
  name: '', email: '',
  status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
  error: null,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'success' };
    case 'SUBMIT_ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(formReducer, initialState);

const handleSubmit = async () => {
  dispatch({ type: 'SUBMIT_START' });
  try {
    await submitForm(state);
    dispatch({ type: 'SUBMIT_SUCCESS' });
  } catch (err) {
    dispatch({ type: 'SUBMIT_ERROR', error: err.message });
  }
};
```

### 3단계: 장단점 비교 표시

| 기준 | useState | useReducer |
|------|----------|-----------|
| 코드량 | 적음 | 많음 |
| 상태 전환 명확성 | 낮음 | 높음 (action 이름으로 파악) |
| 테스트 용이성 | 컴포넌트 테스트 필요 | reducer 순수 함수 단독 테스트 가능 |
| 불가능한 상태 방지 | 어려움 | action type으로 제한 가능 |

### 4단계: reducer 단위 테스트 (useReducer의 핵심 장점)
```js
// 컴포넌트 없이 순수 함수만 테스트
describe('formReducer', () => {
  it('SUBMIT_START: status를 submitting으로, error를 null로', () => {
    const state = formReducer(
      { ...initialState, error: '이전 에러' },
      { type: 'SUBMIT_START' }
    );
    expect(state.status).toBe('submitting');
    expect(state.error).toBeNull();
  });
});
```

## 면접 포인트

**Q: "useState와 useReducer의 차이는? 언제 useReducer를 쓰나요?"**
A: useState는 단순한 값에, useReducer는 여러 상태가 함께 변하거나 전환 로직이 복잡할 때 사용합니다. useReducer의 reducer는 순수 함수로 컴포넌트 밖에서 테스트할 수 있다는 장점이 있습니다.
