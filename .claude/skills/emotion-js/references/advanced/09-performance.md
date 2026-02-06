# Performance

**Source**: https://emotion.sh/docs/performance

---

## Contents

- [1. Overview](#1-overview)
- [2. 프로파일링 우선](#2-프로파일링-우선)
- [3. 리렌더링 줄이기](#3-리렌더링-줄이기)
- [4. 컴포넌트 인스턴스 통합](#4-컴포넌트-인스턴스-통합)
- [5. 정적 스타일과 동적 스타일 분리](#5-정적-스타일과-동적-스타일-분리)
- [6. 스타일을 컴포넌트 외부에 정의](#6-스타일을-컴포넌트-외부에-정의)
- [7. Babel 플러그인 사용](#7-babel-플러그인-사용)
- [Key Principles](#key-principles)

---

## 1. Overview

Emotion은 **고성능 라이브러리**이며 대부분의 애플리케이션에서 성능 병목이 되지 않습니다. "조기 최적화는 만악의 근원이다"라는 프로그래밍 원칙을 따르되, 실제 성능 문제가 확인되었을 때 아래 전략들을 적용합니다.

---

## 2. 프로파일링 우선

최적화에 앞서 **React DevTools**로 애플리케이션을 프로파일링하여 Emotion이 실제 성능 병목인지 확인해야 합니다. 다른 코드가 원인일 수 있으므로 측정 없이 최적화하지 않습니다.

```
React DevTools → Profiler 탭 → 렌더링 기록 → 병목 컴포넌트 확인
```

---

## 3. 리렌더링 줄이기

`React.memo`, `useMemo`, `useCallback` 등 표준 React 최적화 기법을 적용하여 컴포넌트 렌더링 횟수를 줄입니다. Emotion 스타일의 직렬화(serialization)는 렌더링마다 발생하므로, 불필요한 리렌더링 자체를 방지하는 것이 가장 효과적입니다.

```jsx
// 리렌더링 방지로 스타일 직렬화도 함께 절약
const MemoizedChild = React.memo(({ color }) => (
  <div
    css={css`
      color: ${color};
      padding: 16px;
    `}
  >
    Content
  </div>
))
```

---

## 4. 컴포넌트 인스턴스 통합

수천 개의 개별 컴포넌트 인스턴스에 각각 Emotion 스타일을 적용하는 대신, **부모 요소에 CSS 셀렉터를 사용**하여 하나의 스타일 규칙으로 모든 자식을 대상으로 합니다.

```jsx
// 🚫 비효율: 각 항목마다 css prop 처리
<ul>
  {items.map(item => (
    <li key={item.id} css={css`padding: 8px; border-bottom: 1px solid #eee;`}>
      {item.name}
    </li>
  ))}
</ul>

// ✅ 효율: 부모에 한 번만 스타일 적용
<ul
  css={css`
    & > li {
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
  `}
>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

---

## 5. 정적 스타일과 동적 스타일 분리

정적인 스타일은 `css` prop으로, 자주 변하는 동적 값은 `style` prop으로 분리합니다. `style` prop은 Emotion의 직렬화 과정을 거치지 않으므로 빈번히 변경되는 값에 더 효율적입니다.

```jsx
// ✅ 정적 스타일은 css, 동적 값은 style로 분리
const Box = ({ width, height }) => (
  <div
    css={css`
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
    `}
    style={{ width, height }}
  >
    Content
  </div>
)
```

---

## 6. 스타일을 컴포넌트 외부에 정의

`css` 함수를 컴포넌트 내부가 아닌 **외부에서 호출**하면 스타일 직렬화가 한 번만 발생합니다. 컴포넌트 내부에서 호출하면 매 렌더링마다 직렬화가 반복됩니다.

```jsx
import { css } from '@emotion/react'

// ✅ 외부 정의: 한 번만 직렬화
const cardStyle = css`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Card = ({ children }) => <div css={cardStyle}>{children}</div>

// 🚫 내부 정의: 매 렌더링마다 직렬화
const Card = ({ children }) => (
  <div
    css={css`
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `}
  >
    {children}
  </div>
)
```

---

## 7. Babel 플러그인 사용

`@emotion/babel-plugin`은 `css` prop에 대한 **컴파일 타임 최적화**를 수행하여 런타임 성능을 개선합니다.

```bash
npm install --save-dev @emotion/babel-plugin
```

```json
// .babelrc
{
  "plugins": ["@emotion"]
}
```

플러그인이 수행하는 최적화:
- 스타일 직렬화를 빌드 타임으로 이동
- 자동 label 생성 (디버깅 지원)
- 소스맵 생성

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **프로파일링 우선** | React DevTools로 병목을 확인한 후에만 최적화 적용 |
| **리렌더링 감소** | `React.memo` 등으로 불필요한 렌더링을 줄이면 스타일 직렬화도 절약 |
| **셀렉터 활용** | 다수의 개별 css prop 대신 부모 셀렉터로 통합 |
| **css + style 분리** | 정적 스타일은 `css`, 동적 값은 `style` prop으로 분리 |
| **외부 정의** | `css` 호출을 컴포넌트 외부에 배치하여 직렬화 1회로 제한 |
| **Babel 플러그인** | 컴파일 타임 최적화로 런타임 비용 절감 |
