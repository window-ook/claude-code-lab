# CacheProvider

**Package**: `@emotion/react`, `@emotion/cache`
**Source**: https://emotion.sh/docs/cache-provider

---

## Contents

- [1. Overview](#1-overview)
- [2. Basic Usage](#2-basic-usage)
- [3. createCache 옵션](#3-createcache-옵션)
- [4. CSP Nonce 설정](#4-csp-nonce-설정)
- [5. 커스텀 Container](#5-커스텀-container)
- [6. Stylis 플러그인 커스터마이징](#6-stylis-플러그인-커스터마이징)
- [7. 다중 Cache 사용](#7-다중-cache-사용)
- [Key Principles](#key-principles)

---

## 1. Overview

`CacheProvider`는 Emotion의 설정 옵션을 커스터마이징할 수 있는 React 컴포넌트입니다. 커스텀 Stylis 플러그인 추가, 클래스 이름 접두사 변경, 특정 DOM 요소에 스타일 태그 삽입 등을 설정할 수 있습니다.

`@emotion/cache`의 `createCache` 함수로 캐시 인스턴스를 생성하고, 이를 `CacheProvider`의 `value` prop으로 전달합니다.

---

## 2. Basic Usage

```jsx
import { CacheProvider, css } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'

const customPlugin = () => {}

const myCache = createCache({
  key: 'my-prefix-key',
  stylisPlugins: [
    customPlugin,
    prefixer
  ]
})

render(
  <CacheProvider value={myCache}>
    <div css={css`display: flex;`}>
      <div
        css={css`
          flex: 1;
          transform: scale(1.1);
          color: hotpink;
        `}
      >
        Some text
      </div>
    </div>
  </CacheProvider>
)
```

---

## 3. createCache 옵션

`createCache` 함수에 전달할 수 있는 설정 옵션입니다.

| 옵션 | 타입 | 설명 |
| ---- | ---- | ---- |
| **key** | `string` | 클래스 이름 접두사 및 `data-emotion` 속성 값. 다중 캐시 사용 시 **필수** |
| **nonce** | `string` | CSP(Content Security Policy) 준수를 위해 모든 `<style>` 태그에 추가되는 nonce 값 |
| **stylisPlugins** | `Array<Function>` | 전처리에 사용할 Stylis 플러그인 배열 |
| **container** | `Node` | 스타일 태그가 삽입될 DOM 노드 (기본: `<head>`) |
| **prepend** | `boolean` | `true`면 스타일 태그를 container 앞에 삽입, `false`면 뒤에 추가 |

---

## 4. CSP Nonce 설정

Content Security Policy를 사용하는 환경에서 Emotion의 `<style>` 태그가 차단되지 않도록 nonce를 설정합니다.

```jsx
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

const cache = createCache({
  key: 'my-app',
  nonce: 'generated-server-nonce-value'
})

render(
  <CacheProvider value={cache}>
    <App />
  </CacheProvider>
)
// 생성되는 style 태그: <style data-emotion="my-app" nonce="generated-server-nonce-value">
```

---

## 5. 커스텀 Container

iframe이나 별도 window 등 특정 DOM 노드에 스타일을 삽입해야 할 때 `container` 옵션을 사용합니다.

```jsx
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

// iframe 내부에 스타일 삽입
const iframeHead = document.querySelector('iframe').contentDocument.head

const cache = createCache({
  key: 'iframe',
  container: iframeHead
})

render(
  <CacheProvider value={cache}>
    <WidgetInsideIframe />
  </CacheProvider>
)
```

---

## 6. Stylis 플러그인 커스터마이징

`stylisPlugins` 배열을 직접 지정하면 기본 플러그인이 **교체**됩니다. 자동 벤더 프리픽싱을 유지하려면 `prefixer`를 명시적으로 포함해야 합니다.

```jsx
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

// RTL 지원 + 벤더 프리픽싱 유지
const rtlCache = createCache({
  key: 'rtl',
  stylisPlugins: [rtlPlugin, prefixer]
})
```

> **주의**: `prefixer`는 기본 `stylisPlugins`에 포함된 플러그인입니다. `stylisPlugins`를 커스터마이징하면서 `prefixer`를 생략하면 자동 벤더 프리픽싱이 비활성화됩니다.

---

## 7. 다중 Cache 사용

하나의 앱에서 여러 Emotion 캐시를 사용할 때는 각 캐시에 **고유한 `key`**를 지정해야 합니다.

```jsx
const mainCache = createCache({ key: 'main' })
const widgetCache = createCache({ key: 'widget' })

render(
  <CacheProvider value={mainCache}>
    <MainApp />
    <CacheProvider value={widgetCache}>
      <ThirdPartyWidget />
    </CacheProvider>
  </CacheProvider>
)
// main 스타일: <style data-emotion="main">
// widget 스타일: <style data-emotion="widget">
```

---

## Key Principles

| 원칙 | 설명 |
| ---- | ---- |
| **캐시 인스턴스** | `createCache`로 생성하여 `CacheProvider`의 `value`로 전달 |
| **key 필수** | 다중 캐시 사용 시 고유한 `key`로 클래스 충돌 방지 |
| **prefixer 수동 포함** | `stylisPlugins` 커스터마이징 시 `prefixer`를 명시적으로 추가해야 벤더 프리픽싱 유지 |
| **CSP 지원** | `nonce` 옵션으로 Content Security Policy 환경 대응 |
| **container 지정** | iframe, Shadow DOM 등 특정 DOM에 스타일 삽입 가능 |
