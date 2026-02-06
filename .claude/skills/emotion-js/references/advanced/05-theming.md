# Theming

**Package**: `@emotion/react`
**Source**: https://emotion.sh/docs/theming

---

## Contents

- [1. Overview](#1-overview)
- [2. css prop으로 테마 사용](#2-css-prop으로-테마-사용)
- [3. styled 컴포넌트로 테마 사용](#3-styled-컴포넌트로-테마-사용)
- [4. useTheme Hook](#4-usetheme-hook)
- [5. ThemeProvider 중첩](#5-themeprovider-중첩)
- [6. withTheme HOC](#6-withtheme-hoc)
- [7. TypeScript 테마 타이핑](#7-typescript-테마-타이핑)
- [Key Principles](#key-principles)

---

## 1. Overview

`@emotion/react` 패키지에 포함된 테마 기능은 `ThemeProvider`를 통해 컴포넌트 트리 전체에 테마 객체를 전달합니다. React Context를 기반으로 동작하며, 세 가지 방식으로 테마에 접근할 수 있습니다.

| 방식 | 용도 | 패키지 |
|---|---|---|
| `css` prop 함수 | 함수형 컴포넌트에서 인라인 스타일링 | `@emotion/react` |
| `props.theme` | styled 컴포넌트 내부 | `@emotion/styled` |
| `useTheme` Hook | 함수형 컴포넌트에서 직접 접근 | `@emotion/react` |

---

## 2. css prop으로 테마 사용

`css` prop에 함수를 전달하면 테마 객체를 인자로 받습니다.

```tsx
import { ThemeProvider } from '@emotion/react'

const theme = {
  colors: {
    primary: 'hotpink',
    secondary: '#6c757d',
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div css={theme => ({
        color: theme.colors.primary,
        padding: theme.spacing.md,
      })}>
        Themed text
      </div>
    </ThemeProvider>
  )
}
```

---

## 3. styled 컴포넌트로 테마 사용

`styled` 컴포넌트 내부에서 `props.theme`으로 테마에 접근합니다.

### 템플릿 리터럴 방식

```tsx
import styled from '@emotion/styled'

const Button = styled.button`
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
`
```

### Object Styles 방식

```tsx
const Button = styled.button(props => ({
  color: props.theme.colors.primary,
  padding: `${props.theme.spacing.sm}px ${props.theme.spacing.md}px`,
}))
```

---

## 4. useTheme Hook

함수형 컴포넌트에서 `useTheme` Hook으로 테마 값을 직접 가져올 수 있습니다. 테마가 변경되면 자동으로 리렌더링됩니다.

```tsx
import { useTheme } from '@emotion/react'

function SomeText(props) {
  const theme = useTheme()
  return (
    <div
      css={{ color: theme.colors.primary }}
      {...props}
    />
  )
}
```

### useTheme 활용: 조건부 스타일링

```tsx
function StatusBadge({ status }) {
  const theme = useTheme()
  const color = status === 'success'
    ? theme.colors.success
    : theme.colors.danger

  return <span css={{ color, fontWeight: 'bold' }}>{status}</span>
}
```

---

## 5. ThemeProvider 중첩

중첩된 `ThemeProvider`는 `Object.assign` 시맨틱으로 부모 테마와 **병합**됩니다. 함수 형태의 theme prop을 사용하면 부모 테마를 인자로 받아 새 테마를 반환할 수 있습니다.

### 객체 병합 (Object.assign)

```tsx
const outerTheme = {
  colors: { primary: 'hotpink', secondary: 'gray' },
}

const innerTheme = {
  colors: { primary: 'blue' }, // primary만 오버라이드
}

function App() {
  return (
    <ThemeProvider theme={outerTheme}>
      <ThemeProvider theme={innerTheme}>
        {/* colors.primary = 'blue', colors.secondary는 사라짐 (shallow merge) */}
        <Child />
      </ThemeProvider>
    </ThemeProvider>
  )
}
```

### 함수 형태 (부모 테마 확장)

```tsx
function App() {
  return (
    <ThemeProvider theme={outerTheme}>
      <ThemeProvider theme={ancestorTheme => ({
        ...ancestorTheme,
        colors: {
          ...ancestorTheme.colors,
          primary: 'blue', // primary만 오버라이드, secondary 유지
        },
      })}>
        <Child />
      </ThemeProvider>
    </ThemeProvider>
  )
}
```

---

## 6. withTheme HOC

클래스 컴포넌트에서 테마에 접근해야 할 때 사용하는 고차 컴포넌트(Higher-Order Component)입니다. 테마가 업데이트되면 자동으로 리렌더링됩니다.

```tsx
import { withTheme } from '@emotion/react'

class TelemetryComponent extends React.Component {
  render() {
    return (
      <div css={{ color: this.props.theme.colors.primary }}>
        Themed class component
      </div>
    )
  }
}

export default withTheme(TelemetryComponent)
```

> 함수형 컴포넌트에서는 `useTheme` Hook을 사용하는 것이 권장됩니다.

---

## 7. TypeScript 테마 타이핑

TypeScript에서 테마 타입을 지정하려면 `@emotion/react`의 `Theme` 인터페이스를 확장합니다.

```tsx
// emotion.d.ts
import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string
      secondary: string
      success: string
      danger: string
    }
    spacing: {
      sm: number
      md: number
      lg: number
    }
  }
}
```

이렇게 선언하면 `css` prop 함수, `styled` 컴포넌트의 `props.theme`, `useTheme` Hook 모두에서 타입 자동완성이 제공됩니다.

---

## Key Principles

| 원칙 | 설명 |
|---|---|
| **ThemeProvider 최상위 배치** | 앱 최상위에 `ThemeProvider`를 배치하여 모든 컴포넌트에서 테마 접근 가능 |
| **테마 객체 호이스팅** | 렌더 함수 외부에 테마 객체를 정의하여 불필요한 리렌더링 방지 |
| **useTheme 우선** | 함수형 컴포넌트에서는 `withTheme` HOC 대신 `useTheme` Hook 사용 |
| **함수 형태로 중첩 병합** | 중첩 ThemeProvider에서 부모 테마를 안전하게 확장하려면 함수 형태 사용 |
| **TypeScript 타입 확장** | `declare module '@emotion/react'`로 Theme 인터페이스 확장하여 타입 안전성 확보 |
| **다중 테마 시에만 사용** | 단일 테마 앱에서는 JavaScript 상수로 충분 (Best Practices 참조) |
