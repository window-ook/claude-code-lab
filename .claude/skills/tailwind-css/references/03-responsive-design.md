# Responsive Design

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/responsive-design

---

## Contents

- [1. Overview](#1-overview)
- [2. Breakpoint System](#2-breakpoint-system)
- [3. Mobile-First Approach](#3-mobile-first-approach)
- [4. Responsive Example](#4-responsive-example)
- [5. Advanced Breakpoint Targeting](#5-advanced-breakpoint-targeting)
- [6. Custom Breakpoints](#6-custom-breakpoints)
- [7. Container Queries](#7-container-queries)
- [8. Container Query Units](#8-container-query-units)
- [Key Principles](#key-principles)

---

## 1. Overview

Tailwind CSS는 모든 유틸리티 클래스를 **브레이크포인트별로 조건부 적용**할 수 있어, HTML을 벗어나지 않고도 적응형 사용자 인터페이스를 구현할 수 있습니다.

### 필수 설정

반응형 디자인을 위해 문서의 `<head>`에 뷰포트 메타 태그를 추가해야 합니다:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## 2. Breakpoint System

### 기본 브레이크포인트

Tailwind는 5개의 기본 브레이크포인트를 제공합니다:

| Prefix | Minimum Width   | CSS                        |
| ------ | --------------- | -------------------------- |
| `sm`   | 40rem (640px)   | `@media (width >= 40rem)`  |
| `md`   | 48rem (768px)   | `@media (width >= 48rem)`  |
| `lg`   | 64rem (1024px)  | `@media (width >= 64rem)`  |
| `xl`   | 80rem (1280px)  | `@media (width >= 80rem)`  |
| `2xl`  | 96rem (1536px)  | `@media (width >= 96rem)`  |

### 기본 문법

브레이크포인트 이름 뒤에 콜론을 붙여 유틸리티 클래스 앞에 접두사로 사용합니다:

```html
<!-- 기본 16, 중간 화면에서 32, 큰 화면에서 48 -->
<img class="w-16 md:w-32 lg:w-48" src="..." />
```

생성되는 CSS:

```css
.w-16 {
  width: 4rem;
}

@media (width >= 48rem) {
  .md\:w-32 {
    width: 8rem;
  }
}

@media (width >= 64rem) {
  .lg\:w-48 {
    width: 12rem;
  }
}
```

---

## 3. Mobile-First Approach

Tailwind는 **모바일 우선(Mobile-First)** 전략을 사용합니다:

- **접두사 없는 유틸리티** (예: `uppercase`): 모든 화면 크기에 적용
- **접두사 있는 유틸리티** (예: `md:uppercase`): 해당 브레이크포인트 이상에서 적용

### 모바일 타겟팅 원칙

| 패턴 | 설명 | 예시 |
| ---- | ---- | ---- |
| ❌ 잘못된 방법 | `sm:`으로 모바일 타겟팅 시도 | `sm:text-center` (640px 이상에서만 적용) |
| ✅ 올바른 방법 | 접두사 없이 모바일 스타일 지정 | `text-center sm:text-left` |

```html
<!-- ❌ 잘못됨: 640px 이상에서만 중앙 정렬 -->
<div class="sm:text-center"></div>

<!-- ✅ 올바름: 모바일에서 중앙 정렬, 640px 이상에서 왼쪽 정렬 -->
<div class="text-center sm:text-left"></div>
```

---

## 4. Responsive Example

반응형 마케팅 카드 컴포넌트 예시:

```html
<div class="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
  <div class="md:flex">
    <div class="md:shrink-0">
      <img
        class="h-48 w-full object-cover md:h-full md:w-48"
        src="/img/building.jpg"
        alt="Modern building architecture"
      />
    </div>
    <div class="p-8">
      <div class="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
        Company retreats
      </div>
      <a href="#" class="mt-1 block text-lg leading-tight font-medium text-black hover:underline">
        Incredible accommodation for your team
      </a>
      <p class="mt-2 text-gray-500">
        Looking to take your team away on a retreat...
      </p>
    </div>
  </div>
</div>
```

### 동작 방식

| 화면 크기 | 레이아웃 | 이미지 스타일 |
| --------- | -------- | ------------- |
| 모바일 (기본) | `display: block` | 전체 너비, 높이 48 (`h-48 w-full`) |
| 중간 이상 (`md:`) | `display: flex` | 전체 높이, 너비 48 (`md:h-full md:w-48`) |

- `md:shrink-0`: 중간 화면 이상에서 이미지 축소 방지

---

## 5. Advanced Breakpoint Targeting

### 브레이크포인트 범위 타겟팅

`max-*` 변형을 사용하여 특정 범위에만 스타일을 적용합니다:

```html
<div class="md:max-xl:flex">
  <!-- md(768px)와 xl(1280px) 사이에서만 flex 적용 -->
</div>
```

### max-* 변형 목록

| Variant    | CSS                      |
| ---------- | ------------------------ |
| `max-sm`   | `@media (width < 40rem)` |
| `max-md`   | `@media (width < 48rem)` |
| `max-lg`   | `@media (width < 64rem)` |
| `max-xl`   | `@media (width < 80rem)` |
| `max-2xl`  | `@media (width < 96rem)` |

### 단일 브레이크포인트 타겟팅

반응형 변형과 다음 브레이크포인트의 `max-*`를 조합합니다:

```html
<div class="md:max-lg:flex">
  <!-- md(768px)와 lg(1024px) 사이에서만 flex 적용 -->
</div>
```

---

## 6. Custom Breakpoints

### 테마 커스터마이징

CSS에서 `--breakpoint-*` 테마 변수를 사용합니다:

```css
@import "tailwindcss";

@theme {
  --breakpoint-xs: 30rem;
  --breakpoint-2xl: 100rem;
  --breakpoint-3xl: 120rem;
}
```

HTML에서 커스텀 브레이크포인트 사용:

```html
<div class="grid xs:grid-cols-2 3xl:grid-cols-6">
  <!-- ... -->
</div>
```

### 기본 브레이크포인트 제거

특정 브레이크포인트를 `initial`로 리셋:

```css
@theme {
  --breakpoint-2xl: initial;
}
```

모든 기본값 교체:

```css
@theme {
  --breakpoint-*: initial;
  --breakpoint-tablet: 40rem;
  --breakpoint-laptop: 64rem;
  --breakpoint-desktop: 80rem;
}
```

### 임의 값 사용

테마 설정 없이 일회성 브레이크포인트 생성:

```html
<div class="max-[600px]:bg-sky-300 min-[320px]:text-center">
  <!-- ... -->
</div>
```

---

## 7. Container Queries

컨테이너 쿼리는 뷰포트 크기가 아닌 **부모 요소의 크기**를 기준으로 스타일을 적용합니다. 이를 통해 더 재사용 가능한 컴포넌트를 만들 수 있습니다.

### 기본 사용법

컨테이너를 지정하고 자식에 `@` 변형을 사용합니다:

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- 컨테이너 크기에 따라 flex 방향 변경 -->
  </div>
</div>
```

### Max-Width 컨테이너 쿼리

특정 컨테이너 크기 이하에서 스타일 적용:

```html
<div class="@container">
  <div class="flex flex-row @max-md:flex-col">
    <!-- 작은 컨테이너에서 세로 스택 -->
  </div>
</div>
```

### 컨테이너 쿼리 범위

일반 변형과 max 변형을 조합합니다:

```html
<div class="@container">
  <div class="flex flex-row @sm:@max-md:flex-col">
    <!-- sm과 md 컨테이너 크기 사이에서만 적용 -->
  </div>
</div>
```

### 이름이 있는 컨테이너

복잡한 중첩 레이아웃에서 컨테이너에 이름을 지정합니다:

```html
<div class="@container/main">
  <!-- ... -->
  <div class="flex flex-row @sm/main:flex-col">
    <!-- "main" 컨테이너 기준으로 스타일 적용 -->
  </div>
</div>
```

### 컨테이너 크기 기준표

| Variant | Minimum Width    |
| ------- | ---------------- |
| `@3xs`  | 16rem (256px)    |
| `@2xs`  | 18rem (288px)    |
| `@xs`   | 20rem (320px)    |
| `@sm`   | 24rem (384px)    |
| `@md`   | 28rem (448px)    |
| `@lg`   | 32rem (512px)    |
| `@xl`   | 36rem (576px)    |
| `@2xl`  | 42rem (672px)    |
| `@3xl`  | 48rem (768px)    |
| `@4xl`  | 56rem (896px)    |
| `@5xl`  | 64rem (1024px)   |
| `@6xl`  | 72rem (1152px)   |
| `@7xl`  | 80rem (1280px)   |

### 커스텀 컨테이너 크기

테마 변수로 컨테이너 크기 정의:

```css
@theme {
  --container-8xl: 96rem;
}
```

사용:

```html
<div class="@container">
  <div class="flex flex-col @8xl:flex-row">
    <!-- ... -->
  </div>
</div>
```

### 임의 컨테이너 쿼리

일회성 크기에 임의 값 사용:

```html
<div class="@container">
  <div class="flex flex-col @min-[475px]:flex-row">
    <!-- ... -->
  </div>
</div>
```

---

## 8. Container Query Units

CSS 컨테이너 쿼리 단위를 사용하여 컨테이너 크기를 참조합니다:

```html
<div class="@container">
  <div class="w-[50cqw]">
    <!-- 컨테이너 너비의 50% -->
  </div>
</div>
```

| Unit   | Description              |
| ------ | ------------------------ |
| `cqw`  | 컨테이너 너비의 1%       |
| `cqh`  | 컨테이너 높이의 1%       |
| `cqi`  | 인라인 크기의 1%         |
| `cqb`  | 블록 크기의 1%           |
| `cqmin`| cqi 또는 cqb 중 작은 값  |
| `cqmax`| cqi 또는 cqb 중 큰 값    |

---

## Key Principles

| Principle                  | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| Mobile-First Design        | 모바일 스타일을 먼저 작성하고, 큰 브레이크포인트에서 오버라이드 |
| Universal Utility Support  | 모든 유틸리티에 반응형 변형 적용 가능                        |
| Explicit Breakpoint Prefix | `md:flex` 처럼 브레이크포인트를 명시적으로 표현              |
| Strategic Variant Combine  | `md:max-lg:` 문법으로 특정 범위 타겟팅                       |
| Container Queries          | `@container`로 레이아웃 인식 컴포넌트 구현                   |
| Consistent Units           | 미디어 쿼리 순서 문제 방지를 위해 `rem` 단위 일관 사용       |
| Arbitrary Values           | 대괄호 문법으로 일회성 브레이크포인트 지원                   |
