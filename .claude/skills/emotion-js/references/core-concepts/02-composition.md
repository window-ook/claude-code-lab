# Composition

**Package**: `@emotion/react`
**Source**: https://emotion.sh/docs/composition

---

## Contents

- [1. Overview](#1-overview)
- [2. 기본 Composition](#2-기본-composition)
- [3. 일반 CSS의 한계](#3-일반-css의-한계)
- [4. Emotion의 Composition 해결책](#4-emotion의-composition-해결책)
- [Key Principles](#key-principles)

---

## 1. Overview

Composition은 Emotion에서 가장 강력하고 유용한 패턴 중 하나입니다. `css`에서 반환된 값을 다른 스타일 블록에 보간(interpolation)하여 스타일을 합성할 수 있습니다.

---

## 2. 기본 Composition

`css`로 정의한 스타일을 다른 `css` 블록 안에서 보간하여 합성합니다.

```jsx
import { css } from '@emotion/react'

const base = css`
  color: hotpink;
`

render(
  <div
    css={css`
      ${base};
      background-color: #eee;
    `}
  >
    This is hotpink.
  </div>
)
```

---

## 3. 일반 CSS의 한계

일반 CSS에서는 여러 클래스를 조합할 때 **스타일시트 정의 순서**에 따라 우선순위가 결정됩니다. 클래스 이름의 나열 순서가 아니라 CSS 파일 내 선언 순서가 적용되므로, 의도한 대로 스타일이 적용되지 않는 문제가 발생합니다.

```jsx
render(
  <div>
    <style>
      {`
        .danger {
          color: red;
        }
        .base {
          background-color: lightgray;
          color: turquoise;
        }
      `}
    </style>
    {/* .base가 .danger보다 나중에 선언되었으므로 항상 turquoise */}
    <p className="base danger">What color will this be?</p>
  </div>
)
```

> **문제점**: `className="base danger"`로 작성해도 `.base`가 스타일시트에서 나중에 정의되었기 때문에 항상 turquoise가 적용됩니다. 이를 해결하려면 `!important`나 클래스 재정렬 같은 우회 방법이 필요합니다.

---

## 4. Emotion의 Composition 해결책

Emotion에서는 `css` 배열을 사용하여 스타일을 합성할 때, **사용하는 순서(배열 내 위치)**에 따라 우선순위가 결정됩니다. 나중에 오는 스타일이 이전 스타일을 덮어씁니다.

```jsx
import { css } from '@emotion/react'

const danger = css`
  color: red;
`

const base = css`
  background-color: darkgreen;
  color: turquoise;
`

render(
  <div>
    {/* turquoise - base 스타일만 적용 */}
    <div css={base}>This will be turquoise</div>

    {/* turquoise - base가 danger 뒤에 있으므로 base의 color가 우선 */}
    <div css={[danger, base]}>
      This will be also be turquoise since the base styles
      overwrite the danger styles.
    </div>

    {/* red - danger가 base 뒤에 있으므로 danger의 color가 우선 */}
    <div css={[base, danger]}>This will be red</div>
  </div>
)
```

> **핵심**: Emotion의 composition을 사용하면 스타일이 생성된 순서를 신경 쓸 필요 없이, **사용하는 순서**대로 병합됩니다.

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **보간 합성** | `css` 반환값을 다른 `css` 블록에 `${base};` 형태로 삽입 |
| **배열 합성** | `css={[styleA, styleB]}` 형태로 여러 스타일 조합 |
| **사용 순서 우선** | 배열 뒤쪽 스타일이 앞쪽 스타일을 덮어씀 (선언 순서 무관) |
| **CSS 한계 극복** | 일반 CSS의 스타일시트 정의 순서 의존 문제를 해결 |
| **!important 불필요** | 합성 순서로 우선순위를 제어하므로 `!important` 우회 불필요 |
