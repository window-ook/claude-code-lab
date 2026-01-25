---
name: clean-tailwind
description: Use when refactoring Tailwind CSS class order in React/Next.js components, when className strings feel disorganized, or when establishing consistent CSS ordering conventions across a codebase
---

# Clean Tailwind

## Overview

Tailwind CSS 클래스를 일관된 순서로 정렬하는 기법입니다. **핵심 원칙**: 시각적 렌더링 순서(바깥→안쪽→콘텐츠)를 따릅니다.

## When to Use

**Use when:**
- `className` 문자열이 길고 무질서해 보일 때
- 팀 코드 리뷰에서 Tailwind 순서 일관성 문제가 제기될 때
- 새 프로젝트에 Tailwind 정렬 규칙을 도입할 때

**Don't use for:**
- shadcn/ui, Radix 등 외부 라이브러리 컴포넌트
- CSS-in-JS나 styled-components 프로젝트

## Quick Reference

| 순위 | 카테고리    | 속성 예시                                       |
| ---- | ----------- | ----------------------------------------------- |
| 0    | 커스텀 CSS  | `card-tilt`, `hover-button` (맨 앞)             |
| 1    | 포지션      | `absolute`, `relative`, `fixed`, `top-*`        |
| 2    | 레이아웃    | `w-*`, `h-*`, `size-*`, `min-w-*`, `overflow-*` |
| 3    | 공백        | `m-*`, `mx-*`, `p-*`, `px-*`, `py-*`            |
| 4    | 외곽 효과   | `border-*`, `rounded-*`, `shadow-*`             |
| 5    | 배경색      | `bg-*`, `opacity-*`                             |
| 6    | Flex/Grid   | `flex`, `grid`, `gap-*`, `justify-*`, `items-*` |
| 7    | 폰트        | `text-*`, `font-*`, `leading-*`                 |
| 8    | 애니메이션  | `animate-*`                                     |
| 9    | 트랜지션    | `transition-*`, `duration-*`, `ease-*`          |

## Core Pattern

### Before/After

```tsx
// ❌ Before: 무질서한 순서
className="px-4 hover:bg-blue-600 py-2 bg-blue-500 text-white rounded-lg font-bold"

// ✅ After: 정렬된 순서 (외곽→배경→공백→폰트)
className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2 font-bold text-white"
```

### 조건부 클래스 배치

조건부 클래스(`hover:`, `focus:`, `disabled:`)는 **해당 기본 클래스 바로 뒤**에 배치:

```tsx
// ✅ 올바름: bg-blue-500 바로 뒤에 hover:bg-blue-600
className="rounded-lg bg-blue-500 hover:bg-blue-600 px-4 py-2"

// ❌ 잘못됨: hover가 bg와 분리됨
className="rounded-lg bg-blue-500 px-4 py-2 hover:bg-blue-600"
```

### 동일 크기는 size-* 사용

```tsx
// ❌ Before
className="w-8 h-8"

// ✅ After
className="size-8"
```

## Dynamic Classes

### 템플릿 리터럴 처리

동적 클래스가 포함된 경우, 정적 부분만 정렬하고 동적 부분은 원래 위치 유지:

```tsx
// 동적 클래스 (${cardColor})는 해당 카테고리 위치에 배치
className={`card-tilt size-full p-4 border-6 ${cardColorByGrade} rounded-2xl flex flex-col`}
//          커스텀    레이아웃  공백  외곽    동적(외곽/배경)    외곽      Flex
```

### 조건부 스타일 객체

조건부 스타일 객체는 순서 변경 없이 유지:

```tsx
className={cn(
  "rounded-lg bg-white px-4 py-2",  // 정적 부분만 정렬
  isDarkMode && "bg-gray-800",       // 조건부는 그대로
  isActive && "ring-2 ring-blue-500" // 조건부는 그대로
)}
```

## Common Mistakes

| 실수 | 수정 |
|------|------|
| 공백이 외곽보다 먼저 | `px-4 rounded-lg` → `rounded-lg px-4` |
| 포지션이 레이아웃 뒤에 | `w-full relative` → `relative w-full` |
| 조건부가 기본 클래스와 분리됨 | 기본 클래스 바로 뒤로 이동 |
| w-8 h-8 중복 | `size-8`로 통합 |

## Batch Workflow

대규모 리팩토링 시 권장 워크플로우:

1. **브랜치 생성**: `git checkout -b refactor/tailwind-class-order`
2. **배치 분할**: 5-8개 파일/배치로 나누기
3. **배치 작업**: 파일 읽기 → 정렬 → 저장 → UI 확인
4. **배치 커밋**: 각 배치별 커밋으로 롤백 용이성 확보
5. **최종 검증**: E2E 테스트 + 빌드 확인

## Red Flags

작업 시 주의 신호:

- 외부 라이브러리(shadcn-ui 등) 컴포넌트 수정하려 함
- 동적 클래스 로직을 변경하려 함
- 테스트 없이 여러 배치 연속 작업
- 커밋 없이 대량 파일 수정
