# Detecting Classes in Source Files

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/detecting-classes-in-source-files

---

## Contents

- [1. Overview](#1-overview)
- [2. How Classes Are Detected](#2-how-classes-are-detected)
- [3. Dynamic Class Names](#3-dynamic-class-names)
- [4. Which Files Are Scanned](#4-which-files-are-scanned)
- [5. Explicitly Registering Sources](#5-explicitly-registering-sources)
- [6. Safelisting Specific Utilities](#6-safelisting-specific-utilities)
- [7. Explicitly Excluding Classes](#7-explicitly-excluding-classes)
- [Key Principles](#key-principles)

---

## 1. Overview

Tailwind는 프로젝트의 소스 파일을 스캔하여 유틸리티 클래스를 찾고, **실제로 사용하는 클래스에 대해서만 CSS를 생성**합니다. 이를 통해 CSS를 최소화하고 임의 값(arbitrary values) 같은 기능을 활성화합니다.

### 핵심 포인트

Tailwind는 소스 파일을 **일반 텍스트**로 취급하며 코드를 파싱하지 않습니다. 예상되는 문자 패턴을 기반으로 클래스 이름이 될 수 있는 토큰을 찾습니다.

---

## 2. How Classes Are Detected

### 기본 감지 방식

Tailwind는 파일에서 클래스 이름 패턴과 일치하는 토큰을 스캔한 후, 유효한 유틸리티 클래스에 대해 CSS를 생성하고 인식되지 않는 토큰은 버립니다.

```jsx
export function Button({ color, children }) {
  const colors = {
    black: "bg-black text-white",
    blue: "bg-blue-500 text-white",
    white: "bg-white text-black",
  };
  return (
    <button className={`${colors[color]} rounded-full px-2 py-1.5 font-sans text-sm/6 font-medium shadow`}>
      {children}
    </button>
  );
}
```

Tailwind가 감지하는 클래스:
- `bg-black`, `text-white`, `bg-blue-500`, `bg-white`, `text-black`
- `rounded-full`, `px-2`, `py-1.5`, `font-sans`, `text-sm/6`, `font-medium`, `shadow`

---

## 3. Dynamic Class Names

### ❌ 동적으로 클래스 이름을 구성하지 마세요

```html
<!-- 작동하지 않음 -->
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>
```

`text-red-600`과 `text-green-600` 문자열이 완전한 토큰으로 존재하지 않아 Tailwind가 생성하지 않습니다.

### ✅ 항상 완전한 클래스 이름을 사용하세요

```html
<!-- 정상 작동 -->
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

### ✅ React/Vue: Props를 정적 클래스 이름에 매핑

**잘못된 방법:**

```jsx
function Button({ color, children }) {
  return (
    <button className={`bg-${color}-600 hover:bg-${color}-500 ...`}>
      {children}
    </button>
  );
}
```

**올바른 방법:**

```jsx
function Button({ color, children }) {
  const colorVariants = {
    blue: "bg-blue-600 hover:bg-blue-500 text-white",
    red: "bg-red-600 hover:bg-red-500 text-white",
    yellow: "bg-yellow-300 hover:bg-yellow-400 text-black",
  };
  return (
    <button className={`${colorVariants[color]} ...`}>
      {children}
    </button>
  );
}
```

이 방식은 다른 prop 값을 다른 색상 음영에 매핑할 수도 있습니다.

---

## 4. Which Files Are Scanned

Tailwind는 프로젝트의 모든 파일을 스캔하지만 다음은 **제외**됩니다:

| 제외 대상 | 설명 |
| --------- | ---- |
| `.gitignore` 파일 | gitignore에 명시된 파일/디렉토리 |
| `node_modules` | 의존성 디렉토리 |
| 바이너리 파일 | 이미지, 비디오, zip 등 |
| CSS 파일 | 스타일시트 파일 |
| 패키지 매니저 락 파일 | package-lock.json, yarn.lock 등 |

---

## 5. Explicitly Registering Sources

### @source 지시어 사용

특정 경로를 스캔하도록 등록합니다 (스타일시트 기준 상대 경로):

```css
@import "tailwindcss";
@source "../node_modules/@acmecorp/ui-lib";
```

**사용 사례**: Tailwind로 빌드된 외부 라이브러리 스캔 (보통 `.gitignore`로 무시됨)

### 베이스 경로 설정

```css
@import "tailwindcss" source("../src");
```

모노레포에서 빌드 명령이 프로젝트 루트가 아닌 저장소 루트에서 실행될 때 사용합니다.

### 특정 경로 무시

```css
@import "tailwindcss";
@source not "../src/components/legacy";
```

Tailwind 클래스가 없는 큰 디렉토리를 제외합니다.

### 자동 감지 비활성화

```css
@import "tailwindcss" source(none);
@source "../admin";
@source "../shared";
```

여러 Tailwind 스타일시트가 있고 각각 특정 소스가 필요할 때 사용합니다.

---

## 6. Safelisting Specific Utilities

### 단일 클래스 Safelist

소스 파일에서 감지되지 않는 클래스 강제 생성:

```css
@import "tailwindcss";
@source inline("underline");
```

생성되는 CSS:

```css
.underline {
  text-decoration-line: underline;
}
```

### 변형과 함께 Safelist

`{variant:,}` 문법으로 특정 변형과 함께 클래스 생성:

```css
@import "tailwindcss";
@source inline("{hover:,focus:,}underline");
```

생성되는 CSS:

```css
.underline {
  text-decoration-line: underline;
}

@media (hover: hover) {
  .hover\:underline:hover {
    text-decoration-line: underline;
  }
}

.focus\:underline:focus {
  text-decoration-line: underline;
}
```

### 범위와 함께 Safelist

중괄호 확장으로 여러 클래스 생성:

```css
@import "tailwindcss";
@source inline("{hover:,}bg-red-{50,{100..900..100},950}");
```

생성되는 CSS:

```css
.bg-red-50 { background-color: var(--color-red-50); }
.bg-red-100 { background-color: var(--color-red-100); }
/* ... 100 단위로 증가 ... */
.bg-red-900 { background-color: var(--color-red-900); }
.bg-red-950 { background-color: var(--color-red-950); }

@media (hover: hover) {
  .hover\:bg-red-50:hover { background-color: var(--color-red-50); }
  /* ... 모든 hover 변형 ... */
}
```

### 범위 문법 설명

| 문법 | 설명 | 예시 |
| ---- | ---- | ---- |
| `{a,b,c}` | 나열된 값들 | `{50,100,200}` → 50, 100, 200 |
| `{start..end}` | 시작부터 끝까지 | `{1..5}` → 1, 2, 3, 4, 5 |
| `{start..end..step}` | 단계별 증가 | `{100..900..100}` → 100, 200, ..., 900 |

---

## 7. Explicitly Excluding Classes

### @source not inline() 사용

특정 클래스 생성 방지:

```css
@import "tailwindcss";
@source not inline("{hover:,focus:,}bg-red-{50,{100..900..100},950}");
```

빨간색 배경 유틸리티와 해당 hover/focus 변형을 명시적으로 제외합니다.

---

## Key Principles

| Principle | Description |
| --------- | ----------- |
| Complete Class Names | 템플릿과 컴포넌트에서 항상 완전한 클래스 이름 사용 |
| Static Mappings | 변형에 동적 문자열 보간 대신 정적 매핑 사용 |
| Register External Sources | Tailwind로 빌드된 외부 라이브러리는 명시적으로 소스 등록 |
| Safelist When Necessary | 감지할 수 없는 클래스에만 safelist 사용 |
| Test Your Build | 예상되는 모든 클래스가 생성되는지 빌드 테스트 |
| Exclude Legacy Code | Tailwind 클래스가 없는 레거시 코드는 제외하여 빌드 최적화 |
