# Functions and Directives

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/functions-and-directives

---

## Contents

- [1. Overview](#1-overview)
- [2. @import](#2-import)
- [3. @theme](#3-theme)
- [4. @source](#4-source)
- [5. @utility](#5-utility)
- [6. @variant](#6-variant)
- [7. @custom-variant](#7-custom-variant)
- [8. @apply](#8-apply)
- [9. @reference](#9-reference)
- [10. @layer](#10-layer)
- [11. Functions](#11-functions)
- [12. Legacy Compatibility (v3.x)](#12-legacy-compatibility-v3x)
- [Key Principles](#key-principles)

---

## 1. Overview

Tailwind CSS v4는 CSS-first 설정 방식을 채택하여 JavaScript 설정 파일 없이 CSS 디렉티브와 함수만으로 프레임워크를 커스터마이징할 수 있습니다.

| Category       | Items                                                    |
| -------------- | -------------------------------------------------------- |
| **Directives** | @import, @theme, @source, @utility, @variant, @custom-variant, @apply, @reference, @layer |
| **Functions**  | --alpha(), --spacing(), --theme()                        |
| **Legacy**     | @config, @plugin, theme()                                |

---

## 2. @import

Tailwind CSS 및 다른 CSS 파일을 인라인으로 가져옵니다:

```css
/* Tailwind CSS 전체 가져오기 */
@import "tailwindcss";

/* 다른 CSS 파일 가져오기 */
@import "./components.css";
@import "./utilities.css";
```

### 옵션과 함께 사용

```css
/* important 모드 활성화 */
@import "tailwindcss" important;

/* prefix 추가 */
@import "tailwindcss" prefix(tw);

/* 복합 옵션 */
@import "tailwindcss" prefix(tw) important;
```

---

## 3. @theme

커스텀 디자인 토큰(폰트, 색상, 브레이크포인트 등)을 정의합니다:

```css
@import "tailwindcss";

@theme {
  /* 폰트 */
  --font-display: "Satoshi", "sans-serif";
  --font-body: "Inter", "sans-serif";

  /* 브레이크포인트 */
  --breakpoint-3xl: 120rem;

  /* 색상 팔레트 */
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);

  /* 이징 함수 */
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);

  /* 스페이싱 */
  --spacing-18: 4.5rem;
  --spacing-128: 32rem;
}
```

### @theme 변형

| Variant          | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `@theme`         | 기본 테마에 값 추가/덮어쓰기                          |
| `@theme inline`  | `:root`에 CSS 변수 생성하지 않음, 유틸리티만 생성     |
| `@theme static`  | CSS 변수가 아닌 정적 값으로 컴파일                    |

```css
/* 외부 CSS 변수 참조 */
@theme inline {
  --color-primary: var(--brand-primary);
  --color-secondary: var(--brand-secondary);
}
```

### 기본값 초기화

```css
@theme {
  /* 특정 색상 제거 */
  --color-lime-*: initial;

  /* 모든 기본 색상 제거 */
  --color-*: initial;
}
```

---

## 4. @source

콘텐츠 감지를 위한 소스 파일을 명시적으로 지정합니다:

```css
@import "tailwindcss";

/* 외부 패키지의 컴포넌트 스캔 */
@source "../node_modules/@my-company/ui-lib";

/* 특정 디렉토리 추가 */
@source "../shared-components";

/* 글로브 패턴 사용 */
@source "../content/**/*.md";
```

### 사용 시나리오

| Scenario                      | Example                                      |
| ----------------------------- | -------------------------------------------- |
| 외부 UI 라이브러리            | `@source "../node_modules/@acme/ui";`        |
| 모노레포 공유 패키지          | `@source "../../packages/shared";`           |
| CMS 콘텐츠 파일               | `@source "../content/**/*.mdx";`             |
| 스토리북 스토리               | `@source "../stories/**/*.stories.tsx";`     |

---

## 5. @utility

Tailwind 변형(hover, focus, lg 등)과 함께 작동하는 커스텀 유틸리티를 추가합니다:

```css
@import "tailwindcss";

/* 단순 유틸리티 */
@utility tab-4 {
  tab-size: 4;
}

/* 복합 유틸리티 */
@utility content-auto {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}

/* 스크롤 관련 유틸리티 */
@utility scrollbar-hidden {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### 사용 예시

```html
<!-- 변형과 함께 사용 가능 -->
<pre class="tab-4 hover:tab-8 lg:tab-2">
  <!-- 코드 -->
</pre>

<div class="content-auto">
  <!-- 긴 콘텐츠 -->
</div>
```

---

## 6. @variant

기존 CSS 규칙에 Tailwind 변형을 적용합니다:

```css
.my-element {
  background: white;

  @variant dark {
    background: black;
  }

  @variant hover {
    background: gray;
  }

  @variant dark, hover {
    background: #333;
  }
}
```

### 컴파일 결과

```css
.my-element {
  background: white;
}

@media (prefers-color-scheme: dark) {
  .my-element {
    background: black;
  }
}

.my-element:hover {
  background: gray;
}

@media (prefers-color-scheme: dark) {
  .my-element:hover {
    background: #333;
  }
}
```

---

## 7. @custom-variant

프로젝트에 커스텀 변형을 추가합니다:

```css
@import "tailwindcss";

/* 테마 기반 변형 */
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
@custom-variant theme-light (&:where([data-theme="light"] *));

/* 상태 기반 변형 */
@custom-variant loading (&:where([data-loading="true"] *));
@custom-variant error (&:where([aria-invalid="true"]));

/* 부모 상태 변형 */
@custom-variant sidebar-open (&:where([data-sidebar="open"] *));
```

### 사용 예시

```html
<body data-theme="midnight">
  <div class="theme-midnight:bg-black theme-midnight:text-white">
    <!-- 다크 테마 적용 -->
  </div>
</body>

<div data-loading="true">
  <button class="loading:opacity-50 loading:pointer-events-none">
    Submit
  </button>
</div>
```

---

## 8. @apply

기존 유틸리티 클래스를 커스텀 CSS에 인라인으로 적용합니다:

```css
@import "tailwindcss";

@layer components {
  /* 버튼 컴포넌트 */
  .btn {
    @apply px-4 py-2 rounded-lg font-semibold;
  }

  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600;
  }

  .btn-secondary {
    @apply btn bg-gray-200 text-gray-800 hover:bg-gray-300;
  }

  /* 폼 요소 */
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }

  /* 서드파티 라이브러리 스타일링 */
  .select2-dropdown {
    @apply rounded-b-lg shadow-md;
  }

  .select2-search {
    @apply rounded border border-gray-300;
  }

  .select2-results__group {
    @apply text-lg font-bold text-gray-900;
  }
}
```

### @apply 사용 권장 사항

| 상황                          | 권장                                         |
| ----------------------------- | -------------------------------------------- |
| 서드파티 라이브러리 스타일링  | @apply 사용 권장                             |
| 반복되는 컴포넌트 패턴        | React/Vue 컴포넌트 추출 권장                 |
| 작은 유틸리티 조합            | 인라인 유틸리티 클래스 권장                  |
| CMS/마크다운 스타일링         | @apply 또는 @layer 사용 권장                 |

---

## 9. @reference

컴포넌트 `<style>` 블록에서 테마 변수와 유틸리티를 사용하기 위해 참조합니다. CSS 출력을 중복하지 않습니다:

### Vue에서 사용

```vue
<template>
  <h1>Hello world!</h1>
</template>

<style>
  @reference "../../app.css";

  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

### 기본 테마만 참조

```vue
<style>
  @reference "tailwindcss";

  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

### Subpath Imports 지원

**package.json:**
```json
{
  "imports": {
    "#app.css": "./src/css/app.css"
  }
}
```

**컴포넌트:**
```vue
<style>
  @reference "#app.css";

  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

---

## 10. @layer

CSS 규칙을 Tailwind의 레이어에 추가합니다:

```css
@import "tailwindcss";

/* Base 레이어: 요소 기본 스타일 */
@layer base {
  html {
    font-family: var(--font-body);
  }

  h1, h2, h3 {
    font-family: var(--font-display);
  }

  a {
    color: var(--color-blue-500);
    text-decoration: underline;
  }
}

/* Components 레이어: 컴포넌트 스타일 */
@layer components {
  .card {
    @apply rounded-lg bg-white p-6 shadow-md;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
}

/* Utilities 레이어: 유틸리티 확장 */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### 레이어 우선순위

| Layer        | Priority | Description                              |
| ------------ | -------- | ---------------------------------------- |
| `base`       | 1 (낮음) | HTML 요소 기본 스타일                    |
| `components` | 2        | 재사용 가능한 컴포넌트 클래스            |
| `utilities`  | 3 (높음) | 단일 목적 유틸리티 클래스                |

---

## 11. Functions

### --alpha()

색상의 불투명도를 조절합니다:

**입력 CSS:**
```css
.my-element {
  color: --alpha(var(--color-lime-300) / 50%);
  background: --alpha(var(--color-blue-500) / 25%);
}
```

**컴파일 결과:**
```css
.my-element {
  color: color-mix(in oklab, var(--color-lime-300) 50%, transparent);
  background: color-mix(in oklab, var(--color-blue-500) 25%, transparent);
}
```

### --spacing()

테마 기반 스페이싱 값을 생성합니다:

**입력 CSS:**
```css
.my-element {
  margin: --spacing(4);
  padding: --spacing(2) --spacing(4);
}
```

**컴파일 결과:**
```css
.my-element {
  margin: calc(var(--spacing) * 4);
  padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
}
```

**임의 값에서 사용:**
```html
<div class="py-[calc(--spacing(4)-1px)]">
  <!-- 1px 보정된 패딩 -->
</div>

<div class="m-[--spacing(8)]">
  <!-- 테마 스페이싱 참조 -->
</div>
```

### --theme()

테마 값에 접근합니다:

```css
.my-element {
  font-family: --theme(--font-display);
  color: --theme(--color-brand-500);
}
```

---

## 12. Legacy Compatibility (v3.x)

### @config

레거시 JavaScript 설정 파일을 로드합니다:

```css
@config "../../tailwind.config.js";
```

> **주의:** `corePlugins`, `safelist`, `separator` 옵션은 v4.0에서 지원되지 않습니다.

### @plugin

레거시 JavaScript 플러그인을 로드합니다:

```css
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/container-queries";
```

### theme() (deprecated)

점 표기법으로 테마 값에 접근합니다:

```css
/* 레거시 방식 (권장하지 않음) */
.my-element {
  margin: theme(spacing.12);
  color: theme(colors.blue.500);
}

/* 권장 방식: CSS 변수 사용 */
.my-element {
  margin: var(--spacing-12);
  color: var(--color-blue-500);
}
```

---

## Key Principles

| Principle                  | Description                                                    |
| -------------------------- | -------------------------------------------------------------- |
| CSS-First Configuration    | JavaScript 설정 없이 CSS 디렉티브로 모든 설정 가능             |
| @theme for Design Tokens   | 색상, 폰트, 스페이싱 등 디자인 토큰을 @theme에서 중앙 관리     |
| @utility for Extensions    | 커스텀 유틸리티는 @utility로 정의하여 변형 지원                |
| @apply Sparingly           | @apply는 서드파티 스타일링에 주로 사용, 컴포넌트 추출 권장     |
| @layer for Organization    | base, components, utilities 레이어로 스타일 우선순위 관리      |
| CSS Variables Preferred    | theme() 대신 CSS 변수(--color-*, --spacing-*) 사용 권장        |
| @reference for Components  | Vue/Svelte 컴포넌트에서 @reference로 테마 참조                 |
