# Labels

**Source**: https://emotion.sh/docs/labels

---

## Contents

- [1. Overview](#1-overview)
- [2. 수동 Label 지정](#2-수동-label-지정)
- [3. Babel 플러그인 자동 Label](#3-babel-플러그인-자동-label)
- [4. 런타임 Auto Label](#4-런타임-auto-label)
- [Key Principles](#key-principles)

---

## 1. Overview

Emotion은 `label`이라는 CSS 프로퍼티를 제공하며, 이 값이 생성된 클래스 이름 끝에 추가되어 **가독성을 향상**시킵니다. 기본적으로 Emotion이 생성하는 클래스 이름은 `css-1a2b3c`와 같은 해시값이지만, label을 지정하면 `css-1a2b3c-some-name`처럼 의미 있는 이름이 붙습니다.

---

## 2. 수동 Label 지정

스타일 정의 시 `label` 프로퍼티를 직접 추가할 수 있습니다.

### 템플릿 리터럴 방식

```jsx
import { css } from '@emotion/react'

let style = css`
  color: hotpink;
  label: some-name;
`
// 생성되는 클래스: css-1a2b3c-some-name
```

### 객체 스타일 방식

```jsx
import { css } from '@emotion/react'

let anotherStyle = css({
  color: 'lightgreen',
  label: 'another-name'
})
// 생성되는 클래스: css-4d5e6f-another-name
```

`label`은 실제 CSS 프로퍼티가 아닌 Emotion 전용 프로퍼티로, 최종 CSS 출력에는 포함되지 않고 클래스 이름 생성에만 사용됩니다.

---

## 3. Babel 플러그인 자동 Label

`@emotion/babel-plugin`을 사용하면 변수명과 파일명을 기반으로 label이 **자동 생성**되므로, 수동으로 지정할 필요가 없습니다.

```jsx
// Header.jsx
const headerStyle = css`
  font-size: 24px;
  font-weight: bold;
`
// Babel 플러그인이 자동으로 label 추가
// 생성되는 클래스: css-1a2b3c-Header-headerStyle
```

### 설치 및 설정

```bash
npm install --save-dev @emotion/babel-plugin
```

```json
// .babelrc
{
  "plugins": ["@emotion"]
}
```

---

## 4. 런타임 Auto Label

Babel 플러그인을 사용하지 않는 프로젝트에서도 런타임 자동 라벨링을 활성화할 수 있습니다.

```javascript
globalThis.EMOTION_RUNTIME_AUTO_LABEL = true
```

### 명시적 Opt-In인 이유

이 기능은 기본 비활성화이며 명시적으로 활성화해야 합니다:

| 이유 | 설명 |
| ---- | ---- |
| **SSR + Safari 이슈** | 서버에서 계산된 label과 Safari 클라이언트의 계산 결과가 다를 수 있어 hydration 경고 발생 가능 |
| **성능 영향** | `css` prop을 많이 사용하는 대규모 애플리케이션에서 성능 저하 가능 |

따라서 **개발 환경에서만** 활성화하는 것이 권장됩니다.

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **가독성 향상** | 해시 클래스명 뒤에 의미 있는 이름을 추가하여 디버깅 용이 |
| **Emotion 전용** | `label`은 실제 CSS가 아닌 Emotion이 클래스명 생성에만 사용하는 프로퍼티 |
| **Babel 자동화** | `@emotion/babel-plugin` 사용 시 변수명/파일명 기반 자동 label 생성 |
| **런타임 Opt-In** | `EMOTION_RUNTIME_AUTO_LABEL`로 Babel 없이도 활성화 가능 (개발 환경 권장) |
| **SSR 주의** | 런타임 auto label은 SSR 환경에서 hydration 불일치를 유발할 수 있음 |
