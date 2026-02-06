# Media Queries

**Package**: `@emotion/react`
**Source**: https://emotion.sh/docs/media-queries

---

## Contents

- [1. Overview](#1-overview)
- [2. 기본 Media Query](#2-기본-media-query)
- [3. 재사용 가능한 Media Queries](#3-재사용-가능한-media-queries)
- [4. Facepaint](#4-facepaint)
- [Key Principles](#key-principles)

---

## 1. Overview

Emotion에서의 미디어 쿼리는 일반 CSS와 동일하게 동작하지만, 블록 내부에 셀렉터를 지정할 필요 없이 CSS를 직접 작성할 수 있습니다.

---

## 2. 기본 Media Query

일반 CSS 미디어 쿼리와 동일한 문법을 사용합니다.

```jsx
import { css } from '@emotion/react'

render(
  <p
    css={css`
      font-size: 30px;
      @media (min-width: 420px) {
        font-size: 50px;
      }
    `}
  >
    Some text!
  </p>
)
```

---

## 3. 재사용 가능한 Media Queries

미디어 쿼리를 반복 작성하면 불일치가 발생할 수 있습니다. 상수로 정의하여 변수로 참조하면 일관성을 유지할 수 있습니다.

```jsx
import { css } from '@emotion/react'

const breakpoints = [576, 768, 992, 1200]

const mq = breakpoints.map(bp => `@media (min-width: ${bp}px)`)
```

### 객체 스타일에서 사용

```jsx
render(
  <div
    css={{
      color: 'green',
      [mq[0]]: {
        color: 'gray'
      },
      [mq[1]]: {
        color: 'hotpink'
      }
    }}
  >
    Some text!
  </div>
)
```

### 템플릿 리터럴에서 사용

```jsx
render(
  <p
    css={css`
      color: green;
      ${mq[0]} {
        color: gray;
      }
      ${mq[1]} {
        color: hotpink;
      }
    `}
  >
    Some other text!
  </p>
)
```

---

## 4. Facepaint

미디어 쿼리 상수를 사용해도 여전히 장황할 수 있습니다. `facepaint` 라이브러리를 사용하면 CSS 속성을 **배열**로 정의하여 각 브레이크포인트별 값을 간결하게 표현할 수 있습니다.

> **주의**: `facepaint`는 **객체 스타일에서만** 동작합니다.

### 설치

```bash
npm install --save facepaint
```

### 사용법

```jsx
import facepaint from 'facepaint'

const breakpoints = [576, 768, 992, 1200]

const mq = facepaint(
  breakpoints.map(bp => `@media (min-width: ${bp}px)`)
)

render(
  <div
    css={mq({
      // [기본, 576px, 768px, 992px]
      color: ['green', 'gray', 'hotpink']
    })}
  >
    Some text.
  </div>
)
```

### 배열 값 매핑

| 인덱스 | 브레이크포인트 | 예시 값 |
| ------ | -------------- | ------- |
| 0 | 기본 (모바일) | `green` |
| 1 | `≥ 576px` | `gray` |
| 2 | `≥ 768px` | `hotpink` |
| 3 | `≥ 992px` | (미지정 시 이전 값 유지) |

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **CSS 동일 문법** | 일반 CSS `@media` 문법 그대로 사용 |
| **셀렉터 불필요** | 미디어 쿼리 블록 내에 셀렉터 없이 CSS 직접 작성 |
| **상수화 권장** | 브레이크포인트를 배열/상수로 정의하여 일관성 유지 |
| **객체 + 템플릿 호환** | 두 스타일 구문 모두에서 미디어 쿼리 사용 가능 |
| **facepaint 간결화** | 배열 기반 반응형 스타일로 장황한 미디어 쿼리 대체 (객체 스타일 전용) |
