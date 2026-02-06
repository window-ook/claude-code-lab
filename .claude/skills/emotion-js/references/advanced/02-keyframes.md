# Keyframes

**Package**: `@emotion/react`
**Source**: https://emotion.sh/docs/keyframes

---

## Contents

- [1. Overview](#1-overview)
- [2. Basic Usage](#2-basic-usage)
- [3. styled 컴포넌트에서 사용](#3-styled-컴포넌트에서-사용)
- [4. Object Styles](#4-object-styles)
- [5. 다단계 애니메이션](#5-다단계-애니메이션)
- [Key Principles](#key-principles)

---

## 1. Overview

`keyframes`는 `@emotion/react`에서 제공하는 CSS 애니메이션 정의 헬퍼입니다. CSS `@keyframes` 정의를 받아 스타일에서 사용할 수 있는 객체를 반환합니다. `css` 헬퍼와 동일하게 **템플릿 리터럴**과 **객체 스타일** 두 가지 방식을 지원합니다.

---

## 2. Basic Usage

`keyframes`로 애니메이션을 정의한 뒤, `css` prop의 `animation` 속성에서 보간하여 사용합니다.

```jsx
import { css, keyframes } from '@emotion/react'

const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`

render(
  <div
    css={css`
      animation: ${bounce} 1s ease infinite;
    `}
  >
    some bouncing text!
  </div>
)
```

`keyframes`가 반환하는 값은 고유한 애니메이션 이름으로 치환되므로, 여러 컴포넌트에서 동일한 애니메이션을 안전하게 재사용할 수 있습니다.

---

## 3. styled 컴포넌트에서 사용

`keyframes` 반환값은 `styled` 컴포넌트의 템플릿 리터럴에서도 동일하게 보간됩니다.

```jsx
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const FadeInDiv = styled.div`
  animation: ${fadeIn} 0.5s ease-in;
`

render(<FadeInDiv>I fade in!</FadeInDiv>)
```

### Props 기반 동적 애니메이션

```jsx
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Spinner = styled.div`
  animation: ${rotate} ${props => props.speed || '1s'} linear infinite;
  width: 40px;
  height: 40px;
  border: 3px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
`

render(<Spinner speed="0.6s" />)
```

---

## 4. Object Styles

객체 스타일에서도 `keyframes`를 사용할 수 있습니다. 키프레임 정의 자체도 객체 형태로 작성 가능합니다.

### 템플릿 리터럴 keyframes + 객체 스타일 animation

```jsx
import { keyframes } from '@emotion/react'

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`

render(
  <div
    css={{
      animation: `${slideIn} 0.3s ease-out`
    }}
  >
    Slide in content
  </div>
)
```

### 객체 형태 keyframes 정의

```jsx
import { keyframes } from '@emotion/react'

const pulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' }
})

render(
  <div
    css={{
      animation: `${pulse} 2s ease-in-out infinite`
    }}
  >
    Pulsing element
  </div>
)
```

---

## 5. 다단계 애니메이션

복수의 keyframes를 조합하여 복잡한 애니메이션 시퀀스를 구성할 수 있습니다.

```jsx
import { css, keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { transform: translateY(20px); }
  to { transform: translateY(0); }
`

render(
  <div
    css={css`
      animation: ${fadeIn} 0.5s ease-out, ${slideUp} 0.5s ease-out;
    `}
  >
    Fade in and slide up!
  </div>
)
```

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **고유 이름 자동 생성** | `keyframes`는 고유한 애니메이션 이름을 생성하여 충돌 방지 |
| **보간으로 참조** | `css` 또는 `styled` 템플릿 리터럴에서 `${animName}`으로 사용 |
| **두 가지 구문** | 템플릿 리터럴(`keyframes\`...\``)과 객체(`keyframes({...})`) 모두 지원 |
| **재사용 가능** | 한 번 정의하면 여러 컴포넌트에서 import하여 재사용 |
| **복수 애니메이션** | 쉼표로 구분하여 여러 keyframes를 하나의 `animation`에 조합 가능 |
