# Object Styles

**Package**: `@emotion/react`, `@emotion/styled`
**Source**: https://emotion.sh/docs/object-styles

---

## Contents

- [1. Overview](#1-overview)
- [2. css Prop에서 사용](#2-css-prop에서-사용)
- [3. styled에서 사용](#3-styled에서-사용)
- [4. Child Selectors](#4-child-selectors)
- [5. Media Queries](#5-media-queries)
- [6. 숫자 값 처리](#6-숫자-값-처리)
- [7. 배열 스타일](#7-배열-스타일)
- [8. Fallbacks](#8-fallbacks)
- [9. css 함수와 함께 사용](#9-css-함수와-함께-사용)
- [10. Composition](#10-composition)
- [Key Principles](#key-principles)

---

## 1. Overview

Object styles는 Emotion 코어에 직접 내장된 강력한 패턴입니다. 일반 CSS의 `kebab-case` 대신 `camelCase`로 속성을 작성합니다 (예: `background-color` → `backgroundColor`).

Object styles는 특히 **css prop**과 함께 사용할 때 유용합니다. 문자열 스타일과 달리 별도의 `css` 호출이 필요 없기 때문입니다. `styled`에서도 동일하게 사용할 수 있습니다.

---

## 2. css Prop에서 사용

객체를 직접 `css` prop에 전달합니다.

```jsx
render(
  <div
    css={{
      color: 'darkorchid',
      backgroundColor: 'lightgray'
    }}
  >
    This is darkorchid.
  </div>
)
```

---

## 3. styled에서 사용

`styled`에서 정적 객체와 props 기반 동적 함수를 조합할 수 있습니다.

```jsx
import styled from '@emotion/styled'

const Button = styled.button(
  {
    color: 'darkorchid'
  },
  props => ({
    fontSize: props.fontSize
  })
)

render(<Button fontSize={16}>This is a darkorchid button.</Button>)
```

---

## 4. Child Selectors

`&` 연산자와 함께 자식 셀렉터를 객체 키로 작성합니다.

```jsx
render(
  <div
    css={{
      color: 'darkorchid',
      '& .name': {
        color: 'orange'
      }
    }}
  >
    This is darkorchid.
    <div className="name">This is orange</div>
  </div>
)
```

---

## 5. Media Queries

미디어 쿼리 문자열을 객체 키로 사용합니다.

```jsx
render(
  <div
    css={{
      color: 'darkorchid',
      '@media(min-width: 420px)': {
        color: 'orange'
      }
    }}
  >
    This is orange on a big screen and darkorchid on a small screen.
  </div>
)
```

---

## 6. 숫자 값 처리

숫자 값은 자동으로 `px`이 추가됩니다. 단, `zIndex`, `lineHeight`, `fontWeight` 등 **단위가 없는(unitless) 속성**은 예외입니다.

```jsx
render(
  <div
    css={{
      padding: 8,    // → 8px
      zIndex: 200    // → 200 (단위 없음)
    }}
  >
    This has 8px of padding and a z-index of 200.
  </div>
)
```

---

## 7. 배열 스타일

여러 스타일 객체를 배열로 전달할 수 있습니다. 중첩 배열은 자동으로 평탄화(flatten)됩니다.

```jsx
render(
  <div
    css={[
      { color: 'darkorchid' },
      { backgroundColor: 'hotpink' },
      { padding: 8 }
    ]}
  >
    This is darkorchid with a hotpink background and 8px of padding.
  </div>
)
```

---

## 8. Fallbacks

특정 기능을 지원하지 않는 브라우저를 위해 배열로 폴백 값을 정의할 수 있습니다.

```jsx
render(
  <div
    css={{
      background: ['red', 'linear-gradient(#e66465, #9198e5)'],
      height: 100
    }}
  >
    This has a gradient background in browsers that support
    gradients and is red in browsers that don't support gradients
  </div>
)
```

> 배열의 마지막 값이 우선 적용되고, 지원하지 않으면 이전 값으로 폴백됩니다.

---

## 9. css 함수와 함께 사용

`@emotion/react`의 `css` 함수에도 객체 스타일을 전달할 수 있습니다.

```jsx
import { css } from '@emotion/react'

const hotpink = css({
  color: 'hotpink'
})

render(
  <div>
    <p css={hotpink}>This is hotpink</p>
  </div>
)
```

---

## 10. Composition

`css` 함수로 생성한 스타일 객체를 다른 스타일 내에서 합성할 수 있습니다. 셀렉터 값으로 사용하거나 `css()` 호출에 여러 인자로 전달합니다.

```jsx
import { css } from '@emotion/react'

const hotpink = css({
  color: 'hotpink'
})

// 셀렉터 내에서 합성
const hotpinkHoverOrFocus = css({
  '&:hover,&:focus': hotpink
})

// css() 인자로 합성 - 뒤의 인자가 앞의 인자를 덮어씀
const hotpinkWithBlackBackground = css(
  {
    backgroundColor: 'black',
    color: 'green'
  },
  hotpink
)

render(
  <div>
    <p css={hotpink}>This is hotpink</p>
    <button css={hotpinkHoverOrFocus}>
      This is hotpink on hover or focus
    </button>
    <p css={hotpinkWithBlackBackground}>
      This has a black background and is hotpink.
    </p>
  </div>
)
```

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **camelCase 속성** | `kebab-case` 대신 `camelCase`로 CSS 속성 작성 |
| **자동 px 변환** | 숫자 값에 자동으로 `px` 추가 (unitless 속성 제외) |
| **배열 합성** | `css={[objA, objB]}` 형태로 여러 스타일 객체 조합 |
| **배열 폴백** | 속성 값을 배열로 전달하여 브라우저 폴백 정의 |
| **셀렉터 키** | `'& .child'`, `'@media(...)'` 등 문자열 키로 중첩/미디어쿼리 지원 |
| **css + styled 호환** | css prop과 styled 모두에서 동일한 객체 스타일 사용 가능 |
