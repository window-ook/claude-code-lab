# Attaching Props

**Source**: https://emotion.sh/docs/with-props

---

## Contents

- [1. Overview](#1-overview)
- [2. css prop을 활용한 Props 전달](#2-css-prop을-활용한-props-전달)
- [3. 스타일 오버라이드 우선순위](#3-스타일-오버라이드-우선순위)
- [4. styled 컴포넌트와의 비교](#4-styled-컴포넌트와의-비교)
- [Key Principles](#key-principles)

---

## 1. Overview

일부 CSS-in-JS 라이브러리는 컴포넌트에 props를 부착하기 위한 전용 API를 제공합니다. Emotion은 별도의 API 대신 **일반 React 컴포넌트를 만들고 `css` prop을 사용하여 표준 React 방식으로 props를 전달**하는 것을 권장합니다.

---

## 2. css prop을 활용한 Props 전달

일반 React 컴포넌트를 생성하고, `css` prop으로 기본 스타일을 정의한 뒤, `{...props}` 스프레드로 외부 props를 전달합니다.

```jsx
import { css } from '@emotion/react'

const pinkInput = css`
  background-color: pink;
`

const RedPasswordInput = props => (
  <input
    type="password"
    css={css`
      background-color: red;
      display: block;
    `}
    {...props}
  />
)

render(
  <div>
    <RedPasswordInput placeholder="red" />
    <RedPasswordInput placeholder="pink" css={pinkInput} />
  </div>
)
```

- 첫 번째 인스턴스: 컴포넌트 내부 스타일(`background-color: red`)이 적용됩니다.
- 두 번째 인스턴스: 외부에서 전달된 `css={pinkInput}`이 내부 스타일을 **오버라이드**하여 `background-color: pink`가 적용됩니다.

---

## 3. 스타일 오버라이드 우선순위

props를 통해 전달된 `css`는 컴포넌트 내부에 정의된 스타일보다 **높은 우선순위**를 가집니다. 이는 `{...props}` 스프레드가 내부 `css` prop 뒤에 위치하기 때문입니다.

```jsx
// 내부 스타일: background-color: red
// 외부 전달: background-color: pink
// 결과: background-color: pink (외부 css가 우선)
<RedPasswordInput css={pinkInput} />
```

### 스프레드 위치에 따른 차이

```jsx
// ✅ 외부 css가 내부를 오버라이드 (권장)
const Component = props => (
  <div
    css={css`
      color: red;
    `}
    {...props}
  />
)

// ⚠️ 내부 css가 외부를 오버라이드 (비권장)
const Component = props => (
  <div
    {...props}
    css={css`
      color: red;
    `}
  />
)
```

---

## 4. styled 컴포넌트와의 비교

`styled`를 사용하면 동일한 패턴을 다른 방식으로 표현할 수 있습니다.

### css prop 방식

```jsx
const Input = props => (
  <input
    css={css`
      padding: 8px;
      border: 1px solid #ccc;
    `}
    {...props}
  />
)
```

### styled 방식

```jsx
import styled from '@emotion/styled'

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
`
```

두 방식 모두 외부에서 `css` prop으로 스타일을 오버라이드할 수 있습니다. `css` prop 방식은 HTML 속성(`type`, `placeholder` 등)을 명시적으로 설정할 수 있는 장점이 있고, `styled` 방식은 더 간결한 문법을 제공합니다.

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **전용 API 없음** | Emotion은 props 부착을 위한 별도 API 대신 표준 React 패턴을 권장 |
| **css prop + 스프레드** | 컴포넌트 내부에 `css` 정의 후 `{...props}` 스프레드로 외부 props 수용 |
| **외부 우선** | props로 전달된 `css`가 컴포넌트 내부 스타일을 오버라이드 |
| **스프레드 위치 중요** | `{...props}`가 내부 `css` 뒤에 위치해야 외부 오버라이드가 동작 |
| **styled와 호환** | 동일한 오버라이드 패턴이 `styled` 컴포넌트에서도 동작 |
