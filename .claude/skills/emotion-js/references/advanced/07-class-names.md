# ClassNames

**Package**: `@emotion/react`
**Source**: https://emotion.sh/docs/class-names

---

## Contents

- [1. Overview](#1-overview)
- [2. Basic Usage](#2-basic-usage)
- [3. css 함수](#3-css-함수)
- [4. cx 함수](#4-cx-함수)
- [5. 실용적 활용 사례](#5-실용적-활용-사례)
- [Key Principles](#key-principles)

---

## 1. Overview

`ClassNames`는 컴포넌트에 직접 전달되지 않는 클래스명을 생성해야 할 때 사용하는 **render prop 컴포넌트**입니다. 예를 들어 서드파티 컴포넌트가 `wrapperClassName`, `overlayClassName` 등의 prop을 받을 때 유용합니다.

`css` prop이나 `styled`로는 이러한 prop에 Emotion 스타일을 전달할 수 없지만, `ClassNames`를 사용하면 가능합니다.

---

## 2. Basic Usage

`ClassNames`의 children은 `css`와 `cx` 유틸리티를 인자로 받는 함수입니다.

```tsx
import { ClassNames } from '@emotion/react'

// 서드파티 컴포넌트 (wrapperClassName prop을 받음)
let SomeComponent = props => (
  <div className={props.wrapperClassName}>
    in the wrapper!
    <div className={props.className}>{props.children}</div>
  </div>
)

render(
  <ClassNames>
    {({ css, cx }) => (
      <SomeComponent
        wrapperClassName={css({ color: 'green' })}
        className={css`
          color: hotpink;
        `}
      >
        from children!!
      </SomeComponent>
    )}
  </ClassNames>
)
```

---

## 3. css 함수

`ClassNames` 내부의 `css` 함수는 스타일을 받아 **클래스명 문자열**을 반환합니다. Object Styles와 템플릿 리터럴 모두 지원합니다.

### Object Styles

```tsx
<ClassNames>
  {({ css }) => (
    <SomeComponent
      wrapperClassName={css({
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
      })}
    />
  )}
</ClassNames>
```

### 템플릿 리터럴

```tsx
<ClassNames>
  {({ css }) => (
    <SomeComponent
      wrapperClassName={css`
        padding: 16px;
        background-color: #f5f5f5;
        border-radius: 8px;
      `}
    />
  )}
</ClassNames>
```

---

## 4. cx 함수

`cx` 함수는 여러 클래스명을 조합합니다. Emotion의 `css` 결과와 일반 문자열 클래스명을 함께 사용할 수 있습니다.

```tsx
<ClassNames>
  {({ css, cx }) => {
    const baseStyle = css({ padding: 16, borderRadius: 8 })
    const activeStyle = css({ backgroundColor: 'hotpink', color: 'white' })

    return (
      <SomeComponent
        wrapperClassName={cx(
          baseStyle,
          isActive && activeStyle,
          'custom-class'
        )}
      />
    )
  }}
</ClassNames>
```

---

## 5. 실용적 활용 사례

### 서드파티 라이브러리 통합

모달, 툴팁, 드롭다운 등 서드파티 컴포넌트가 className이 아닌 별도 prop으로 스타일을 받을 때 활용합니다.

```tsx
import { ClassNames } from '@emotion/react'
import ReactModal from 'react-modal'

function StyledModal({ isOpen, children }) {
  return (
    <ClassNames>
      {({ css }) => (
        <ReactModal
          isOpen={isOpen}
          overlayClassName={css({
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          })}
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 24,
            backgroundColor: 'white',
            borderRadius: 8,
          })}
        >
          {children}
        </ReactModal>
      )}
    </ClassNames>
  )
}
```

### 테마와 함께 사용

`ClassNames` 내부에서도 테마에 접근할 수 있습니다.

```tsx
import { ClassNames, useTheme } from '@emotion/react'

function ThemedComponent() {
  const theme = useTheme()
  return (
    <ClassNames>
      {({ css }) => (
        <SomeComponent
          wrapperClassName={css({
            color: theme.colors.primary,
            padding: theme.spacing.md,
          })}
        />
      )}
    </ClassNames>
  )
}
```

---

## Key Principles

| 원칙 | 설명 |
|---|---|
| **className 이외의 prop에 사용** | `wrapperClassName`, `overlayClassName` 등 별도 클래스명 prop에 Emotion 스타일 적용 |
| **서드파티 통합 핵심 도구** | 모달, 툴팁 등 외부 컴포넌트의 커스텀 className prop 스타일링에 필수 |
| **css + cx 조합** | `css`로 클래스명 생성, `cx`로 조건부 조합 |
| **두 가지 문법 지원** | Object Styles와 템플릿 리터럴 모두 사용 가능 |
| **css prop 우선** | 일반적인 스타일링에는 `css` prop이나 `styled` 사용, `ClassNames`는 특수한 경우에만 사용 |
