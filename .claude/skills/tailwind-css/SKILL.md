---
name: tailwind-css
description: TailwindCSS 베스트 프랙티스 가이드. Tailwind CSS를 사용하여 컴포넌트 스타일링 구현 시 참조.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Tailwind CSS Quick Reference

**Version:** 4.1 (Jan 2026)
**Doc Source:** Official Tailwind CSS documentation

## 🎯 Skill 목적

Tailwind CSS v4를 사용한 스타일링 구현 시 베스트 프랙티스를 적용합니다. className 순서 규칙, 동적 클래스 처리, 반응형 디자인, 다크 모드, 테마 커스터마이징 등 Tailwind CSS의 핵심 패턴을 올바르게 구현하도록 안내합니다.

## 🔑 활성화 조건

### 활성화 키워드

- "Tailwind", "tailwind", "테일윈드"
- "className", "클래스네임"
- "스타일링", "styling"
- "반응형", "responsive"
- "다크 모드", "dark mode"
- "유틸리티 클래스", "utility class"

### 필수 조건

- Tailwind CSS를 사용하는 프로젝트에서 작업 중일 때
- 컴포넌트 스타일링 구현 시
- className 정렬이나 Tailwind 패턴 적용이 필요할 때

---

## 🚨 CRITICAL RULES (Always Enforce)

### 1. className Order Priority

```typescript
// ❌ WRONG - 순서 없이 작성
<div className="text-white flex bg-blue-500 p-4 absolute w-full">

// ✅ CORRECT - 포지션 → 레이아웃 → 공백 → 외곽 → 배경 → Flex/Grid → 폰트
<div className="absolute w-full p-4 bg-blue-500 flex text-white">
```

| 순위 | 종류           | 속성                                                      |
| ---- | -------------- | --------------------------------------------------------- |
| 1    | 포지션         | absolute, relative, fixed, top, left…                     |
| 2    | 레이아웃       | w-, h-, size-, min-w-[], min-h-[], overflow-hidden, …     |
| 3    | 공백           | m-, mx-, my-, p, px-, py-…                                |
| 4    | 외곽 효과      | border-[], border-color-[], shadow-[]…                    |
| 5    | 배경색         | bg-, opacity-                                             |
| 6    | Flex Box, Grid | flex, grid, flex-col, grid-cols-, gap-, justify-, items-… |
| 7    | 폰트           | text-, font-, whitespace-, leading-, …                    |
| 8    | 애니메이션     | animate-                                                  |
| 9    | 트랜지션       | transition-, duration-, ease-…                            |
| -    | 조건           | hover:, group-hover:, focus: (해당 속성 바로 뒤에 위치)   |

### 2. Use size- When w- and h- Are Equal

```typescript
// ❌ WRONG
<div className="w-10 h-10">

// ✅ CORRECT
<div className="size-10">
```

### 3. Dynamic Class Names Must Be Complete

```typescript
// ❌ WRONG - 동적 클래스 생성 불가
<div className={`text-${color}-500`}>

// ✅ CORRECT - 완전한 클래스명 매핑
const colorMap = {
  red: 'text-red-500',
  blue: 'text-blue-500',
} as const;
<div className={colorMap[color]}>
```

### 4. No `!important` Unless Absolutely Necessary

```typescript
// ❌ AVOID
<div className="!text-red-500">

// ✅ CORRECT - 구체적인 셀렉터 또는 레이어 사용
<div className="text-red-500">
```

### 5. Use CSS Variables for Theme Values

```css
/* ✅ v4 방식 - @theme으로 디자인 토큰 정의 */
@import 'tailwindcss';

@theme {
  --color-brand: #3b82f6;
  --font-display: 'Inter', sans-serif;
}
```

### 6. Prefer Semantic Utility Patterns

```typescript
// ❌ WRONG - 반복적인 스타일
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">

// ✅ CORRECT - @apply로 재사용 가능한 컴포넌트 스타일
// globals.css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
  }
}
```

---

## ⚠️ v4 Breaking Changes (from v3)

| v3 (deprecated)                       | v4 (current)                              |
| ------------------------------------- | ----------------------------------------- |
| `tailwind.config.js`                  | `@theme` directive in CSS                 |
| `@tailwind base/components/utilities` | `@import "tailwindcss"`                   |
| `theme.extend.colors`                 | `@theme { --color-* }`                    |
| `darkMode: 'class'`                   | `@variant dark (&:where(.dark, .dark *))` |
| `content: [...]` 설정                 | 자동 감지 (`.gitignore` 외 모든 파일)     |
| PostCSS 플러그인 필수                 | Vite 플러그인 권장, PostCSS 선택적        |

---

## Essential Patterns

### Basic Utility Usage

```typescript
// 기본 유틸리티 조합
<div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center gap-4">
  <h1 className="text-3xl font-bold text-gray-900">Title</h1>
  <p className="max-w-prose text-gray-600 leading-relaxed">Content</p>
</div>
```

### Responsive Design

```typescript
// 모바일 퍼스트 반응형
<div className="w-full p-4 md:w-1/2 md:p-6 lg:w-1/3 lg:p-8">
  <h2 className="text-lg md:text-xl lg:text-2xl">Responsive</h2>
</div>
```

### Dark Mode

```typescript
// 다크 모드 지원
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  Dark mode aware content
</div>
```

---

## 📚 When to Read Additional Files

### Core Concepts

**Using utility classes?** → [references/01-styling-with-utility-classes.md](references/01-styling-with-utility-classes.md)

- 유틸리티 퍼스트 워크플로우
- 복잡한 컴포넌트 스타일링
- 레이아웃, 타이포그래피, 배경, 효과

**Using hover, focus states?** → [references/02-hover-focus-and-other-states.md](references/02-hover-focus-and-other-states.md)

- 의사 클래스 (hover, focus, active, disabled)
- 의사 요소 (before, after, placeholder)
- 미디어/기능 쿼리 (prefers-reduced-motion, prefers-color-scheme)
- 속성 셀렉터, ARIA 상태

**Building responsive layouts?** → [references/03-responsive-design.md](references/03-responsive-design.md)

- 브레이크포인트 프리픽스 (sm, md, lg, xl, 2xl)
- 모바일 퍼스트 전략
- 컨테이너 쿼리 (@container)
- 커스텀 브레이크포인트

**Implementing dark mode?** → [references/04-dark-mode.md](references/04-dark-mode.md)

- `dark:` 변형 사용법
- 시스템 설정 vs 수동 토글
- 커스텀 변형 정의

---

### Theme & Customization

**Customizing theme?** → [references/05-theme-variables.md](references/05-theme-variables.md)

- `@theme` 디렉티브로 디자인 토큰 정의
- 색상, 간격, 폰트, 애니메이션 커스텀
- 테마 변수 네임스페이스

**Using colors?** → [references/06-colors.md](references/06-colors.md)

- 기본 색상 팔레트
- 커스텀 색상 추가
- 색상 투명도 조절 (`bg-blue-500/50`)
- 현재 색상 참조 (`currentColor`)

**Adding custom styles?** → [references/07-adding-custom-styles.md](references/07-adding-custom-styles.md)

- `@theme` 커스터마이징
- 임의값 `[값]` 문법
- 임의 속성 `[property:value]`
- `@layer`, `@utility`, `@variant` 디렉티브
- `@apply`로 유틸리티 추출

---

### Build & Configuration

**Configuring class detection?** → [references/08-detecting-classes-in-source-files.md](references/08-detecting-classes-in-source-files.md)

- 자동 클래스 감지 동작
- `@source` 디렉티브로 명시적 경로 지정
- 세이프리스트로 동적 클래스 강제 생성
- 외부 라이브러리 클래스 포함

**Using functions & directives?** → [references/09-functions-and-directives.md](references/09-functions-and-directives.md)

- `@import`, `@theme`, `@source`
- `@utility`, `@variant`, `@custom-variant`
- `@apply`, `@reference`, `@layer`
- `--alpha()`, `--spacing()` 함수
