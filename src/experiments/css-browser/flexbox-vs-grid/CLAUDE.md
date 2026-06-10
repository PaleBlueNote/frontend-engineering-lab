# Flexbox vs Grid 선택 기준

> 핵심 질문: "언제 Flexbox를 쓰고 언제 Grid를 쓰는가?"

## 이론

| | Flexbox | Grid |
|--|---------|------|
| 차원 | 1차원 (행 OR 열) | 2차원 (행 AND 열) |
| 기준 | 콘텐츠 크기 기반 | 컨테이너 기반 레이아웃 |
| 주 용도 | 네비게이션, 버튼 그룹, 카드 한 줄 | 페이지 레이아웃, 갤러리, 복잡한 UI |

**판단 기준**:
- 아이템을 한 방향으로 나열 → Flexbox
- 격자형 레이아웃, 아이템이 행과 열 기준으로 정렬 → Grid
- 아이템 수가 동적, 크기가 콘텐츠 기반 → Flexbox
- 고정된 격자 구조 → Grid

## 구현할 것

### 1단계: 같은 레이아웃을 두 방식으로 구현

**예시 1: 카드 그리드 (3열)**

```css
/* Flexbox 방식 */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 calc(33.333% - 16px); /* 3열, 하지만 마지막 줄 처리가 까다로움 */
  min-width: 200px;
}

/* Grid 방식 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
/* 마지막 줄 아이템이 1개여도 자동 정렬 */
```

**예시 2: 반응형 카드 (최소 250px)**

```css
/* Grid: auto-fill/auto-fit */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
/* 화면 넓이에 따라 자동으로 열 수 조정 — Flexbox로는 구현이 복잡 */
```

### 2단계: 페이지 레이아웃 (Grid의 강점)

```css
/* Grid: 헤더/사이드바/메인/푸터 레이아웃 */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 40px;
  height: 100vh;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### 3단계: Flexbox의 강점

```css
/* 네비게이션: 가운데 아이템들 + 오른쪽 버튼 */
.nav {
  display: flex;
  align-items: center;
}
.nav-links { display: flex; gap: 16px; flex: 1; }
.nav-btn { margin-left: auto; } /* 오른쪽 끝으로 밀기 */

/* 카드 내부: 제목/설명/버튼이 있는 구조 */
.card {
  display: flex;
  flex-direction: column;
}
.card-body { flex: 1; } /* 남은 공간 차지 */
.card-btn { /* 항상 하단 */ }
```

### 4단계: 인터랙티브 비교 도구

- 동일한 레이아웃 명세 → Flexbox 구현 / Grid 구현 토글
- 코드 복잡도 비교 표시
- 엣지 케이스(마지막 줄 아이템 수가 다를 때) 시각화

## 면접 포인트

**Q: "Flexbox와 Grid의 차이는? 언제 어떤 걸 쓰나요?"**
A: Flexbox는 1차원(행 또는 열 방향) 배치에 적합합니다. Grid는 2차원(행과 열 동시) 레이아웃에 적합합니다. 네비게이션, 버튼 그룹은 Flexbox, 페이지 레이아웃이나 카드 갤러리는 Grid를 씁니다. 실제로는 외부 레이아웃은 Grid, 내부 정렬은 Flexbox로 혼용합니다.
