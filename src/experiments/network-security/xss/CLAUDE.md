# XSS 공격과 방어 패턴

> 핵심 질문: "dangerouslySetInnerHTML을 쓰면 왜 위험한가?"

## 이론

**XSS (Cross-Site Scripting)**: 공격자의 스크립트가 다른 사용자의 브라우저에서 실행.

| 유형 | 방식 |
|------|------|
| DOM-based | `innerHTML = location.hash` 같은 DOM 직접 조작 |
| Reflected | URL 파라미터가 서버 응답에 바로 포함 |
| Stored | DB에 저장된 악성 코드가 다른 사용자에게 표시 |

**XSS로 할 수 있는 것**: 쿠키/세션 탈취, 사용자 행동 캡처, 피싱 페이지 삽입, 키로거.

## 구현할 것

> **주의**: 모든 실험은 localhost에서만 수행. 악성 코드를 외부에 배포하지 않는다.

### 1단계: 취약한 코드 vs 안전한 코드

```jsx
// 취약한 코드 3가지
const UserInput = ({ input }) => {
  // 방법 1: dangerouslySetInnerHTML (위험)
  return <div dangerouslySetInnerHTML={{ __html: input }} />;

  // 방법 2: document.write (더 위험)
  // document.write(input);

  // 방법 3: DOM 직접 조작 (위험)
  // divRef.current.innerHTML = input;
};

// 안전한 코드
const SafeUserInput = ({ input }) => {
  // React 기본: 텍스트 자동 이스케이프
  return <div>{input}</div>;
};
```

### 2단계: 공격 페이로드 테스트

입력창에 다음을 입력해서 각 방어 방식 비교:
```
<img src=x onerror="alert('XSS!')">
<script>alert('XSS!')</script>
<a href="javascript:alert('XSS!')">클릭</a>
<div style="background:url(javascript:alert(1))">
```

| 방어 방법 | `<img onerror>` | `<script>` | `javascript:` |
|-----------|-----------------|------------|---------------|
| 없음 (innerHTML) | 실행 | 실행 | 실행 |
| React 기본 렌더링 | 텍스트로 표시 | 텍스트로 표시 | 텍스트로 표시 |
| DOMPurify | 태그 제거 | 태그 제거 | href 제거 |

### 3단계: DOMPurify 적용

```bash
npm i dompurify
npm i -D @types/dompurify
```

```jsx
import DOMPurify from 'dompurify';

// HTML 렌더링이 필요할 때 (마크다운 에디터, 댓글 등)
const SafeHtml = ({ html }) => {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

### 4단계: CSP (Content Security Policy) 헤더

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'
```

- 인라인 스크립트 차단
- 허용된 도메인의 스크립트만 실행
- XSS의 마지막 방어선

## 면접 포인트

**Q: "XSS를 어떻게 방어하나요?"**
A: 여러 레이어의 방어가 필요합니다. 1) React의 기본 텍스트 이스케이프를 활용합니다. 2) HTML 렌더링이 필요하면 DOMPurify로 sanitize합니다. 3) CSP 헤더로 허용되지 않은 스크립트 실행을 차단합니다. 4) HttpOnly 쿠키로 스크립트에서 세션 탈취를 방지합니다.

**Q: "React를 쓰면 XSS로부터 완전히 안전한가요?"**
A: 아닙니다. React는 JSX에서 텍스트를 자동 이스케이프하지만, `dangerouslySetInnerHTML`, `eval`, 잘못된 `href` 설정 등으로 여전히 취약점이 생길 수 있습니다.
