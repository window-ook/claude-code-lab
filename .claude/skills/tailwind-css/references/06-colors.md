# Colors

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/colors

---

## Contents

- [1. Default Color Palette](#1-default-color-palette)
- [2. Using Color Utilities](#2-using-color-utilities)
- [3. Opacity Adjustments](#3-opacity-adjustments)
- [4. Dark Mode Support](#4-dark-mode-support)
- [5. CSS Variables](#5-css-variables)
- [6. Customizing Colors](#6-customizing-colors)
- [7. Default Color Values](#7-default-color-values)
- [Key Principles](#key-principles)

---

## 1. Default Color Palette

Tailwind는 22개의 색상 패밀리와 각 11단계의 명도(50-950)를 포함하는 기본 색상 팔레트를 제공합니다.

### Color Families

| Category    | Colors                                                   |
| ----------- | -------------------------------------------------------- |
| **Warm**    | red, orange, amber, yellow                               |
| **Green**   | lime, green, emerald, teal                               |
| **Blue**    | cyan, sky, blue, indigo                                  |
| **Purple**  | violet, purple, fuchsia, pink, rose                      |
| **Neutral** | slate, gray, zinc, neutral, stone                        |
| **Special** | white, black                                             |

### Shade Scale

| Shade | Description      |
| ----- | ---------------- |
| 50    | 가장 밝은 색상   |
| 100   | 매우 밝은 색상   |
| 200   | 밝은 색상        |
| 300   | 중간 밝은 색상   |
| 400   | 중간 색상        |
| 500   | 기본 색상        |
| 600   | 중간 어두운 색상 |
| 700   | 어두운 색상      |
| 800   | 매우 어두운 색상 |
| 900   | 진한 색상        |
| 950   | 가장 어두운 색상 |

---

## 2. Using Color Utilities

색상 유틸리티는 모든 색상 관련 속성에 적용됩니다:

| Utility           | Description              | Example               |
| ----------------- | ------------------------ | --------------------- |
| `bg-*`            | 배경 색상                | `bg-blue-500`         |
| `text-*`          | 텍스트 색상              | `text-gray-900`       |
| `decoration-*`    | 텍스트 장식 색상         | `decoration-red-500`  |
| `border-*`        | 테두리 색상              | `border-gray-200`     |
| `outline-*`       | 아웃라인 색상            | `outline-blue-500`    |
| `shadow-*`        | 박스 그림자 색상         | `shadow-gray-500/50`  |
| `inset-shadow-*`  | 내부 그림자 색상         | `inset-shadow-black`  |
| `ring-*`          | 링 그림자 색상           | `ring-blue-500`       |
| `inset-ring-*`    | 내부 링 그림자 색상      | `inset-ring-gray-200` |
| `accent-*`        | 폼 컨트롤 강조 색상      | `accent-pink-500`     |
| `caret-*`         | 텍스트 입력 캐럿 색상    | `caret-blue-500`      |
| `fill-*`          | SVG fill 색상            | `fill-red-500`        |
| `stroke-*`        | SVG stroke 색상          | `stroke-blue-500`     |

### 실제 사용 예시

```html
<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
  <h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium">
    Writes upside-down
  </h3>
  <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
    The Zero Gravity Pen can be used to write in any orientation...
  </p>
</div>
```

---

## 3. Opacity Adjustments

`/` 문법을 사용하여 색상 불투명도를 조절합니다:

### 기본 불투명도

```html
<!-- 미리 정의된 불투명도 값 -->
<div class="bg-sky-500/10"></div>  <!-- 10% 불투명도 -->
<div class="bg-sky-500/20"></div>  <!-- 20% 불투명도 -->
<div class="bg-sky-500/50"></div>  <!-- 50% 불투명도 -->
<div class="bg-sky-500/75"></div>  <!-- 75% 불투명도 -->
<div class="bg-sky-500/100"></div> <!-- 100% 불투명도 (완전 불투명) -->
```

### 임의 불투명도 값

```html
<!-- 대괄호 문법으로 커스텀 불투명도 -->
<div class="bg-pink-500/[71.37%]"><!-- 71.37% 불투명도 --></div>

<!-- CSS 변수로 불투명도 지정 -->
<div class="bg-cyan-400/(--my-alpha-value)"><!-- CSS 변수 사용 --></div>
```

### 불투명도 활용 예시

```html
<!-- 오버레이 효과 -->
<div class="absolute inset-0 bg-black/50"><!-- 반투명 검정 오버레이 --></div>

<!-- 그림자 색상에 불투명도 적용 -->
<div class="shadow-lg shadow-blue-500/40"><!-- 40% 불투명도의 파란 그림자 --></div>

<!-- 테두리에 불투명도 적용 -->
<div class="border border-white/20"><!-- 20% 불투명도의 흰색 테두리 --></div>
```

---

## 4. Dark Mode Support

`dark:` 변형을 사용하여 다크 모드 색상을 적용합니다:

```html
<div class="bg-white dark:bg-gray-800">
  <h1 class="text-gray-900 dark:text-white">제목</h1>
  <p class="text-gray-600 dark:text-gray-300">본문 텍스트</p>
  <a class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
    링크
  </a>
</div>
```

### 다크 모드 색상 매핑 패턴

| 용도        | Light Mode     | Dark Mode          |
| ----------- | -------------- | ------------------ |
| 배경        | `bg-white`     | `dark:bg-gray-900` |
| 카드 배경   | `bg-gray-50`   | `dark:bg-gray-800` |
| 기본 텍스트 | `text-gray-900`| `dark:text-white`  |
| 보조 텍스트 | `text-gray-600`| `dark:text-gray-300`|
| 테두리      | `border-gray-200`| `dark:border-gray-700`|
| 링크        | `text-blue-600`| `dark:text-blue-400`|

---

## 5. CSS Variables

색상은 `--color-*` CSS 변수로 노출되어 커스텀 CSS에서 사용할 수 있습니다:

### 기본 사용

```css
@import "tailwindcss";

@layer components {
  .typography {
    color: var(--color-gray-950);

    a {
      color: var(--color-blue-500);

      &:hover {
        color: var(--color-blue-800);
      }
    }

    code {
      background-color: var(--color-gray-100);
      border: 1px solid var(--color-gray-200);
    }
  }
}
```

### CSS에서 불투명도 적용

```css
/* --alpha() 함수로 불투명도 적용 */
.overlay {
  background-color: --alpha(var(--color-gray-950) / 10%);
}

.backdrop {
  background-color: --alpha(var(--color-black) / 50%);
}
```

---

## 6. Customizing Colors

### 커스텀 색상 추가

```css
@import "tailwindcss";

@theme {
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
```

사용: `bg-midnight`, `text-tahiti`, `fill-bermuda`

### 커스텀 색상 팔레트 추가

```css
@import "tailwindcss";

@theme {
  --color-brand-50: oklch(0.97 0.02 250);
  --color-brand-100: oklch(0.94 0.04 250);
  --color-brand-200: oklch(0.88 0.08 250);
  --color-brand-300: oklch(0.80 0.12 250);
  --color-brand-400: oklch(0.70 0.16 250);
  --color-brand-500: oklch(0.60 0.20 250);
  --color-brand-600: oklch(0.50 0.20 250);
  --color-brand-700: oklch(0.42 0.18 250);
  --color-brand-800: oklch(0.35 0.15 250);
  --color-brand-900: oklch(0.28 0.12 250);
  --color-brand-950: oklch(0.20 0.08 250);
}
```

### 기본 색상 재정의

```css
@import "tailwindcss";

@theme {
  --color-gray-50: oklch(0.984 0.003 247.858);
  --color-gray-100: oklch(0.968 0.007 247.896);
  --color-gray-200: oklch(0.929 0.013 247.896);
  /* ... 나머지 gray 색상 ... */
}
```

### 기본 색상 비활성화

```css
@import "tailwindcss";

@theme {
  /* 특정 색상 패밀리 제거 */
  --color-lime-*: initial;
  --color-fuchsia-*: initial;
}
```

### 커스텀 팔레트만 사용

```css
@import "tailwindcss";

@theme {
  /* 모든 기본 색상 제거 */
  --color-*: initial;

  /* 커스텀 색상만 정의 */
  --color-white: #fff;
  --color-black: #000;
  --color-primary: #3f3cbb;
  --color-secondary: #121063;
  --color-accent: #3ab7bf;
}
```

### 외부 CSS 변수 참조

```css
@import "tailwindcss";

/* 외부에서 정의된 CSS 변수 */
:root {
  --acme-canvas-color: oklch(0.967 0.003 264.542);
}

[data-theme="dark"] {
  --acme-canvas-color: oklch(0.21 0.034 264.665);
}

/* Tailwind 테마에서 참조 */
@theme inline {
  --color-canvas: var(--acme-canvas-color);
}
```

사용: `bg-canvas`, `text-canvas`

---

## 7. Default Color Values

Tailwind v4는 OKLCH 색상 공간을 사용하여 지각적으로 균일한 색상 스케일링을 제공합니다.

### 주요 색상 예시

#### Red

| Shade | OKLCH Value                   |
| ----- | ----------------------------- |
| 50    | `oklch(0.971 0.013 17.38)`    |
| 500   | `oklch(0.637 0.237 25.331)`   |
| 950   | `oklch(0.258 0.092 26.042)`   |

#### Blue

| Shade | OKLCH Value                   |
| ----- | ----------------------------- |
| 50    | `oklch(0.97 0.014 254.604)`   |
| 500   | `oklch(0.623 0.214 259.815)`  |
| 950   | `oklch(0.282 0.091 267.935)`  |

#### Gray

| Shade | OKLCH Value                   |
| ----- | ----------------------------- |
| 50    | `oklch(0.985 0.002 247.839)`  |
| 500   | `oklch(0.551 0.027 264.364)`  |
| 950   | `oklch(0.13 0.028 261.692)`   |

### 특수 색상

| Color | Value   |
| ----- | ------- |
| white | `#fff`  |
| black | `#000`  |

---

## Key Principles

| Principle                 | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| Semantic Naming           | 색상 이름은 명도 기반 (50-950)으로 일관된 패턴 제공           |
| Opacity Modifier          | `/` 문법으로 간편하게 불투명도 조절                           |
| Dark Mode Ready           | `dark:` 변형으로 손쉬운 다크 모드 구현                        |
| CSS Variable Access       | `--color-*` 변수로 커스텀 CSS에서도 테마 색상 사용 가능       |
| OKLCH Color Space         | 지각적으로 균일한 색상 스케일링을 위한 OKLCH 사용             |
| Customizable              | `@theme`에서 색상 추가, 수정, 제거 가능                       |
| Design System Integration | 외부 CSS 변수 참조로 기존 디자인 시스템과 통합 가능           |
