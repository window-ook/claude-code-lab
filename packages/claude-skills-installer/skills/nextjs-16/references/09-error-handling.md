# Next.js Error Handling

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/error-handling

---

## Contents

- [1. 에러 카테고리](#1-에러-카테고리)
- [2. error.tsx 파일 컨벤션](#2-errortsx-파일-컨벤션)
- [3. global-error.tsx](#3-global-errortsx)
- [4. 중첩된 Error Boundaries](#4-중첩된-error-boundaries)
- [5. Reset 함수](#5-reset-함수)
- [6. Error Boundary 제한사항](#6-error-boundary-제한사항)
- [7. Server-Side Error Handling](#7-server-side-error-handling)
- [8. Not Found Errors](#8-not-found-errors)
- [Best Practices](#best-practices)

---

## 1. 에러 카테고리

Next.js 에러는 두 가지 주요 카테고리로 나뉩니다:

| 카테고리            | 설명                                             | 예시                   |
| ------------------- | ------------------------------------------------ | ---------------------- |
| Expected errors     | 정상 작동 중 발생하는 에러                       | 폼 검증, 실패한 요청   |
| Uncaught exceptions | 정상 작동 중 발생해서는 안 되는 예상치 못한 버그 | 런타임 에러, 타입 에러 |

---

## 2. error.tsx 파일 컨벤션

### 목적

Error boundaries는 자식 컴포넌트의 uncaught exceptions를 잡아 앱 크래시 대신 fallback UI를 표시합니다.

### 요구사항

- **Client Component**여야 함 (`'use client'`)
- 라우트 세그먼트에 `error.tsx` 또는 `error.js` 파일명으로 생성
- 자식 컴포넌트를 자동으로 래핑

### Error Component Props

```tsx
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // error: 추적용 선택적 digest가 포함된 thrown error 객체
  // reset: 세그먼트 재렌더링을 시도하는 함수
}
```

### 기본 구현

```tsx
// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 외부 서비스에 에러 로깅
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## 3. global-error.tsx

### 목적

전체 애플리케이션에서 루트 레이아웃의 에러를 처리합니다.

### 요구사항

| 요구사항            | 설명                                  |
| ------------------- | ------------------------------------- |
| Client Component    | `'use client'` 필수                   |
| 위치                | 루트 `app` 디렉토리                   |
| HTML/Body 태그 정의 | 활성화 시 루트 레이아웃 대체          |
| 사용 빈도           | 중첩된 error boundaries보다 적게 사용 |

### 구현

```tsx
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

---

## 4. 중첩된 Error Boundaries

### 개념

에러는 가장 가까운 부모 error boundary로 버블업되어, 다양한 계층 수준에서 **세밀한 에러 처리**를 가능하게 합니다.

### 장점

- 다른 라우트 레벨에 다른 `error.tsx` 파일
- 특정 세그먼트에 대한 세밀한 에러 UI
- 부모 boundaries가 자식 boundaries의 에러를 잡음

### 구조

```
app/
├── error.tsx              → 루트 boundary
├── dashboard/
│   ├── error.tsx          → dashboard 세그먼트 boundary
│   └── analytics/
│       └── error.tsx      → 중첩된 boundary
```

---

## 5. Reset 함수

### 목적

에러 세그먼트를 재렌더링하여 복구를 시도합니다.

### 사용법

```tsx
<button onClick={() => reset()}>Try again</button>
```

### 동작

| 동작                   | 설명                                  |
| ---------------------- | ------------------------------------- |
| 에러 상태 초기화       | 현재 에러 상태를 클리어               |
| 컴포넌트 트리 재렌더링 | 에러가 발생한 컴포넌트 트리 재렌더링  |
| 적용 범위              | error boundaries가 잡은 에러에만 동작 |

---

## 6. Error Boundary 제한사항

### Error Boundaries가 잡지 못하는 것

| 잡지 못하는 것               | 대안                                 |
| ---------------------------- | ------------------------------------ |
| 이벤트 핸들러 에러           | try/catch 또는 useState 사용         |
| 렌더 후 실행되는 비동기 코드 | useTransition 사용                   |
| error boundary 자체의 에러   | 부모 boundary 또는 global-error 사용 |
| 서버 사이드 렌더링 에러      | Server Component 조건부 렌더링       |

### 이벤트 핸들러 에러 처리

```tsx
'use client';

import { useState } from 'react';

export function Button() {
  const [error, setError] = useState<Error | null>(null);

  const handleClick = () => {
    try {
      // 실패할 수 있는 작업
      throw new Error('Exception');
    } catch (reason) {
      setError(reason as Error);
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  );
}
```

### useTransition 에러 처리

`startTransition` 내부의 처리되지 않은 에러는 가장 가까운 error boundary로 버블업:

```tsx
'use client';

import { useTransition } from 'react';

export function Button() {
  const [pending, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(() => {
      throw new Error('Exception'); // error boundary로 버블업
    });

  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  );
}
```

---

## 7. Server-Side Error Handling

### useActionState를 사용한 Server Functions

**모범 사례**: 예상되는 에러를 예외가 아닌 **반환값으로 모델링**합니다.

```ts
// app/actions.ts
'use server';

export async function createPost(
  prevState: { message: string },
  formData: FormData
) {
  const title = formData.get('title');
  const content = formData.get('content');

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) return { message: 'Failed to create post' };

  return { message: 'Post created successfully' };
}
```

**클라이언트 측 사용:**

```tsx
'use client';

import { useActionState } from 'react';
import { createPost } from '@/app/actions';

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, {
    message: '',
  });

  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  );
}
```

### Server Components - 조건부 렌더링

```tsx
export default async function Page() {
  const res = await fetch(`https://...`);
  const data = await res.json();

  if (!res.ok) return 'There was an error.';

  return <div>{/* 데이터 렌더링 */}</div>;
}
```

---

## 8. Not Found Errors

### notFound() 함수 사용

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound(); // not-found.js UI 트리거

  return <div>{post.title}</div>;
}
```

### not-found.tsx 파일 컨벤션

```tsx
// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return <div>404 - Page Not Found</div>;
}
```

---

## Best Practices

| 시나리오                          | 접근 방식                       | 도구                          |
| --------------------------------- | ------------------------------- | ----------------------------- |
| 예상되는 에러 (폼, API 실패)      | 에러를 상태로 반환              | `useActionState` 또는 반환값  |
| Server Components에서 데이터 없음 | 조건부 렌더링 또는 `notFound()` | `notFound()` + `not-found.js` |
| Uncaught exceptions               | 에러 throw, boundary가 잡음     | `error.tsx`                   |
| 이벤트 핸들러 에러                | 수동 try/catch + useState       | `try/catch` + `useState`      |
| 루트 레이아웃 에러                | 전역 error boundary             | `global-error.tsx`            |
| 렌더 후 비동기 코드               | `useTransition` 사용            | `startTransition`             |

---

## 에러 처리 결정 트리

```
┌─────────────────────────────────────────────────────────────┐
│                    에러 처리 결정 트리                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  예상되는 에러인가?                                          │
│  ├── Yes → 반환값으로 처리                                   │
│  │         ├── Server Action → useActionState               │
│  │         └── Server Component → 조건부 렌더링             │
│  │                                                          │
│  └── No → 예상치 못한 에러                                   │
│           ├── 이벤트 핸들러? → try/catch + useState          │
│           ├── 비동기 코드? → useTransition                   │
│           ├── 루트 레이아웃? → global-error.tsx              │
│           └── 일반 컴포넌트? → error.tsx                     │
│                                                             │
│  데이터를 찾을 수 없는가?                                    │
│  └── Yes → notFound() + not-found.tsx                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
