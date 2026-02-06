# Server Side Rendering (SSR)

**Source**: https://emotion.sh/docs/ssr

---

## Contents

- [1. Overview](#1-overview)
- [2. Default 방식 (권장)](#2-default-방식-권장)
- [3. Advanced 방식](#3-advanced-방식)
- [4. API Reference](#4-api-reference)
- [5. Next.js 통합](#5-nextjs-통합)
- [6. Gatsby 통합](#6-gatsby-통합)
- [7. Puppeteer 프리렌더링](#7-puppeteer-프리렌더링)
- [Key Principles](#key-principles)

---

## 1. Overview

Emotion은 서버 사이드 렌더링을 위해 **두 가지 접근 방식**을 제공합니다. 각 방식은 서로 다른 트레이드오프를 가지며, 대부분의 경우 Default 방식으로 충분합니다.

| 방식 | 스트리밍 지원 | nth-child 호환 | 설정 필요 |
|---|---|---|---|
| Default | ✅ | ❌ | 없음 |
| Advanced | ❌ | ✅ | 필요 |

---

## 2. Default 방식 (권장)

Emotion 10+에서 `@emotion/react` 또는 `@emotion/styled` 사용 시 **별도 설정 없이 자동 동작**합니다. React의 `renderToString` 또는 `renderToNodeStream`을 그대로 사용할 수 있습니다.

```tsx
import { renderToString } from 'react-dom/server'
import App from './App'

// 추가 설정 없이 바로 사용 가능
const html = renderToString(<App />)
```

### 동작 원리

각 요소 바로 앞에 인라인 `<style>` 태그를 삽입합니다:

```html
<style data-emotion="css 21cs4">.css-21cs4 { font-size: 12px; }</style>
<div class="css-21cs4">Text</div>
```

### 제한 사항

스타일 태그가 마크업 중간에 삽입되므로 **`nth-child` 및 유사 셀렉터와 호환되지 않습니다**. `nth-child` 셀렉터가 필요한 경우 Advanced 방식을 사용해야 합니다.

---

## 3. Advanced 방식

`nth-child` 셀렉터 지원이 필요한 프로젝트를 위한 고급 통합 방식입니다. 커스텀 캐시 관리와 emotion server 유틸리티를 통해 더 세밀한 제어가 가능합니다.

### 서버 사이드 구현

```tsx
import { renderToString } from 'react-dom/server'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

// 1. 커스텀 캐시 생성
const cache = createCache({ key: 'css' })
const { extractCriticalToChunks, constructStyleTagsFromChunks } =
  createEmotionServer(cache)

// 2. CacheProvider로 앱 래핑하여 렌더링
const html = renderToString(
  <CacheProvider value={cache}>
    <App />
  </CacheProvider>
)

// 3. 사용된 스타일만 추출
const chunks = extractCriticalToChunks(html)
const styles = constructStyleTagsFromChunks(chunks)

// 4. HTML에 스타일 삽입
const fullHtml = `
  <html>
    <head>${styles}</head>
    <body><div id="root">${html}</div></body>
  </html>
`
```

### 클라이언트 사이드 하이드레이션

클라이언트에서 동일한 캐시 key로 생성하면 `data-emotion` 속성을 통해 **자동 하이드레이션**됩니다:

```tsx
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

const cache = createCache({ key: 'css' })

// 자동 하이드레이션 - 별도 설정 불필요
ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <CacheProvider value={cache}>
    <App />
  </CacheProvider>
)
```

---

## 4. API Reference

### renderStylesToString

인라인 크리티컬 CSS가 포함된 HTML 문자열을 반환합니다. 클라이언트 측 하이드레이션이 필요 없습니다.

```tsx
import { renderStylesToString } from '@emotion/server'

const html = renderStylesToString(renderToString(<App />))
```

### renderStylesToNodeStream

React의 스트리밍 API와 호환되는 Node Stream Writable을 제공합니다. 스트리밍 응답 중 실시간 스타일 삽입이 가능합니다.

```tsx
import { renderStylesToNodeStream } from '@emotion/server'

const stream = renderToNodeStream(<App />).pipe(renderStylesToNodeStream())
```

### extractCritical

렌더링된 마크업에서 실제 사용된 Emotion 규칙만 추출합니다. `html`, `ids`, `css` 속성을 포함하는 객체를 반환합니다. 글로벌 스타일은 모든 요소에 영향을 줄 수 있으므로 항상 포함됩니다.

```tsx
import { extractCritical } from '@emotion/server'

const { html, ids, css } = extractCritical(renderToString(<App />))
```

> **주의**: 동적 글로벌 스타일이 있는 경우 렌더링마다 새 캐시를 생성하여 다른 렌더링의 글로벌 스타일이 추출된 CSS에 섞이지 않도록 해야 합니다.

### hydrate

`extractCritical` 사용 시 클라이언트에서 필요합니다. `renderStylesToString`이나 `renderStylesToNodeStream`에서는 자동 하이드레이션되므로 불필요합니다.

```tsx
import { hydrate } from '@emotion/css'

// ids는 서버에서 extractCritical로 추출한 값
hydrate(ids)
```

---

## 5. Next.js 통합

Next.js v10+에서는 **별도 설정 없이 SSR이 자동 지원**됩니다.

v10 미만 버전에서는 `pages/_document.js`에 커스텀 Document 컴포넌트가 필요합니다:

```tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const cache = createCache({ key: 'css' })
    const { extractCriticalToChunks } = createEmotionServer(cache)

    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => (
          <CacheProvider value={cache}>
            <App {...props} />
          </CacheProvider>
        ),
      })

    const initialProps = await Document.getInitialProps(ctx)
    const chunks = extractCriticalToChunks(initialProps.html)

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        ...chunks.styles.map((chunk) => (
          <style
            data-emotion={`${chunk.key} ${chunk.ids.join(' ')}`}
            key={chunk.key}
            dangerouslySetInnerHTML={{ __html: chunk.css }}
          />
        )),
      ],
    }
  }
}
```

---

## 6. Gatsby 통합

`gatsby-plugin-emotion` 패키지로 간편하게 통합할 수 있으며, Babel 플러그인 등 추가 최적화를 지원합니다.

```bash
npm install gatsby-plugin-emotion
```

```js
// gatsby-config.js
module.exports = {
  plugins: ['gatsby-plugin-emotion'],
}
```

커스텀 구현이 필요한 경우 서버 렌더링(`gatsby-ssr.js`)과 브라우저 렌더링(`gatsby-browser.js`)에 별도 캐시 전략을 적용합니다. 이는 vanilla Emotion 또는 v10 이전 버전에만 해당됩니다.

---

## 7. Puppeteer 프리렌더링

Puppeteer로 프리렌더링할 때는 `speedy` 옵션을 비활성화해야 CSS가 DOM에 렌더링됩니다. 이 설정은 프리렌더링 시에만 적용해야 하며, speedy 모드는 런타임에서 상당한 성능 이점을 제공합니다.

```tsx
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

const cache = createCache({
  key: 'css',
  speedy: false, // 프리렌더링 시에만 false로 설정
})

function App() {
  return (
    <CacheProvider value={cache}>
      <MyApp />
    </CacheProvider>
  )
}
```

---

## Key Principles

| 원칙 | 설명 |
|---|---|
| **Default 방식 우선** | 특별한 이유 없으면 Default 방식 사용 (설정 불필요, 스트리밍 지원) |
| **nth-child 필요 시 Advanced** | `nth-child` 셀렉터가 필요한 경우에만 Advanced 방식 도입 |
| **렌더별 캐시 생성** | 동적 글로벌 스타일 사용 시 렌더링마다 새 캐시를 생성하여 스타일 누수 방지 |
| **Next.js v10+ 자동 지원** | Next.js v10 이상에서는 추가 설정 없이 SSR 자동 동작 |
| **Puppeteer speedy: false** | 프리렌더링 환경에서만 speedy 비활성화, 런타임에서는 활성 유지 |
| **스트리밍 vs nth-child** | 스트리밍이 필요하면 Default, nth-child가 필요하면 Advanced 선택 |
