# Styled Components

**Package**: `@emotion/styled`
**Source**: https://emotion.sh/docs/styled

---

## Contents

- [1. Overview](#1-overview)
- [2. Basic Usage](#2-basic-usage)
- [3. Props 기반 동적 스타일링](#3-props-기반-동적-스타일링)
- [4. 커스텀 컴포넌트 스타일링](#4-커스텀-컴포넌트-스타일링)
- [5. Object Styles](#5-object-styles)
- [6. withComponent](#6-withcomponent)
- [7. Component Selectors](#7-component-selectors)
- [8. Prop Forwarding (shouldForwardProp)](#8-prop-forwarding-shouldforwardprop)
- [9. Dynamic Style Composition](#9-dynamic-style-composition)
- [10. as Prop](#10-as-prop)
- [11. Nesting Selectors](#11-nesting-selectors)
- [Key Principles](#key-principles)

---

## 1. Overview

`styled`는 스타일이 부착된 React 컴포넌트를 생성하는 방법입니다. `@emotion/styled` 패키지에서 제공되며, styled-components와 glamorous에서 영감을 받았습니다.

`styled`는 `css`와 유사하지만, HTML 태그나 React 컴포넌트를 인자로 호출한 뒤 **템플릿 리터럴**(문자열 스타일) 또는 **일반 함수 호출**(객체 스타일)로 스타일을 정의합니다.

---

## 2. Basic Usage

HTML 태그에 스타일을 부착하여 새로운 React 컴포넌트를 생성합니다.

```jsx
import styled from '@emotion/styled'

const Button = styled.button`
  color: turquoise;
`

render(<Button>This my button component.</Button>)
```

---

## 3. Props 기반 동적 스타일링

`styled` 내부의 보간(interpolation)이나 함수 인자는 `props`를 받아 호출됩니다. 이를 통해 props에 따라 스타일을 동적으로 변경할 수 있습니다.

### 템플릿 리터럴 방식

```jsx
import styled from '@emotion/styled'

const Button = styled.button`
  color: ${props => (props.primary ? 'hotpink' : 'turquoise')};
`

render(
  <div>
    <Button>This is a regular button.</Button>
    <Button primary>This is a primary button.</Button>
  </div>
)
```

### 객체 스타일 방식

```jsx
import styled from '@emotion/styled'

const Container = styled.div(props => ({
  display: 'flex',
  flexDirection: props.column && 'column'
}))

render(
  <div>
    <Container column>
      <span>Column One</span>
      <span>Column Two</span>
    </Container>
  </div>
)
```

---

## 4. 커스텀 컴포넌트 스타일링

`styled`는 `className` prop을 받는 모든 컴포넌트에 스타일을 적용할 수 있습니다.

```jsx
import styled from '@emotion/styled'

const Basic = ({ className }) => (
  <div className={className}>Some text</div>
)

const Fancy = styled(Basic)`
  color: hotpink;
`

render(<Fancy />)
```

> **핵심**: 대상 컴포넌트가 반드시 `className` prop을 DOM 요소에 전달해야 합니다.

---

## 5. Object Styles

정적 객체와 동적 함수를 조합하여 스타일을 정의할 수 있습니다.

```jsx
import styled from '@emotion/styled'

const H1 = styled.h1(
  {
    fontSize: 20
  },
  props => ({ color: props.color })
)

render(<H1 color="lightgreen">This is lightgreen.</H1>)
```

> glamorous API에서 영감을 받은 패턴입니다.

---

## 6. withComponent

특정 스타일을 다른 HTML 요소에 재사용할 때 `withComponent` 메서드를 사용합니다.

```jsx
import styled from '@emotion/styled'

const Section = styled.section`
  background: #333;
  color: #fff;
`

// Section의 스타일을 aside 요소에 재사용
const Aside = Section.withComponent('aside')

render(
  <div>
    <Section>This is a section.</Section>
    <Aside>This is an aside.</Aside>
  </div>
)
```

---

## 7. Component Selectors

Emotion 컴포넌트를 CSS 셀렉터처럼 타겟팅할 수 있습니다. `@emotion/babel-plugin` 사용 시 동작합니다.

### 템플릿 리터럴 방식

```jsx
import styled from '@emotion/styled'

const Child = styled.div`
  color: red;
`

const Parent = styled.div`
  ${Child} {
    color: green;
  }
`

render(
  <div>
    <Parent>
      <Child>Green because I am inside Parent.</Child>
    </Parent>
    <Child>Red because I am not inside Parent.</Child>
  </div>
)
```

### 객체 스타일 방식

```jsx
import styled from '@emotion/styled'

const Child = styled.div({
  color: 'red'
})

const Parent = styled.div({
  [Child]: {
    color: 'green'
  }
})
```

---

## 8. Prop Forwarding (shouldForwardProp)

기본적으로 Emotion은 커스텀 컴포넌트에 모든 props(`theme` 제외)를 전달하고, HTML 태그에는 유효한 HTML 속성만 전달합니다. `shouldForwardProp`으로 이 동작을 커스터마이즈할 수 있습니다.

```jsx
import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

const H1 = styled('h1', {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'color'
})(props => ({
  color: props.color
}))

render(<H1 color="lightgreen">This is lightgreen.</H1>)
```

| Prop 전달 대상     | 기본 동작                                       |
| ------------------- | ----------------------------------------------- |
| **HTML 태그**       | 유효한 HTML 속성만 전달                         |
| **커스텀 컴포넌트** | `theme`을 제외한 모든 props 전달                |
| **shouldForwardProp** | 반환값이 `true`인 prop만 전달 (커스텀 필터링) |

---

## 9. Dynamic Style Composition

`@emotion/react`의 `css` 함수와 조합하여 props 기반 동적 스타일을 생성할 수 있습니다.

```jsx
import styled from '@emotion/styled'
import { css } from '@emotion/react'

const dynamicStyle = props =>
  css`
    color: ${props.color};
  `

const Container = styled.div`
  ${dynamicStyle};
`

render(
  <Container color="lightgreen">
    This is lightgreen.
  </Container>
)
```

---

## 10. as Prop

styled 컴포넌트의 스타일을 유지하면서 렌더링되는 요소를 변경합니다.

```jsx
import styled from '@emotion/styled'

const Button = styled.button`
  color: hotpink;
`

render(
  <Button as="a" href="https://github.com/emotion-js/emotion">
    Emotion on GitHub
  </Button>
)
```

> **동작 규칙**: `as` prop은 HTML 태그에서는 요소 변경에 사용되고, 컴포넌트에서는 기본적으로 하위로 전달(forward)됩니다.

---

## 11. Nesting Selectors

`&` 연산자를 사용하여 중첩 CSS 셀렉터를 작성합니다.

```jsx
import styled from '@emotion/styled'

const Example = styled('span')`
  color: lightgreen;

  & > strong {
    color: hotpink;
  }
`

render(
  <Example>
    This is <strong>nested</strong>.
  </Example>
)
```

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **두 가지 스타일 구문** | 템플릿 리터럴과 객체 스타일 모두 지원 |
| **Props 동적 스타일** | 보간 함수에 props가 자동 전달되어 조건부 스타일링 가능 |
| **className 필수** | 커스텀 컴포넌트를 styled로 감싸려면 `className` prop 수용 필수 |
| **shouldForwardProp** | DOM에 불필요한 props 전달 방지, `@emotion/is-prop-valid` 활용 |
| **as Prop** | 스타일 유지하면서 렌더링 요소 변경 가능 |
| **Component Selectors** | `@emotion/babel-plugin` 필요, Emotion 컴포넌트를 CSS 셀렉터로 사용 |
| **Nesting** | `&` 연산자로 SCSS와 유사한 중첩 셀렉터 지원 |
