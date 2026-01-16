# Next.js Updating Data

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/updating-data

---

## Contents

- [1. Server Actions](#1-server-actions)
- [2. Form Handling](#2-form-handling)
- [3. useActionState Hook](#3-useactionstate-hook)
- [4. Programmatic Form Submission](#4-programmatic-form-submission)
- [5. Revalidating Data](#5-revalidating-data)
- [6. Redirecting After Mutations](#6-redirecting-after-mutations)
- [7. Error Handling](#7-error-handling)
- [8. Optimistic Updates](#8-optimistic-updates)
- [9. Cookies in Server Actions](#9-cookies-in-server-actions)
- [Best Practices](#best-practices)

---

## 1. Server Actions

### 정의

**Server Action**은 `'use server'` 지시어로 표시된 비동기 함수로, 서버에서 실행되며 클라이언트에서 네트워크 요청을 통해 호출할 수 있습니다.

### 파일 레벨 지시어

모든 export를 Server Action으로 표시:

```ts
// app/lib/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  // 데이터 업데이트
  // 캐시 재검증
}

export async function deletePost(formData: FormData) {
  const id = formData.get('id');
  // 데이터 업데이트
  // 캐시 재검증
}
```

### 함수 레벨 지시어

개별 함수를 Server Action으로 표시:

```ts
// app/lib/actions.ts
export async function createPost(formData: FormData) {
  'use server';
  // ...
}
```

### Server Component에서 정의

```tsx
// app/page.tsx
export default function Page() {
  async function createPost(formData: FormData) {
    'use server';
    // ...
  }

  return <>{/* Component JSX */}</>;
}
```

### Client Component에서 호출

Client Component에서는 Server Action을 직접 정의할 수 없지만, import하여 사용할 수 있습니다:

```ts
// app/actions.ts
'use server';

export async function createPost() {}
```

```tsx
// app/ui/button.tsx
'use client';

import { createPost } from '@/app/actions';

export function Button() {
  return <button formAction={createPost}>Create</button>;
}
```

### Props로 Action 전달

```tsx
// app/client-component.tsx
'use client';

export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void;
}) {
  return <form action={updateItemAction}>{/* ... */}</form>;
}
```

---

## 2. Form Handling

### action prop으로 Form 사용

```tsx
// app/ui/form.tsx
import { createPost } from '@/app/actions';

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  );
}
```

### 주요 특징

| 특징                    | 설명                                              |
| ----------------------- | ------------------------------------------------- |
| FormData 자동 수신      | Server Action이 자동으로 `FormData` 객체 받음     |
| Native 메서드 사용      | `FormData` 네이티브 메서드로 데이터 추출          |
| Progressive Enhancement | Server Components에서 기본 지원 (JS 없이도 동작)  |
| HTTP POST               | 내부적으로 `POST` HTTP 메서드 사용                |
| 큐잉                    | JS 미로드 시 폼 제출 큐잉, 하이드레이션 우선 처리 |

### button formAction prop

```tsx
<button formAction={deletePost}>Delete</button>
```

---

## 3. useActionState Hook

### 목적

Server Action 실행 중 pending/loading 상태를 표시합니다.

### 구현

```tsx
// app/ui/button.tsx
'use client';

import { useActionState, startTransition } from 'react';
import { createPost } from '@/app/actions';
import { LoadingSpinner } from '@/app/ui/loading-spinner';

export function Button() {
  const [state, action, pending] = useActionState(createPost, false);

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  );
}
```

### Hook 반환값

| 반환값    | 설명                                  |
| --------- | ------------------------------------- |
| `state`   | Server Action이 반환한 상태           |
| `action`  | form 또는 이벤트 핸들러에 전달할 함수 |
| `pending` | action 실행 중인지 나타내는 boolean   |

---

## 4. Programmatic Form Submission

### Event Handler 사용 (onClick)

```tsx
// app/like-button.tsx
'use client';

import { incrementLike } from './actions';
import { useState } from 'react';

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike();
          setLikes(updatedLikes);
        }}
      >
        Like
      </button>
    </>
  );
}
```

### useEffect 사용

```tsx
// app/view-count.tsx
'use client';

import { incrementViews } from './actions';
import { useState, useEffect, useTransition } from 'react';

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews();
      setViews(updatedViews);
    });
  }, []);

  return <p>Total Views: {views}</p>;
}
```

### 사용 사례

- 전역 이벤트로 트리거되는 뮤테이션
- 키보드 단축키
- Intersection observer
- 컴포넌트 마운트 시

---

## 5. Revalidating Data

### revalidatePath 사용

특정 경로에 대한 Next.js 캐시를 재검증하고 업데이트된 데이터 표시:

```ts
// app/lib/actions.ts
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  'use server';
  // 데이터 업데이트
  // ...

  revalidatePath('/posts');
}
```

### revalidateTag 사용

특정 태그로 캐시된 데이터를 재검증:

```ts
// app/lib/actions.ts
import { revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  'use server';
  // 데이터 업데이트
  // ...

  revalidateTag('posts');
}
```

### refresh 사용

클라이언트 라우터를 새로고침하여 최신 데이터 표시:

```ts
// app/lib/actions.ts
'use server';

import { refresh } from 'next/cache';

export async function updatePost(formData: FormData) {
  // 데이터 업데이트
  // ...

  refresh();
}
```

**참고**: `refresh()`는 태그된 데이터를 재검증하지 않습니다 — 대신 `updateTag` 또는 `revalidateTag` 사용.

### 재검증 함수 비교

| 함수             | 용도                       | 특징                     |
| ---------------- | -------------------------- | ------------------------ |
| `revalidatePath` | 특정 경로 재검증           | 경로 기반                |
| `revalidateTag`  | 특정 태그 재검증           | 태그 기반                |
| `updateTag`      | 태그된 캐시 무효화         | revalidateTag 대안       |
| `refresh`        | 클라이언트 라우터 새로고침 | 태그 데이터 재검증 안 함 |

---

## 6. Redirecting After Mutations

```ts
// app/lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  // 데이터 업데이트
  // ...

  revalidatePath('/posts');
  redirect('/posts');
}
```

### 중요한 동작

| 동작             | 설명                                              |
| ---------------- | ------------------------------------------------- |
| 제어 흐름 예외   | `redirect()`는 프레임워크가 처리하는 예외를 throw |
| 이후 코드 미실행 | `redirect()` 이후 코드는 실행되지 않음            |
| 재검증 순서      | `redirect()` 전에 `revalidatePath/Tag` 호출 필요  |

---

## 7. Error Handling

### 기본 패턴

```ts
// app/lib/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');

  if (!title) throw new Error('제목이 필요합니다.');

  const result = await db.posts.create({ title });

  if (!result) throw new Error('포스트 생성에 실패했습니다.');

  revalidatePath('/posts');
  return { success: true };
}
```

### 상태 반환 패턴

```ts
// app/lib/actions.ts
'use server';

export interface IActionState {
  success: boolean;
  message: string;
}

export async function createPost(
  prevState: IActionState,
  formData: FormData
): Promise<IActionState> {
  const title = formData.get('title');

  if (!title) return { success: false, message: '제목이 필요합니다.' };

  const result = await db.posts.create({ title });

  if (!result)
    return { success: false, message: '포스트 생성에 실패했습니다.' };

  revalidatePath('/posts');
  return { success: true, message: '포스트가 생성되었습니다.' };
}
```

---

## 8. Optimistic Updates

### 기본 패턴

```tsx
// app/like-button.tsx
'use client';

import { incrementLike } from './actions';
import { useState } from 'react';

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          setLikes(likes + 1); // Optimistic update
          const updatedLikes = await incrementLike(); // Server mutation
          setLikes(updatedLikes); // Reconcile with server
        }}
      >
        Like
      </button>
    </>
  );
}
```

### useOptimistic Hook 사용

```tsx
'use client';

import { useOptimistic } from 'react';
import { incrementLike } from './actions';

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, _) => state + 1
  );

  return (
    <form
      action={async () => {
        addOptimisticLike(null);
        await incrementLike();
      }}
    >
      <p>Total Likes: {optimisticLikes}</p>
      <button type="submit">Like</button>
    </form>
  );
}
```

---

## 9. Cookies in Server Actions

### Cookie 관리

```ts
// app/actions.ts
'use server';

import { cookies } from 'next/headers';

export async function exampleAction() {
  const cookieStore = await cookies();

  // Cookie 가져오기
  cookieStore.get('name')?.value;

  // Cookie 설정
  cookieStore.set('name', 'Delba');

  // Cookie 삭제
  cookieStore.delete('name');
}
```

**동작**: Cookie를 설정하거나 삭제할 때, Next.js가 현재 페이지와 레이아웃을 서버에서 다시 렌더링하여 새 쿠키 값으로 UI를 업데이트합니다.

---

## Best Practices

| 카테고리                | 모범 사례                                                   |
| ----------------------- | ----------------------------------------------------------- |
| Action 정의             | 재사용을 위해 별도 파일에 Server Action 정의                |
| 캐시 재검증             | 뮤테이션 후 항상 `revalidatePath` 또는 `revalidateTag` 호출 |
| 리다이렉트 순서         | `redirect()` 전에 재검증 함수 호출                          |
| 에러 처리               | Early return 패턴 또는 throw 사용                           |
| Optimistic Updates      | 즉각적 피드백을 위해 `useOptimistic` hook 활용              |
| 로딩 상태               | `useActionState`로 pending 상태 표시                        |
| Progressive Enhancement | Server Component에서 form action 사용하여 JS 없이도 동작    |

---

## 핵심 설계 원칙

| 원칙        | 설명                                                      |
| ----------- | --------------------------------------------------------- |
| 비동기 설계 | Server Action은 네트워크 요청 지원을 위해 항상 비동기     |
| 순차 실행   | 클라이언트가 Server Action을 순차적으로 디스패치하고 대기 |
| 병렬 작업   | 단일 Server Action/Route Handler 내에서 병렬 작업 수행    |
| 캐싱 통합   | Next.js 캐싱 아키텍처와 통합되어 단일 왕복 업데이트 가능  |
