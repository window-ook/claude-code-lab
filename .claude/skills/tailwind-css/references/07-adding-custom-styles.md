# Adding Custom Styles

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/adding-custom-styles

---

## Contents

- [1. Overview](#1-overview)
- [2. Customizing Your Theme](#2-customizing-your-theme)
- [3. Using Arbitrary Values](#3-using-arbitrary-values)
- [4. Arbitrary Properties](#4-arbitrary-properties)
- [5. Arbitrary Variants](#5-arbitrary-variants)
- [6. Handling Whitespace](#6-handling-whitespace)
- [7. Resolving Ambiguities](#7-resolving-ambiguities)
- [8. Using Custom CSS with @layer](#8-using-custom-css-with-layer)
- [9. Adding Custom Utilities](#9-adding-custom-utilities)
- [10. Adding Custom Variants](#10-adding-custom-variants)
- [Key Principles](#key-principles)

---

## 1. Overview

Tailwind CSS는 확장성과 커스터마이징을 위해 설계되었습니다. 프레임워크가 특정 요구사항을 처리하지 못할 때 사용할 수 있는 다양한 방법을 제공합니다.

---

## 2. Customizing Your Theme

`@theme` 지시어를 사용하여 색상 팔레트, 간격 스케일, 타이포그래피, 브레이크포인트 등 디자인 토큰을 커스터마이징합니다:

```css
@theme {
  --font-display: 'Satoshi', 'sans-serif';
  --breakpoint-3xl: 120rem;

  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);

  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

---

## 3. Using Arbitrary Values

대괄호 표기법을 사용하여 디자인 제약을 벗어나 임의의 값으로 클래스를 즉석에서 생성합니다:

### 기본 임의 값

```html
<!-- 특정 픽셀 값 -->
<div class="top-[117px]"><!-- ... --></div>

<!-- 반응형 수정자와 함께 -->
<div class="top-[117px] lg:top-[344px]"><!-- ... --></div>

<!-- 색상, 폰트 크기, 콘텐츠 -->
<div class="bg-[#bada55] text-[22px] before:content-['Festivus']">
  <!-- ... -->
</div>
```

### CSS 변수 사용

```html
<div class="fill-(--my-brand-color) ..."><!-- ... --></div>
```

`fill-[var(--my-brand-color)]`의 단축형으로, `var()` 함수가 자동으로 추가됩니다.

---

## 4. Arbitrary Properties

Tailwind에 없는 유틸리티를 대괄호 표기법으로 완전히 임의의 CSS로 작성:

```html
<!-- 단일 속성 -->
<div class="[mask-type:luminance]"><!-- ... --></div>

<!-- 수정자와 함께 -->
<div class="[mask-type:luminance] hover:[mask-type:alpha]"><!-- ... --></div>

<!-- 조건부 CSS 변수 -->
<div class="[--scroll-offset:56px] lg:[--scroll-offset:44px]"><!-- ... --></div>
```

---

## 5. Arbitrary Variants

pseudo-class, pseudo-element 및 기타 셀렉터 수정을 위해 즉석에서 셀렉터 수정:

```html
<ul role="list">
  {items.map((item) => (
    <li class="lg:[&:nth-child(-n+3)]:hover:underline">{item}</li>
  ))}
</ul>
```

---

## 6. Handling Whitespace

### 언더스코어 사용

공백 대신 언더스코어(`_`)를 사용하면 Tailwind가 빌드 시 자동으로 공백으로 변환합니다:

```html
<div class="grid grid-cols-[1fr_500px_2fr]"><!-- ... --></div>
```

### URL에서 언더스코어 유지

URL처럼 언더스코어가 일반적이고 공백이 유효하지 않은 상황에서는 Tailwind가 언더스코어를 유지합니다:

```html
<div class="bg-[url('/what_a_rush.png')]"><!-- ... --></div>
```

### 언더스코어 이스케이프

리터럴 언더스코어가 필요하지만 공백이 유효한 경우, 백슬래시로 이스케이프:

```html
<div class="before:content-['hello\_world']"><!-- ... --></div>
```

**JSX의 경우:** 백슬래시가 JavaScript 이스케이프 문자로 처리되지 않도록 `String.raw()` 사용:

```tsx
<div className={String.raw`before:content-['hello\_world']`}>
  <!-- ... -->
</div>
```

---

## 7. Resolving Ambiguities

Tailwind는 값에 따라 자동으로 모호함을 처리합니다. CSS 변수처럼 진정으로 모호한 경우 CSS 데이터 타입 힌트를 사용합니다:

```html
<!-- 자동 해결 -->
<div class="text-[22px]">...</div>
<!-- font-size -->
<div class="text-[#bada55]">...</div>
<!-- color -->

<!-- 모호함 - 타입 힌트 사용 -->
<div class="text-(length:--my-var)">...</div>
<!-- font-size -->
<div class="text-(color:--my-var)">...</div>
<!-- color -->
```

---

## 8. Using Custom CSS with @layer

### 일반 CSS

Tailwind와 함께 필요한 경우 일반 CSS 작성:

```css
@import 'tailwindcss';

.my-custom-style {
  /* ... */
}
```

### Base 스타일 추가

`html` 또는 `body`에 클래스를 사용하여 페이지 기본값 설정:

```html
<!doctype html>
<html lang="ko" class="bg-gray-100 font-serif text-gray-900">
  <!-- ... -->
</html>
```

또는 `@layer` 지시어를 사용하여 Tailwind의 base 레이어에 스타일 추가:

```css
@layer base {
  h1 {
    font-size: var(--text-2xl);
  }
  h2 {
    font-size: var(--text-xl);
  }
}
```

### Component 스타일 추가

유틸리티로 여전히 오버라이드할 수 있는 재사용 가능한 컴포넌트 클래스를 위해 `components` 레이어 사용:

```css
@layer components {
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-xl);
  }
}
```

필요에 따라 유틸리티로 컴포넌트 오버라이드:

```html
<!-- 카드처럼 보이지만 모서리가 직각 -->
<div class="card rounded-none"><!-- ... --></div>
```

서드파티 컴포넌트 스타일링에도 유용:

```css
@layer components {
  .select2-dropdown {
    /* ... */
  }
}
```

### 커스텀 CSS에서 변형 사용

`@variant` 지시어를 사용하여 커스텀 CSS 내에서 Tailwind 변형 적용:

```css
/* app.css */
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

컴파일 결과:

```css
.my-element {
  background: white;
  @media (prefers-color-scheme: dark) {
    background: black;
  }
}
```

### 중첩된 다중 변형

```css
.my-element {
  background: white;
  @variant dark {
    @variant hover {
      background: black;
    }
  }
}
```

---

## 9. Adding Custom Utilities

### 단순 유틸리티

`@utility` 지시어를 사용하여 커스텀 유틸리티 추가:

```css
@utility content-auto {
  content-visibility: auto;
}
```

HTML에서 사용:

```html
<div class="content-auto"><!-- ... --></div>
<div class="hover:content-auto"><!-- ... --></div>
<div class="lg:content-auto"><!-- ... --></div>
```

### 중첩이 있는 복잡한 유틸리티

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### 함수형 유틸리티

인자를 받는 유틸리티 등록:

```css
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

#### 테마 값 매칭

```css
@theme {
  --tab-size-2: 2;
  --tab-size-4: 4;
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

매칭: `tab-2`, `tab-4`, `tab-github`

#### Bare 값

```css
@utility tab-* {
  tab-size: --value(integer);
}
```

매칭: `tab-1`, `tab-76`

**사용 가능한 bare 타입:** `number`, `integer`, `ratio`, `percentage`

#### 리터럴 값

```css
@utility tab-* {
  tab-size: --value('inherit', 'initial', 'unset');
}
```

매칭: `tab-inherit`, `tab-initial`, `tab-unset`

#### 임의 값

```css
@utility tab-* {
  tab-size: --value([integer]);
}
```

매칭: `tab-[1]`, `tab-[76]`

**사용 가능한 arbitrary 타입:** `absolute-size`, `angle`, `bg-size`, `color`, `family-name`, `generic-name`, `image`, `integer`, `length`, `line-width`, `number`, `percentage`, `position`, `ratio`, `relative-size`, `url`, `vector`, `*`

#### 테마, Bare, 임의 값 조합

```css
@theme {
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value([integer]);
  tab-size: --value(integer);
  tab-size: --value(--tab-size-*);
}
```

다른 처리 방식:

```css
@utility opacity-* {
  opacity: --value([percentage]);
  opacity: calc(--value(integer) * 1%);
  opacity: --value(--opacity-*);
}
```

#### 음수 값

```css
@utility inset-* {
  inset: --spacing(--value(integer));
  inset: --value([percentage], [length]);
}

@utility -inset-* {
  inset: --spacing(--value(integer) * -1);
  inset: calc(--value([percentage], [length]) * -1);
}
```

#### 수정자 (Modifiers)

`--modifier()`를 사용하여 유틸리티에서 수정자 처리:

```css
@utility text-* {
  font-size: --value(--text-*, [length]);
  line-height: --modifier(--leading-*, [length], [*]);
}
```

#### 분수 (Fractions)

분수 유틸리티를 위해 `ratio` 데이터 타입 사용:

```css
@utility aspect-* {
  aspect-ratio: --value(--aspect-ratio-*, ratio, [ratio]);
}
```

매칭: `aspect-square`, `aspect-3/4`, `aspect-[7/9]`

---

## 10. Adding Custom Variants

### @custom-variant 지시어 사용

```css
@custom-variant theme-midnight {
  &:where([data-theme='midnight'] *) {
    @slot;
  }
}
```

HTML에서 사용:

```html
<html data-theme="midnight">
  <button class="theme-midnight:bg-black ..."></button>
</html>
```

### 단축 문법 (중첩 불필요)

```css
@custom-variant theme-midnight (&:where([data-theme='midnight'] *));
```

### 중첩이 있는 다중 규칙

```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

---

## Key Principles

| Principle        | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| @theme           | 디자인 토큰(색상, 간격, 폰트 등) 커스터마이징                     |
| Arbitrary Values | 대괄호(`[]`) 표기법으로 디자인 제약 벗어나기                      |
| Arbitrary Props  | `[property:value]` 형식으로 임의 CSS 속성 사용                    |
| Whitespace       | 공백 대신 언더스코어 사용, 필요시 이스케이프                      |
| Type Hints       | 모호한 경우 CSS 타입 힌트로 명확화                                |
| @layer           | base, components, utilities 레이어로 커스텀 스타일 구성           |
| @utility         | 커스텀 유틸리티 정의 (단순, 복잡, 함수형)                         |
| @custom-variant  | 커스텀 변형 정의 (테마, 미디어 쿼리 등)                           |
| @variant         | 커스텀 CSS 내에서 Tailwind 변형 사용                              |
