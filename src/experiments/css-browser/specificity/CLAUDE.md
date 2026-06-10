# CSS Specificity 계산기

> 핵심 질문: "스타일이 왜 안 먹히는지 바로 알 수 있는가?"

## 이론

**Specificity 4자리 점수**: (inline, ID, class/pseudo/attr, element)

| 선택자 | inline | ID | class/pseudo/attr | element | 점수 |
|--------|--------|----|-------------------|---------|------|
| `*` | 0 | 0 | 0 | 0 | 0-0-0-0 |
| `div` | 0 | 0 | 0 | 1 | 0-0-0-1 |
| `.class` | 0 | 0 | 1 | 0 | 0-0-1-0 |
| `#id` | 0 | 1 | 0 | 0 | 0-1-0-0 |
| `style=""` | 1 | 0 | 0 | 0 | 1-0-0-0 |
| `div.class` | 0 | 0 | 1 | 1 | 0-0-1-1 |
| `#id .class div` | 0 | 1 | 1 | 1 | 0-1-1-1 |
| `:is()`, `:not()`, `:has()` | 가장 높은 인수의 specificity |

**`!important`**: specificity 무시, 별도 레이어. 비교 시 !important 간에만 specificity 비교.

**최신 CSS Cascade Layers** (`@layer`):
```css
@layer base { button { color: blue; } }    /* 낮은 레이어 */
@layer theme { .btn { color: red; } }      /* 높은 레이어 → 우선 */
/* .btn의 specificity가 낮아도 theme 레이어가 우선 */
```

## 구현할 것

### 1단계: Specificity 계산기 함수

```js
function parseSpecificity(selector) {
  let inline = 0, id = 0, classLike = 0, element = 0;

  // inline style (컴포넌트에서 받는 플래그)
  // ID
  const idMatches = selector.match(/#[a-zA-Z]/g) || [];
  id = idMatches.length;

  // class, pseudo-class, attribute
  const classMatches = selector.match(/\.[a-zA-Z]|:[a-zA-Z]|\[[^\]]+\]/g) || [];
  classLike = classMatches.length;

  // element, pseudo-element
  const elemMatches = selector.match(/^[a-z]|[^.#[\]:][a-z]+|::[a-zA-Z]/g) || [];
  element = elemMatches.length;

  return { inline, id, classLike, element,
    score: `${inline}-${id}-${classLike}-${element}` };
}
```

### 2단계: 인터랙티브 비교 도구

```jsx
const SpecificityCalculator = () => {
  const [selectors, setSelectors] = useState([
    'div.container p',
    '#header .nav a',
    'body header nav ul li a',
  ]);

  const results = selectors.map(s => ({
    selector: s,
    ...parseSpecificity(s),
  }));

  // 순위 정렬 및 시각화
  const sorted = [...results].sort((a, b) => compareSpecificity(a, b));

  return (
    <div>
      {sorted.map((r, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="font-mono">{r.selector}</span>
          <span className="badge">{r.score}</span>
          {i === 0 && <span>우선 적용</span>}
        </div>
      ))}
    </div>
  );
};
```

### 3단계: 실전 문제

```css
/* 퀴즈: 버튼 색상은? */
#app .container button { color: blue; }        /* 0-1-1-1 */
.container .btn { color: red; }                /* 0-0-2-0 */
button.btn { color: green; }                   /* 0-0-1-1 */

/* 정답: blue (ID 선택자가 포함된 0-1-1-1이 가장 높음) */
```

### 4단계: !important와 CSS Layers

```css
/* !important 남용 문제 */
.btn { color: blue !important; }
#id .btn { color: red; } /* important 없음 → blue 적용 */
.btn-override { color: green !important; } /* important vs important → specificity 비교 */
```

## 면접 포인트

**Q: "CSS 우선순위(Specificity)는 어떻게 결정되나요?"**
A: 4자리 점수로 결정됩니다. inline style > ID > class/가상클래스/속성 > element 순입니다. 같은 점수면 나중에 선언된 것이 우선합니다. !important는 모든 specificity를 무시하지만 남용하면 유지보수가 어려워집니다.

**Q: "CSS 스타일이 예상대로 적용되지 않을 때 어떻게 디버깅하나요?"**
A: Chrome DevTools Elements 탭에서 적용된/취소선(적용 안 된) 스타일을 확인합니다. Computed 탭에서 최종 적용된 값을 확인하고, specificity가 더 높은 선택자에 의해 덮어씌워졌는지 확인합니다.
