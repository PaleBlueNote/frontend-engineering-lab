# Section 10: TypeScript 실전

타입 시스템을 "방어막"이 아니라 "표현 도구"로 사용하는 수준까지.

## 핵심 관점

> 타입을 추가하는 게 아니라, **타입으로 불가능한 상태를 표현 불가능하게** 만드는 것이 목표.

잘못된 접근: `any` 남발, 모든 필드 `optional`
올바른 접근: 가능한 상태만 타입으로 표현 → 컴파일 타임에 버그 차단

## 실험 목록

| 실험 | 경로 | 면접 빈출도 |
|------|------|-----------|
| Generics 제약 조건 | `./generics/` | ★★ |
| Discriminated Union | `./discriminated-union/` | ★★ |
| Utility Types 직접 구현 | `./utility-types/` | ★★ |
| 타입 좁히기(Type Narrowing) | `./type-narrowing/` | ★★ |

## 구현 방식

TypeScript Playground 스타일:
- 잘못된 코드 예시 → 타입 에러 발생 시각화
- 올바른 코드로 수정 → 에러 해소
- Vite가 TS → JS 변환, 런타임 결과를 화면에 표시

## 이 섹션 완료 후 면접 답변 가능 질문

- "Generics를 왜 쓰나요? 예시를 들어주세요" → generics
- "Discriminated Union이란?" → discriminated-union
- "Partial, Pick, Omit을 직접 구현해보세요" → utility-types
- "타입 가드(Type Guard)를 설명하세요" → type-narrowing
