# Styling with Utility Classes

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/styling-with-utility-classes

---

## Contents

- [1. Overview](#1-overview)
- [2. Key Benefits](#2-key-benefits)
- [3. Why Not Inline Styles?](#3-why-not-inline-styles)
- [4. Thinking in Utility Classes](#4-thinking-in-utility-classes)
- [5. Using Arbitrary Values](#5-using-arbitrary-values)
- [6. Complex Selectors](#6-complex-selectors)
- [7. When to Use Inline Styles](#7-when-to-use-inline-styles)
- [8. Managing Duplication](#8-managing-duplication)
- [9. Managing Style Conflicts](#9-managing-style-conflicts)
- [10. How Tailwind Works](#10-how-tailwind-works)
- [Key Principles](#key-principles)

---

## 1. Overview

Tailwind CSS는 **유틸리티 클래스** - 마크업에 직접 적용하는 단일 목적의 프레젠테이션 클래스 - 를 사용합니다. 전통적인 커스텀 CSS 클래스 방식과 다르지만 실질적인 이점을 제공합니다.

```html
<div
  class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
>
  <img class="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
  <div>
    <div class="text-xl font-medium text-black dark:text-white">ChitChat</div>
    <p class="text-gray-500 dark:text-gray-400">You have a new message!</p>
  </div>
</div>
```

---

## 2. Key Benefits

| Benefit             | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| **빠른 개발**       | 클래스 이름 짓기나 HTML/CSS 파일 전환 시간 절약                  |
| **안전한 변경**     | 유틸리티 클래스 수정은 해당 요소에만 영향                        |
| **쉬운 유지보수**   | 변경 사항이 스타일링 대상 요소에 국한됨                          |
| **코드 이식성**     | 구조와 스타일이 함께 있어 프로젝트 간 복사-붙여넣기 용이         |
| **CSS 비대화 방지** | 유틸리티 클래스는 재사용 가능하여 CSS가 선형적으로 증가하지 않음 |

---

## 3. Why Not Inline Styles?

유틸리티 클래스가 인라인 스타일과 비슷해 보이지만 주요 장점이 있습니다:

| Feature           | Utility Classes                    | Inline Styles         |
| ----------------- | ---------------------------------- | --------------------- |
| **디자인 제약**   | 미리 정의된 디자인 시스템에서 선택 | 임의의 매직 넘버 사용 |
| **상태 변형**     | hover, focus 등 상태 지원          | 불가능                |
| **반응형 디자인** | 반응형 변형으로 미디어 쿼리 지원   | 불가능                |
| **조합**          | CSS 변수로 여러 유틸리티 조합 가능 | 제한적                |

---

## 4. Thinking in Utility Classes

### Hover와 Focus 상태 스타일링

상태 변형을 접두사로 사용합니다:

```html
<button class="bg-sky-500 hover:bg-sky-700 ...">Save changes</button>
```

생성되는 CSS:

```css
.hover\:bg-sky-700 {
  &:hover {
    background-color: var(--color-sky-700);
  }
}
```

여러 조건을 스택으로 쌓기:

```html
<button class="bg-sky-500 disabled:hover:bg-sky-500 ...">Save changes</button>
```

### 미디어 쿼리와 브레이크포인트

반응형 디자인을 위해 브레이크포인트 접두사 사용:

```html
<div class="grid grid-cols-2 sm:grid-cols-3">
  <!-- ... -->
</div>
```

생성되는 CSS:

```css
.sm\:grid-cols-3 {
  @media (width >= 40rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

### 다크 모드

`dark:` 접두사로 다크 모드 스타일 적용:

```html
<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8">
  <h3 class="text-gray-900 dark:text-white">Writes upside-down</h3>
  <p class="text-gray-500 dark:text-gray-400">
    The Zero Gravity Pen can be used to write in any orientation...
  </p>
</div>
```

생성되는 CSS:

```css
.dark\:bg-gray-800 {
  @media (prefers-color-scheme: dark) {
    background-color: var(--color-gray-800);
  }
}
```

### 클래스 조합

여러 유틸리티가 CSS 변수로 함께 조합됩니다:

```html
<div class="blur-sm grayscale">
  <!-- ... -->
</div>
```

생성되는 CSS:

```css
.blur-sm {
  --tw-blur: blur(var(--blur-sm));
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-grayscale);
}
.grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-grayscale);
}
```

---

## 5. Using Arbitrary Values

대괄호 문법으로 일회성 값 사용:

```html
<!-- 일회성 색상 -->
<button class="bg-[#316ff6] ...">Sign in with Facebook</button>

<!-- 복잡한 커스텀 값 -->
<div class="grid grid-cols-[24rem_2.5rem_minmax(0,1fr)]">
  <!-- ... -->
</div>

<!-- calc() 같은 CSS 함수 -->
<div class="max-h-[calc(100dvh-(--spacing(6)))]">
  <!-- ... -->
</div>

<!-- 임의의 CSS 변수 -->
<div class="[--gutter-width:1rem] lg:[--gutter-width:2rem]">
  <!-- ... -->
</div>
```

---

## 6. Complex Selectors

### 복합 조건 조합

여러 조건을 변형 스택으로 조합:

```html
<button class="dark:lg:data-current:hover:bg-indigo-600 ...">
  <!-- ... -->
</button>
```

생성되는 CSS:

```css
@media (prefers-color-scheme: dark) and (width >= 64rem) {
  button[data-current]:hover {
    background-color: var(--color-indigo-600);
  }
}
```

### Group Hover

부모 호버 시 자식 요소 스타일링:

```html
<a href="#" class="group rounded-lg p-8">
  <!-- ... -->
  <span class="group-hover:underline">Read more…</span>
</a>
```

### 임의 변형 (Arbitrary Variants)

커스텀 셀렉터 작성:

```html
<div class="[&>[data-active]+span]:text-blue-600 ...">
  <span data-active><!-- ... --></span>
  <span>This text will be blue</span>
</div>
```

---

## 7. When to Use Inline Styles

인라인 스타일이 여전히 유용한 경우:

### 동적 값 소스

```tsx
export function BrandedButton({ buttonColor, textColor, children }) {
  return (
    <button
      style={{
        backgroundColor: buttonColor,
        color: textColor,
      }}
      className="rounded-md px-3 py-1.5 font-medium"
    >
      {children}
    </button>
  );
}
```

### 복잡한 임의 값

```html
<div
  style="grid-template-columns: 2fr max(0, var(--gutter-width)) calc(var(--gutter-width) + 10px)"
>
  <!-- ... -->
</div>
```

### CSS 변수와 함께 사용

```tsx
export function BrandedButton({
  buttonColor,
  buttonColorHover,
  textColor,
  children,
}) {
  return (
    <button
      style={{
        '--bg-color': buttonColor,
        '--bg-color-hover': buttonColorHover,
        '--text-color': textColor,
      }}
      className="bg-(--bg-color) text-(--text-color) hover:bg-(--bg-color-hover) ..."
    >
      {children}
    </button>
  );
}
```

---

## 8. Managing Duplication

### 루프 사용

중복 패턴을 루프로 렌더링:

```tsx
{
  contributors.map((user) => (
    <img
      key={user.handle}
      className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
      src={user.avatarUrl}
      alt={user.handle}
    />
  ));
}
```

### 멀티 커서 편집

에디터에서 여러 클래스 목록을 동시에 편집.

### 컴포넌트 사용

파일 간 재사용 패턴을 컴포넌트로 생성:

```tsx
export function VacationCard({ img, imgAlt, eyebrow, title, pricing, url }) {
  return (
    <div>
      <img className="rounded-lg" src={img} alt={imgAlt} />
      <div className="mt-4">
        <div className="text-xs font-bold text-sky-500">{eyebrow}</div>
        <div className="mt-1 font-bold text-gray-700">
          <a href={url} className="hover:underline">
            {title}
          </a>
        </div>
        <div className="mt-2 text-sm text-gray-600">{pricing}</div>
      </div>
    </div>
  );
}
```

### 커스텀 CSS 사용

작고 단순한 패턴에는 커스텀 CSS가 적합:

```html
<button class="btn-primary">Save changes</button>
```

```css
@import 'tailwindcss';

@layer components {
  .btn-primary {
    border-radius: calc(infinity * 1px);
    background-color: var(--color-violet-500);
    padding-inline: --spacing(5);
    padding-block: --spacing(2);
    font-weight: var(--font-weight-semibold);
    color: var(--color-white);
    box-shadow: var(--shadow-md);
    &:hover {
      @media (hover: hover) {
        background-color: var(--color-violet-700);
      }
    }
  }
}
```

---

## 9. Managing Style Conflicts

### 충돌하는 유틸리티 클래스

같은 속성을 대상으로 하는 두 클래스가 있으면 스타일시트에서 나중에 오는 것이 적용:

```html
<div class="grid flex">
  <!-- display: grid 적용됨 -->
</div>
```

**해결책**: 실제로 원하는 클래스만 추가:

```tsx
export function Example({ gridLayout }) {
  return <div className={gridLayout ? 'grid' : 'flex'}>{/* ... */}</div>;
}
```

### Important 수정자 사용

`!`로 유틸리티 강제 적용:

```html
<div class="bg-teal-500 bg-red-500!">
  <!-- bg-red-500 적용됨 -->
</div>
```

### Important 플래그

모든 유틸리티를 `!important`로 표시:

```css
@import 'tailwindcss' important;
```

### Prefix 옵션

충돌 방지를 위해 모든 생성 클래스에 접두사 추가:

```css
@import 'tailwindcss' prefix(tw);
```

결과: `.tw\:text-red-500`, `--tw-color-red-500` 등

---

## 10. How Tailwind Works

Tailwind는 소스 파일을 스캔하여 클래스 이름을 찾고 필요한 CSS만 생성합니다:

```tsx
export default function Button({ size, children }) {
  let sizeClasses = {
    md: 'px-4 py-2 rounded-md text-base',
    lg: 'px-5 py-3 rounded-lg text-lg',
  }[size];

  return (
    <button type="button" className={`font-bold ${sizeClasses}`}>
      {children}
    </button>
  );
}
```

이 동적 클래스 감지는 `bg-[#316ff6]` 같은 임의 값에서도 작동하여, 제약된 디자인 시스템을 유지하면서 강력한 커스터마이징을 가능하게 합니다.

---

## Key Principles

| Principle               | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| Utility-First           | 마크업에 직접 유틸리티 클래스 적용, 커스텀 CSS 최소화 |
| Design Constraints      | 미리 정의된 디자인 시스템 값 사용으로 일관성 유지     |
| State Variants          | hover, focus, active 등 상태에 접두사 변형 사용       |
| Responsive Design       | sm, md, lg 등 브레이크포인트 접두사로 반응형 구현     |
| Dark Mode Support       | dark: 접두사로 다크 모드 스타일 쉽게 적용             |
| Composition over Custom | 여러 유틸리티 조합 우선, 필요시에만 커스텀 CSS        |
| Component Extraction    | 중복 패턴은 컴포넌트로 추출하여 재사용                |
| Arbitrary Values        | 대괄호 문법으로 디자인 시스템 외 일회성 값 지원       |
