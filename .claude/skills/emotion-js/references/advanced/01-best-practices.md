# Best Practices

**Source**: https://emotion.sh/docs/best-practices

---

## Contents

- [1. Overview](#1-overview)
- [2. TypeScript와 Object Styles 사용](#2-typescript와-object-styles-사용)
- [3. 스타일을 컴포넌트와 함께 배치](#3-스타일을-컴포넌트와-함께-배치)
- [4. 애플리케이션 간 스타일 공유](#4-애플리케이션-간-스타일-공유)
- [5. 동적 스타일에 style prop 사용](#5-동적-스타일에-style-prop-사용)
- [6. CSS 변수를 활용한 동적 값 처리](#6-css-변수를-활용한-동적-값-처리)
- [7. React에서는 @emotion/react 또는 @emotion/styled 사용](#7-react에서는-emotionreact-또는-emotionstyled-사용)
- [8. 하나의 스타일링 방식을 일관되게 사용](#8-하나의-스타일링-방식을-일관되게-사용)
- [9. 스타일을 컴포넌트 외부에 정의](#9-스타일을-컴포넌트-외부에-정의)
- [10. 스타일 상수 정의](#10-스타일-상수-정의)
- [11. 테마 전략](#11-테마-전략)
- [Key Principles](#key-principles)

---

## 1. Overview

Emotion은 매우 유연한 라이브러리이지만, 그 유연성이 특히 새로운 사용자에게는 부담이 될 수 있습니다. 이 문서는 Emotion을 효과적으로 사용하기 위한 **권장 사항(recommendations)**을 정리합니다. 필수 규칙이 아닌 가이드라인입니다.

---

## 2. TypeScript와 Object Styles 사용

CSS 문자열 대신 **TypeScript + Object Styles**를 사용하면 Intellisense와 정적 타입 검사를 통해 스타일 버그를 사전에 방지할 수 있습니다.

```tsx
// 🚫 피해야 할 패턴: CSS 문자열
const style = css`
  color: blue;
  font-wieght: bold; /* 오타를 감지할 수 없음 */
`

// ✅ 권장 패턴: Object Styles + TypeScript
const style = css({
  color: 'blue',
  fontWeight: 'bold', // 타입 체크로 오타 방지
})
```

---

## 3. 스타일을 컴포넌트와 함께 배치

스타일은 별도의 CSS 파일이 아닌, **사용하는 컴포넌트와 같은 파일**에 배치합니다. 유지보수가 단순해지고, 어떤 컴포넌트가 어떤 스타일을 사용하는지 명확해집니다.

```tsx
// 🚫 피해야 할 패턴: 별도 파일에 스타일 분리
// styles/button.ts
export const buttonStyle = css({ ... })

// components/Button.tsx
import { buttonStyle } from '../styles/button'

// ✅ 권장 패턴: 컴포넌트와 스타일 함께 배치
// components/Button.tsx
const buttonStyle = css({
  padding: '8px 16px',
  borderRadius: 4,
})

function Button({ children }) {
  return <button css={buttonStyle}>{children}</button>
}
```

---

## 4. 애플리케이션 간 스타일 공유

### 방법 1: CSS 객체 export

재사용 가능한 CSS 객체를 정의하고 export하여 여러 컴포넌트에서 import합니다. 배열을 사용하면 여러 스타일을 합성할 수 있습니다.

```tsx
// shared/styles.ts
export const baseButton = css({
  padding: '8px 16px',
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
})

// components/PrimaryButton.tsx
import { baseButton } from '../shared/styles'

const primaryStyle = css({
  backgroundColor: '#0d6efd',
  color: 'white',
})

function PrimaryButton({ children }) {
  return <button css={[baseButton, primaryStyle]}>{children}</button>
}
```

### 방법 2: 컴포넌트 재사용으로 공유

스타일과 로직을 캡슐화한 래퍼 컴포넌트를 만들어 공유합니다. 스타일은 컴포넌트에 함께 배치된 상태를 유지하면서 기능을 공유할 수 있습니다.

```tsx
// shared/Button.tsx
const Button = styled.button({
  padding: '8px 16px',
  borderRadius: 4,
})

export default Button
```

---

## 5. 동적 스타일에 style prop 사용

`css` prop과 `styled`는 **정적 스타일**을 처리하고, 인라인 `style` prop은 **진정한 동적 스타일**(자주 변경되거나 개별 요소에 고유한 값)을 처리합니다.

```tsx
// 🚫 피해야 할 패턴: 동적 값에 css prop 사용 → 중복 CSS 생성
function Avatar({ imageUrl }) {
  return (
    <div
      css={css({
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundImage: `url(${imageUrl})`, // 매번 새로운 CSS 클래스 생성
      })}
    />
  )
}

// ✅ 권장 패턴: 정적 + 동적 분리
const avatarStyle = css({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundSize: 'cover',
})

function Avatar({ imageUrl }) {
  return (
    <div
      css={avatarStyle}
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  )
}
```

---

## 6. CSS 변수를 활용한 동적 값 처리

CSS 변수를 사용하면 동적 값을 `style` prop으로 주입하면서도 CSS를 통합 상태로 유지할 수 있습니다.

```tsx
const avatarStyle = css({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundImage: 'var(--background-image)',
  backgroundSize: 'cover',
})

function Avatar({ imageUrl }) {
  return (
    <div
      css={avatarStyle}
      style={{ '--background-image': `url(${imageUrl})` } as React.CSSProperties}
    />
  )
}
```

---

## 7. React에서는 @emotion/react 또는 @emotion/styled 사용

React 애플리케이션에서는 `@emotion/css` 대신 `@emotion/react` 또는 `@emotion/styled`를 사용합니다. 더 나은 개발자 경험(DX)을 제공합니다.

| 패키지 | 용도 |
|---|---|
| `@emotion/react` | `css` prop 기반 스타일링 (React 전용) |
| `@emotion/styled` | styled components 패턴 (React 전용) |
| `@emotion/css` | 프레임워크 무관 (React 외 환경) |

---

## 8. 하나의 스타일링 방식을 일관되게 사용

`css` prop과 `styled`는 함께 사용할 수 있지만, 코드베이스 전체에서 **하나의 방식을 일관되게** 사용하는 것이 유지보수성을 높입니다.

Emotion 메인테이너들은 **css prop 방식**을 선호합니다.

```tsx
// ✅ 프로젝트 전체에서 css prop만 사용
function Card({ title, children }) {
  return (
    <div css={cardStyle}>
      <h2 css={titleStyle}>{title}</h2>
      {children}
    </div>
  )
}

// ✅ 또는 프로젝트 전체에서 styled만 사용
const CardWrapper = styled.div({ ... })
const CardTitle = styled.h2({ ... })

function Card({ title, children }) {
  return (
    <CardWrapper>
      <CardTitle>{title}</CardTitle>
      {children}
    </CardWrapper>
  )
}
```

---

## 9. 스타일을 컴포넌트 외부에 정의

스타일 정의를 컴포넌트 함수 **외부(바깥)**로 이동하면 다음과 같은 이점이 있습니다:

- 렌더링마다 한 번만 직렬화(serialize)되어 **성능 향상**
- 실수로 동적 스타일을 주입하는 것을 **방지**
- JSX의 **가독성 향상**

```tsx
// 🚫 피해야 할 패턴: 컴포넌트 내부에 정의
function Button({ children }) {
  const style = css({  // 매 렌더링마다 재생성
    padding: '8px 16px',
  })
  return <button css={style}>{children}</button>
}

// ✅ 권장 패턴: 컴포넌트 외부에 정의
const buttonStyle = css({  // 한 번만 생성
  padding: '8px 16px',
})

function Button({ children }) {
  return <button css={buttonStyle}>{children}</button>
}
```

---

## 10. 스타일 상수 정의

반복 사용되는 값(색상, 간격, border-radius 등)을 JavaScript 변수나 테마 객체로 정의하여 중복을 제거합니다.

```tsx
// constants/styles.ts
export const colors = {
  primary: '#0d6efd',
  success: '#198754',
  danger: '#dc3545',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  full: '50%',
} as const

// 사용
const buttonStyle = css({
  backgroundColor: colors.primary,
  padding: `${spacing.sm}px ${spacing.md}px`,
  borderRadius: radii.sm,
})
```

---

## 11. 테마 전략

테마 시스템(ThemeProvider)은 **다중 테마(라이트/다크 모드 등)**를 지원하는 경우에만 도입합니다. 단일 테마 애플리케이션에서는 **JavaScript 상수**로 충분합니다.

```tsx
// 🚫 불필요한 패턴: 단일 테마에 ThemeProvider 사용
const theme = { colors: { primary: '#0d6efd' } }
<ThemeProvider theme={theme}>...</ThemeProvider>

// ✅ 단일 테마: JavaScript 상수 사용
export const colors = { primary: '#0d6efd' } as const

// ✅ 다중 테마: ThemeProvider 사용이 적합
const lightTheme = { colors: { bg: '#fff', text: '#000' } }
const darkTheme = { colors: { bg: '#1a1a1a', text: '#fff' } }

function App() {
  const [isDark, setIsDark] = useState(false)
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Main />
    </ThemeProvider>
  )
}
```

---

## Key Principles

| 원칙 | 설명 |
|---|---|
| **TypeScript + Object Styles** | 정적 타입 검사와 Intellisense로 스타일 버그 사전 방지 |
| **스타일 코로케이션** | 스타일을 사용하는 컴포넌트와 같은 파일에 배치 |
| **정적/동적 분리** | `css` prop은 정적 스타일, `style` prop은 동적 스타일 |
| **CSS 변수 활용** | 동적 값을 CSS 변수로 주입하여 CSS 통합 유지 |
| **외부 정의** | 스타일을 컴포넌트 함수 외부에 정의하여 성능과 가독성 확보 |
| **일관된 방식** | `css` prop 또는 `styled` 중 하나를 프로젝트 전체에서 일관 사용 |
| **스타일 상수** | 반복 값을 `as const` 객체로 중앙 관리 |
| **테마 전략** | 다중 테마 필요 시에만 ThemeProvider 도입, 단일 테마는 상수 사용 |
