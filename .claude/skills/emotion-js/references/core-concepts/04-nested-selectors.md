# Nested Selectors

**Package**: `@emotion/react`
**Source**: https://emotion.sh/docs/nested

---

## Contents

- [1. Overview](#1-overview)
- [2. 기본 중첩 셀렉터](#2-기본-중첩-셀렉터)
- [3. & (Ampersand) 셀렉터](#3--ampersand-셀렉터)
- [Key Principles](#key-principles)

---

## 1. Overview

현재 클래스 또는 React 컴포넌트 내부의 요소를 타겟팅할 때 중첩 셀렉터가 유용합니다. SCSS와 유사한 방식으로 셀렉터를 중첩하여 작성할 수 있습니다.

---

## 2. 기본 중첩 셀렉터

현재 컴포넌트 내부의 하위 요소에 스타일을 적용합니다. 별도의 `&` 없이 태그/클래스를 그대로 중첩하면 자식 셀렉터로 동작합니다.

```jsx
import { css } from '@emotion/react'

const paragraph = css`
  color: turquoise;

  a {
    border-bottom: 1px solid currentColor;
    cursor: pointer;
  }
`

render(
  <p css={paragraph}>
    Some text. <a>A link with a bottom border.</a>
  </p>
)
```

> `a` 셀렉터가 `paragraph` 내부에 중첩되어, 해당 스타일이 적용된 요소 안의 `<a>` 태그에만 스타일이 적용됩니다.

---

## 3. & (Ampersand) 셀렉터

`&`는 현재 클래스 자체를 나타냅니다. 이를 활용하면 **부모 요소의 컨텍스트에 따라** 다른 스타일을 적용할 수 있습니다.

```jsx
import { css } from '@emotion/react'

const paragraph = css`
  color: turquoise;

  header & {
    color: green;
  }
`

render(
  <div>
    <header>
      {/* header 내부이므로 green */}
      <p css={paragraph}>This is green since it's inside a header</p>
    </header>
    {/* header 외부이므로 turquoise */}
    <p css={paragraph}>This is turquoise since it's not inside a header.</p>
  </div>
)
```

### & 셀렉터 활용 패턴

| 패턴 | 의미 |
| ---- | ---- |
| `& > span` | 현재 요소의 직계 자식 `span` |
| `& + div` | 현재 요소의 바로 다음 형제 `div` |
| `&:hover` | 현재 요소의 hover 상태 |
| `&::before` | 현재 요소의 ::before 가상 요소 |
| `header &` | `header` 내부에 위치한 현재 요소 |
| `.dark-mode &` | `.dark-mode` 컨텍스트 내의 현재 요소 |

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **자식 요소 타겟팅** | 태그/클래스를 중첩하여 하위 요소에 스타일 적용 |
| **& = 현재 클래스** | `&`는 Emotion이 생성한 현재 CSS 클래스를 참조 |
| **컨텍스트 기반 스타일** | `parent &` 패턴으로 부모에 따라 다른 스타일 적용 |
| **SCSS 호환 문법** | SCSS와 동일한 중첩 셀렉터 구문 지원 |
