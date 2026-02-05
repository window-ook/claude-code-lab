# Theme variables

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/theme

---

## Contents

- [1. Overview](#1-overview)
- [2. Theme Variable Syntax](#2-theme-variable-syntax)
- [3. Theme Variable Namespaces](#3-theme-variable-namespaces)
- [4. Customizing Your Theme](#4-customizing-your-theme)
- [5. Using Theme Variables](#5-using-theme-variables)
- [6. Sharing Theme Across Projects](#6-sharing-theme-across-projects)
- [7. Default Theme Variables Reference](#7-default-theme-variables-reference)
- [Key Principles](#key-principles)

---

## 1. Overview

테마 변수는 `@theme` 지시어를 사용하여 정의하는 특수 CSS 변수로, 프로젝트에 어떤 유틸리티 클래스가 존재할지 결정합니다. 색상, 타이포그래피, 그림자, 브레이크포인트 등의 **디자인 토큰**을 저장합니다.

### @theme vs :root 차이점

| Directive | CSS 변수 생성 | 유틸리티 클래스 생성 |
| --------- | ------------- | -------------------- |
| `@theme`  | ✅            | ✅                   |
| `:root`   | ✅            | ❌                   |

- **`@theme`**: 디자인 토큰이 유틸리티 클래스에 매핑되어야 할 때 사용
- **`:root`**: 유틸리티 클래스 없이 일반 CSS 변수만 필요할 때 사용

---

## 2. Theme Variable Syntax

### 기본 예시

```css
@import 'tailwindcss';

@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

생성 결과:

- CSS 변수: `var(--color-mint-500)`
- 유틸리티 클래스: `bg-mint-500`, `text-mint-500`, `fill-mint-500` 등

### 다른 변수 참조하기

`inline` 옵션을 사용하여 다른 변수를 참조합니다:

```css
@theme inline {
  --font-sans: var(--font-inter);
}
```

`inline` 없이는 CSS 스코핑 규칙으로 인해 변수 해석이 실패할 수 있습니다.

### Static 테마 옵션

사용하지 않는 변수도 모두 CSS 변수로 생성합니다:

```css
@theme static {
  --color-primary: var(--color-red-500);
  --color-secondary: var(--color-blue-500);
}
```

### 애니메이션 키프레임

`@theme` 내에서 키프레임을 정의합니다:

```css
@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;

  @keyframes fade-in-scale {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

---

## 3. Theme Variable Namespaces

각 네임스페이스는 유틸리티 클래스 또는 변형에 매핑됩니다:

| Namespace          | 유틸리티       | 예시                               |
| ------------------ | -------------- | ---------------------------------- |
| `--color-*`        | 색상 유틸리티  | `bg-red-500`, `text-sky-300`       |
| `--font-*`         | 폰트 패밀리    | `font-sans`, `font-serif`          |
| `--text-*`         | 폰트 크기      | `text-xl`, `text-base`             |
| `--font-weight-*`  | 폰트 두께      | `font-bold`, `font-semibold`       |
| `--tracking-*`     | 자간           | `tracking-wide`                    |
| `--leading-*`      | 행간           | `leading-tight`, `leading-relaxed` |
| `--breakpoint-*`   | 반응형 변형    | `sm:*`, `md:*`                     |
| `--container-*`    | 컨테이너 쿼리  | `@sm:*`, 크기 유틸리티             |
| `--spacing-*`      | 패딩/마진/크기 | `px-4`, `max-h-16`                 |
| `--radius-*`       | 테두리 반경    | `rounded-sm`, `rounded-xl`         |
| `--shadow-*`       | 박스 그림자    | `shadow-md`, `shadow-lg`           |
| `--inset-shadow-*` | 내부 그림자    | `inset-shadow-xs`                  |
| `--drop-shadow-*`  | 드롭 그림자    | `drop-shadow-md`                   |
| `--blur-*`         | 블러 필터      | `blur-md`, `blur-lg`               |
| `--perspective-*`  | 원근           | `perspective-near`                 |
| `--aspect-*`       | 종횡비         | `aspect-video`                     |
| `--ease-*`         | 타이밍 함수    | `ease-out`, `ease-in`              |
| `--animate-*`      | 애니메이션     | `animate-spin`, `animate-bounce`   |

---

## 4. Customizing Your Theme

### 기본 테마 확장

새로운 테마 변수 추가:

```css
@import 'tailwindcss';

@theme {
  --font-script: Great Vibes, cursive;
}
```

HTML 사용:

```html
<p class="font-script">This will use the Great Vibes font family.</p>
```

### 기본값 오버라이드

단일 기본 변수 변경:

```css
@theme {
  --breakpoint-sm: 30rem; /* 기존 40rem에서 변경 */
}
```

### 전체 네임스페이스 교체

별표 문법으로 리셋 후 재정의:

```css
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-purple: #3f3cbb;
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
```

이제 커스텀 색상만 사용 가능합니다 (기본 `bg-red-500`은 존재하지 않음).

### 완전 커스텀 테마 사용

모든 기본값을 비활성화하고 커스텀 값만 정의:

```css
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
  --color-coral: oklch(0.74 0.17 40.24);
  --color-driftwood: oklch(0.79 0.06 74.59);
  --color-tide: oklch(0.49 0.08 205.88);
  --color-dusk: oklch(0.82 0.15 72.09);
}
```

---

## 5. Using Theme Variables

### 커스텀 CSS에서 사용

일관된 스타일링을 위해 디자인 토큰 참조:

```css
@import 'tailwindcss';

@layer components {
  .typography {
    p {
      font-size: var(--text-base);
      color: var(--color-gray-700);
    }
    h1 {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-950);
    }
  }
}
```

### 임의 값과 함께 사용

테마 변수를 임의 값과 `calc()`에서 사용:

```html
<div class="relative rounded-xl">
  <div class="absolute inset-px rounded-[calc(var(--radius-xl)-1px)]">
    <!-- 동심원 테두리 반경 -->
  </div>
</div>
```

### JavaScript에서 사용

`getComputedStyle`로 CSS 변수 참조:

```javascript
let styles = getComputedStyle(document.documentElement);
let shadow = styles.getPropertyValue('--shadow-xl');
```

애니메이션 라이브러리와 직접 사용:

```jsx
<motion.div animate={{ backgroundColor: 'var(--color-blue-500)' }} />
```

### 인라인 스타일에서 사용

```html
<div style="background-color: var(--color-mint-500)">
  <!-- 테마 변수 사용 -->
</div>
```

---

## 6. Sharing Theme Across Projects

공유 테마 파일 생성:

**./packages/brand/theme.css**

```css
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
  --color-coral: oklch(0.74 0.17 40.24);
  --color-driftwood: oklch(0.79 0.06 74.59);
  --color-tide: oklch(0.49 0.08 205.88);
  --color-dusk: oklch(0.82 0.15 72.09);
}
```

다른 프로젝트에서 import:

**./packages/admin/app.css**

```css
@import 'tailwindcss';
@import '../brand/theme.css';
```

NPM에 퍼블리시하거나 모노레포 설정에서 사용할 수 있습니다.

---

## 7. Default Theme Variables Reference

### Colors (색상)

전체 색상 팔레트: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose

중립 색상: slate, gray, zinc, neutral, stone

특수: black, white

```css
--color-red-50: oklch(97.1% 0.013 17.38);
--color-red-500: oklch(63.7% 0.237 25.331);
--color-red-950: oklch(25.8% 0.092 26.042);
```

### Typography (타이포그래피)

```css
/* 폰트 패밀리 */
--font-sans: ui-sans-serif, system-ui, sans-serif, ...;
--font-serif: ui-serif, Georgia, Cambria, ...;
--font-mono: ui-monospace, SFMono-Regular, ...;

/* 폰트 크기 */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
/* ... text-9xl까지 */

/* 폰트 두께 */
--font-weight-thin: 100;
--font-weight-normal: 400;
--font-weight-bold: 700;

/* 자간 */
--tracking-tighter: -0.05em;
--tracking-normal: 0em;
--tracking-widest: 0.1em;

/* 행간 */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-loose: 2;
```

### Spacing & Sizing (간격 및 크기)

```css
--spacing: 0.25rem; /* 모든 간격의 기본 단위 */
```

### Breakpoints (브레이크포인트)

```css
--breakpoint-sm: 40rem;
--breakpoint-md: 48rem;
--breakpoint-lg: 64rem;
--breakpoint-xl: 80rem;
--breakpoint-2xl: 96rem;
```

### Shadows (그림자)

```css
/* 박스 그림자 */
--shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), ...;
/* ... shadow-2xl까지 */

/* 내부 그림자 */
--inset-shadow-2xs: inset 0 1px rgb(0 0 0 / 0.05);

/* 드롭 그림자 */
--drop-shadow-xs: 0 1px 1px rgb(0 0 0 / 0.05);
/* ... drop-shadow-2xl까지 */
```

### Filters (필터)

```css
/* 블러 */
--blur-xs: 4px;
--blur-sm: 8px;
/* ... blur-3xl까지 */

/* 원근 */
--perspective-dramatic: 100px;
--perspective-near: 300px;
```

### Animations (애니메이션)

```css
--animate-spin: spin 1s linear infinite;
--animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
--animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
--animate-bounce: bounce 1s infinite;

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
```

### Border Radius (테두리 반경)

```css
--radius-xs: 0.125rem;
--radius-sm: 0.25rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
```

### Easing (이징)

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Key Principles

| Principle                 | Description                                                 |
| ------------------------- | ----------------------------------------------------------- |
| Use @theme for Utilities  | 유틸리티 클래스를 생성해야 하는 디자인 토큰에 `@theme` 사용 |
| Use :root for Variables   | 유틸리티 없이 변수만 필요할 때 `:root` 사용                 |
| Namespace Organization    | 네임스페이스별로 구성하여 자동 유틸리티 생성 활용           |
| Reference with var()      | CSS와 JavaScript에서 `var()`로 참조                         |
| Share Themes              | CSS 파일 또는 NPM 패키지로 테마 공유                        |
| Override with Asterisk    | `--namespace-*: initial` 문법으로 기본값 오버라이드         |
| Use inline for References | 다른 변수 참조 시 `@theme inline` 사용                      |
