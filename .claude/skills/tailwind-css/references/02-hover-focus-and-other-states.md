# Hover, Focus, and Other States

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/hover-focus-and-other-states

---

## Contents

- [1. Overview](#1-overview)
- [2. Pseudo-Classes](#2-pseudo-classes)
- [3. Form State Variants](#3-form-state-variants)
- [4. Styling Based on Parent State (Group)](#4-styling-based-on-parent-state-group)
- [5. Styling Based on Sibling State (Peer)](#5-styling-based-on-sibling-state-peer)
- [6. Pseudo-Elements](#6-pseudo-elements)
- [7. Media and Feature Queries](#7-media-and-feature-queries)
- [8. Attribute Selectors](#8-attribute-selectors)
- [9. Child Selectors](#9-child-selectors)
- [10. Custom Variants](#10-custom-variants)
- [Quick Reference](#quick-reference)

---

## 1. Overview

Tailwind CSS는 **variants**를 사용하여 특정 조건에서 유틸리티 클래스를 조건부로 적용합니다.

### 전통적인 CSS vs Tailwind 접근 방식

**전통적인 CSS:**

```css
.btn-primary {
  background-color: #0ea5e9;
}
.btn-primary:hover {
  background-color: #0369a1;
}
```

**Tailwind CSS:**

```html
<button class="bg-sky-500 hover:bg-sky-700">Save changes</button>
```

---

## 2. Pseudo-Classes

### 인터랙티브 상태: hover, focus, active

```html
<button
  class="bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700"
>
  Save changes
</button>
```

| Variant          | CSS                 | 설명                        |
| ---------------- | ------------------- | --------------------------- |
| `hover`          | `&:hover`           | 마우스 호버 시              |
| `focus`          | `&:focus`           | 포커스 시                   |
| `focus-within`   | `&:focus-within`    | 자식 요소 포커스 시         |
| `focus-visible`  | `&:focus-visible`   | 키보드 포커스 시            |
| `active`         | `&:active`          | 클릭/터치 중                |
| `visited`        | `&:visited`         | 방문한 링크                 |

### 구조적 Pseudo-Classes

#### first, last, only

```html
<ul role="list">
  {people.map((person) => (
    <li class="flex py-4 first:pt-0 last:pb-0">
      <!-- ... -->
    </li>
  ))}
</ul>
```

#### odd, even

```html
<tbody>
  {people.map((person) => (
    <tr class="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900/50 dark:even:bg-gray-950">
      <!-- ... -->
    </tr>
  ))}
</tbody>
```

#### nth-\* 변형

```html
<div
  class="nth-3:underline nth-last-5:underline nth-of-type-4:underline nth-last-of-type-6:underline"
>
  <!-- 임의 값: nth-[2n+1_of_li] -->
</div>
```

| Variant              | CSS                      |
| -------------------- | ------------------------ |
| `first`              | `&:first-child`          |
| `last`               | `&:last-child`           |
| `only`               | `&:only-child`           |
| `odd`                | `&:nth-child(odd)`       |
| `even`               | `&:nth-child(even)`      |
| `first-of-type`      | `&:first-of-type`        |
| `last-of-type`       | `&:last-of-type`         |
| `empty`              | `&:empty`                |

### :has() - 자손 기반 스타일링

```html
<label
  class="has-checked:bg-indigo-50 has-checked:text-indigo-900 has-checked:ring-indigo-200"
>
  <svg fill="currentColor"><!-- ... --></svg>
  Google Pay
  <input type="radio" class="checked:border-indigo-500" />
</label>
```

**사용 사례:** `has-[:focus]` (내부 포커스), `has-[img]` (이미지 포함), `has-[a]` (링크 포함)

### :not() - 부정 Pseudo-Class

```html
<button class="bg-indigo-600 hover:not-focus:bg-indigo-700">
  <!-- 포커스가 아닐 때만 호버 스타일 적용 -->
</button>

<div class="not-supports-[display:grid]:flex">
  <!-- grid 미지원 브라우저용 폴백 -->
</div>
```

---

## 3. Form State Variants

```html
<input
  type="text"
  value="tbone"
  disabled
  class="invalid:border-pink-500 invalid:text-pink-600
    focus:border-sky-500 focus:outline focus:outline-sky-500
    focus:invalid:border-pink-500 focus:invalid:outline-pink-500
    disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500
    dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20"
/>
```

| Variant              | 설명                                    |
| -------------------- | --------------------------------------- |
| `required`           | 필수 입력 필드                          |
| `optional`           | 선택 입력 필드                          |
| `disabled`           | 비활성화 상태                           |
| `enabled`            | 활성화 상태                             |
| `checked`            | 체크된 상태 (checkbox, radio)           |
| `indeterminate`      | 불확정 상태                             |
| `default`            | 기본 선택된 옵션                        |
| `valid`              | 유효한 입력                             |
| `invalid`            | 유효하지 않은 입력                      |
| `user-valid`         | 사용자 상호작용 후 유효                 |
| `user-invalid`       | 사용자 상호작용 후 무효                 |
| `in-range`           | 범위 내 값                              |
| `out-of-range`       | 범위 외 값                              |
| `placeholder-shown`  | placeholder 표시 중                     |
| `autofill`           | 브라우저 자동완성됨                     |
| `read-only`          | 읽기 전용                               |

---

## 4. Styling Based on Parent State (Group)

부모 요소의 상태에 따라 자식 요소 스타일링:

```html
<a href="#" class="group">
  <div>
    <svg class="stroke-sky-500 group-hover:stroke-white" fill="none">
      <!-- ... -->
    </svg>
    <h3 class="text-gray-900 group-hover:text-white">New project</h3>
  </div>
  <p class="text-gray-500 group-hover:text-white">
    Create a new project from a variety of starting templates.
  </p>
</a>
```

**모든 pseudo-class와 함께 사용 가능:** `group-focus`, `group-active`, `group-odd`

### 이름 있는 중첩 그룹

```html
<ul role="list">
  {people.map((person) => (
    <li class="group/item">
      <!-- ... -->
      <a class="group/edit invisible group-hover/item:visible" href="#">
        <span class="group-hover/edit:text-gray-700">Call</span>
        <svg class="group-hover/edit:translate-x-0.5"><!-- ... --></svg>
      </a>
    </li>
  ))}
</ul>
```

### 임의 그룹

```html
<div class="group is-published">
  <div class="hidden group-[.is-published]:block">Published</div>
</div>

<!-- 앰퍼샌드로 제어 -->
<div class="group">
  <div class="group-[:nth-of-type(3)_&]:block"><!-- ... --></div>
</div>
```

### 암시적 그룹 (in-\* 변형)

```html
<div tabindex="0">
  <div class="opacity-50 in-focus:opacity-100">
    <!-- 모든 부모의 포커스 상태에 반응 -->
  </div>
</div>
```

### Group :has()

```html
<div class="group">
  <img src="..." />
  <h4>Spencer Sharp</h4>
  <svg class="hidden group-has-[a]:block"><!-- ... --></svg>
  <p>Product Designer at <a href="...">planeteria.tech</a></p>
</div>
```

---

## 5. Styling Based on Sibling State (Peer)

형제 요소의 상태에 따라 스타일링:

```html
<form>
  <label class="block">
    <span>Email</span>
    <input type="email" class="peer" />
    <p class="invisible peer-invalid:visible">
      Please provide a valid email address.
    </p>
  </label>
</form>
```

**사용 가능:** `peer-focus`, `peer-required`, `peer-disabled`, `peer-checked`, `peer-invalid`

**중요:** Peer 마커는 **이전 형제**에서만 작동합니다 (CSS 후속 형제 결합자 제한).

### 이름 있는 Peer

```html
<fieldset>
  <legend>Published status</legend>
  <input id="draft" class="peer/draft" type="radio" name="status" checked />
  <label for="draft" class="peer-checked/draft:text-sky-500">Draft</label>
  <input id="published" class="peer/published" type="radio" name="status" />
  <label for="published" class="peer-checked/published:text-sky-500">Published</label>
  <div class="hidden peer-checked/draft:block">
    Drafts are only visible to administrators.
  </div>
  <div class="hidden peer-checked/published:block">
    Your post will be publicly visible on your site.
  </div>
</fieldset>
```

### 임의 Peer

```html
<form>
  <label for="email">Email:</label>
  <input id="email" type="email" class="is-dirty peer" required />
  <div class="peer-[.is-dirty]:peer-required:block hidden">
    This field is required.
  </div>
</form>
```

### Peer :has()

```html
<div>
  <label class="peer">
    <input type="checkbox" name="todo[1]" checked />
    Create a to do list
  </label>
  <svg class="peer-has-checked:hidden"><!-- ... --></svg>
</div>
```

---

## 6. Pseudo-Elements

### ::before와 ::after

```html
<label>
  <span class="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
    Email
  </span>
  <input type="email" placeholder="you@example.com" />
</label>
```

**참고:** Tailwind는 기본적으로 `content: ''`를 자동 추가합니다.

```html
<blockquote class="text-center text-2xl font-semibold italic">
  When you look
  <span
    class="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink-500"
  >
    <span class="relative text-white">annoyed</span>
  </span>
  all the time, people think that you're busy.
</blockquote>
```

**권장사항:** DOM에 있어야 할 콘텐츠는 `::before`/`::after` 대신 실제 HTML 요소 사용.

### ::placeholder

```html
<input
  class="placeholder:text-gray-500 placeholder:italic"
  placeholder="Search for anything..."
  type="text"
/>
```

### ::file

```html
<input
  type="file"
  class="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2
    file:text-sm file:font-semibold file:text-violet-700
    hover:file:bg-violet-100"
/>
```

### ::marker

```html
<ul role="list" class="list-disc marker:text-sky-400">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

**참고:** marker 변형은 상속 가능하므로 부모에 적용하면 반복을 피할 수 있습니다.

### ::selection

```html
<div class="selection:bg-fuchsia-300 selection:text-fuchsia-900">
  <p>So I started to walk into the water...</p>
</div>

<!-- 사이트 전체 적용 -->
<body class="selection:bg-pink-300">
  <!-- ... -->
</body>
```

### ::first-line과 ::first-letter

```html
<p
  class="first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold
    first-line:tracking-widest first-line:uppercase"
>
  Well, let me tell you something, funny boy...
</p>
```

### ::backdrop

```html
<dialog class="backdrop:bg-gray-50">
  <form method="dialog">
    <!-- ... -->
  </form>
</dialog>
```

---

## 7. Media and Feature Queries

### 반응형 브레이크포인트

```html
<!-- 뷰포트 기반 -->
<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
  <!-- 모바일 3열, 중간 4열, 대형 6열 -->
</div>

<!-- 컨테이너 기반 -->
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- 부모 컨테이너 너비에 반응 -->
  </div>
</div>
```

| Viewport Breakpoint | 크기      |
| ------------------- | --------- |
| `sm`                | 40rem     |
| `md`                | 48rem     |
| `lg`                | 64rem     |
| `xl`                | 80rem     |
| `2xl`               | 96rem     |

**추가 변형:** `min-[...]`, `max-sm`, `max-md`, `max-lg`, `max-xl`, `max-2xl`, `max-[...]`

### prefers-color-scheme (다크 모드)

```html
<div class="bg-white dark:bg-gray-900">
  <h3 class="text-gray-900 dark:text-white">Writes upside-down</h3>
  <p class="text-gray-500 dark:text-gray-400">
    The Zero Gravity Pen can be used to write in any orientation...
  </p>
</div>
```

### prefers-reduced-motion

```html
<button type="button" class="bg-indigo-500" disabled>
  <svg class="animate-spin motion-reduce:hidden" viewBox="0 0 24 24">
    <!-- ... -->
  </svg>
  Processing...
</button>

<!-- 대안 접근 -->
<button class="motion-safe:transition motion-safe:hover:-translate-x-0.5">
  Save changes
</button>
```

### prefers-contrast

```html
<input
  class="border-gray-200 placeholder-gray-400
    contrast-more:border-gray-400 contrast-more:placeholder-gray-500"
/>
<p class="text-gray-600 opacity-10 contrast-more:opacity-100">
  We need this to steal your identity.
</p>
```

### 기타 미디어 쿼리 변형

| Variant            | 미디어 쿼리                              |
| ------------------ | ---------------------------------------- |
| `portrait`         | `@media (orientation: portrait)`         |
| `landscape`        | `@media (orientation: landscape)`        |
| `print`            | `@media print`                           |
| `noscript`         | `@media (scripting: none)`               |
| `forced-colors`    | `@media (forced-colors: active)`         |
| `inverted-colors`  | `@media (inverted-colors: inverted)`     |
| `pointer-fine`     | `@media (pointer: fine)`                 |
| `pointer-coarse`   | `@media (pointer: coarse)`               |

### @supports

```html
<div class="flex supports-[display:grid]:grid"><!-- ... --></div>

<!-- 속성만 확인 -->
<div
  class="bg-black/75 supports-backdrop-filter:bg-black/25 supports-backdrop-filter:backdrop-blur"
>
  <!-- ... -->
</div>

<!-- 부정 -->
<div class="not-supports-[display:grid]:flex"><!-- ... --></div>
```

### @starting-style

```html
<div>
  <button popovertarget="my-popover">Check for updates</button>
  <div popover id="my-popover" class="opacity-0 starting:open:opacity-0">
    <!-- ... -->
  </div>
</div>
```

---

## 8. Attribute Selectors

### ARIA 상태

```html
<div aria-checked="true" class="bg-gray-600 aria-checked:bg-sky-700">
  <!-- ... -->
</div>
```

**내장 ARIA 변형:** `aria-busy`, `aria-checked`, `aria-disabled`, `aria-expanded`, `aria-hidden`, `aria-pressed`, `aria-readonly`, `aria-required`, `aria-selected`

**임의 ARIA:**

```html
<th
  class="aria-[sort=ascending]:bg-[url('/img/down-arrow.svg')]
    aria-[sort=descending]:bg-[url('/img/up-arrow.svg')]"
>
  Invoice #
</th>
```

### Data 속성

```html
<!-- 존재 여부 확인 -->
<div data-active class="border-gray-300 data-active:border-purple-500">
  <!-- ... -->
</div>

<!-- 특정 값 -->
<div data-size="large" class="data-[size=large]:p-8">
  <!-- ... -->
</div>
```

### RTL 지원

```html
<div class="group flex items-center">
  <img class="h-12 w-12 rounded-full" src="..." alt="" />
  <div class="ltr:ml-3 rtl:mr-3">
    <p class="text-gray-700">...</p>
  </div>
</div>
```

### Open/Closed 상태

```html
<!-- details 요소 -->
<details class="border-transparent open:border-black/10 open:bg-gray-100" open>
  <summary>Why do they call it Ovaltine?</summary>
  <p>The mug is round. The jar is round. They should call it Roundtine.</p>
</details>

<!-- Popover -->
<div popover id="my-popover" class="opacity-0 open:opacity-100">
  <!-- ... -->
</div>
```

### Inert 요소

```html
<fieldset inert class="inert:opacity-50">
  <!-- 비대화형 섹션임을 시각적으로 표시 -->
</fieldset>
```

---

## 9. Child Selectors

### 직접 자식 스타일링 (\*)

```html
<ul
  class="*:rounded-full *:border *:border-sky-100 *:bg-sky-50 *:px-2 *:py-0.5
    dark:*:border-sky-500/15 dark:*:bg-sky-500/10"
>
  <li>Sales</li>
  <li>Marketing</li>
  <li>SEO</li>
</ul>
```

### 모든 자손 스타일링 (\*\*)

```html
<ul class="**:data-avatar:size-12 **:data-avatar:rounded-full">
  {items.map((item) => (
    <li>
      <img src={item.src} data-avatar />
      <p>{item.name}</p>
    </li>
  ))}
</ul>
```

---

## 10. Custom Variants

### 임의 변형 (Arbitrary Variants)

```html
<ul role="list">
  {items.map((item) => (
    <li class="[&.is-dragging]:cursor-grabbing">{item}</li>
  ))}
</ul>

<!-- 다른 변형과 스택 -->
<li class="[&.is-dragging]:active:cursor-grabbing">{item}</li>

<!-- 공백은 언더스코어 사용 -->
<div class="[&_p]:mt-4">
  <p>Lorem ipsum...</p>
</div>

<!-- at-rules와 함께 -->
<div class="flex [@supports(display:grid)]:grid"><!-- ... --></div>
```

### 커스텀 변형 등록

```css
@custom-variant theme-midnight (&:where([data-theme='midnight'] *));
```

```html
<html data-theme="midnight">
  <button class="theme-midnight:bg-black">...</button>
</html>
```

---

## Quick Reference

| Variant          | CSS                                           |
| ---------------- | --------------------------------------------- |
| `hover`          | `@media (hover: hover) { &:hover }`           |
| `focus`          | `&:focus`                                     |
| `focus-within`   | `&:focus-within`                              |
| `focus-visible`  | `&:focus-visible`                             |
| `active`         | `&:active`                                    |
| `visited`        | `&:visited`                                   |
| `target`         | `&:target`                                    |
| `*`              | `:is(& > *)`                                  |
| `**`             | `:is(& *)`                                    |
| `has-[...]`      | `&:has(...)`                                  |
| `group-[...]`    | `&:is(:where(.group)... *)`                   |
| `peer-[...]`     | `&:is(:where(.peer)... ~ *)`                  |
| `not-[...]`      | `&:not(...)`                                  |
| `inert`          | `&:is([inert], [inert] *)`                    |
| `first`          | `&:first-child`                               |
| `last`           | `&:last-child`                                |
| `odd`            | `&:nth-child(odd)`                            |
| `even`           | `&:nth-child(even)`                           |
| `before`         | `&::before`                                   |
| `after`          | `&::after`                                    |
| `placeholder`    | `&::placeholder`                              |
| `file`           | `&::file-selector-button`                     |
| `marker`         | `&::marker, & *::marker`                      |
| `selection`      | `&::selection`                                |
| `backdrop`       | `&::backdrop`                                 |
| `sm/md/lg/xl`    | `@media (width >= ...)`                       |
| `dark`           | `@media (prefers-color-scheme: dark)`         |
| `motion-safe`    | `@media (prefers-reduced-motion: no-preference)` |
| `motion-reduce`  | `@media (prefers-reduced-motion: reduce)`     |
| `contrast-more`  | `@media (prefers-contrast: more)`             |
| `portrait`       | `@media (orientation: portrait)`              |
| `landscape`      | `@media (orientation: landscape)`             |
| `print`          | `@media print`                                |
| `supports-[...]` | `@supports (...)`                             |
| `aria-[...]`     | `&[aria-...]`                                 |
| `data-[...]`     | `&[data-...]`                                 |
| `rtl`            | `&:where(:dir(rtl), [dir="rtl"] *)`           |
| `ltr`            | `&:where(:dir(ltr), [dir="ltr"] *)`           |
| `open`           | `&:is([open], :popover-open, :open)`          |
