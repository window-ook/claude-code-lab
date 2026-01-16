# Next.js Cache Components

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/cache-components

---

## Contents

- [1. 'use cache' Directive](#1-use-cache-directive)
- [2. Cache Profiles와 cacheLife](#2-cache-profiles와-cachelife)
- [3. Cache Tags와 cacheTag](#3-cache-tags와-cachetag)
- [4. Revalidation Strategies](#4-revalidation-strategies)
- [5. Cache Scope](#5-cache-scope)
- [6. Dynamic Data와 Caching](#6-dynamic-data와-caching)
- [7. Cache Invalidation Strategies](#7-cache-invalidation-strategies)
- [8. Migration Guide](#8-migration-guide)
- [Best Practices](#best-practices)

---

## Overview

Cache Components는 opt-in 기능으로 (`cacheComponents: true` in Next config), **Partial Prerendering (PPR)**을 활성화하여 단일 라우트에서 정적, 캐시된, 동적 콘텐츠를 혼합하여 최적의 성능과 신선도를 제공합니다.

---

## 1. 'use cache' Directive

### 목적

비동기 함수와 컴포넌트의 반환값을 캐시하여, 프리렌더링 중 정적 셸에 포함하거나 런타임에 여러 요청에서 재사용할 수 있게 합니다.

### 문법 & 적용 레벨

```tsx
// 함수 레벨
async function getCachedData() {
  'use cache';
  // 캐시된 로직
}

// 컴포넌트 레벨
export default async function Page() {
  'use cache';
  // 캐시된 로직
}

// 파일 레벨
('use cache');
// 전체 파일이 캐시됨
```

### 주요 특성

| 특성                      | 설명                                                    |
| ------------------------- | ------------------------------------------------------- |
| 인자가 캐시 키가 됨       | 다른 입력은 별도의 캐시 항목 생성                       |
| 클로저 값 포함            | 부모 스코프 값이 자동으로 캐시 키의 일부                |
| 개인화 가능               | 다른 매개변수에 대해 여러 캐시 항목                     |
| 런타임 데이터와 혼합 불가 | `cookies()`, `headers()` 등은 같은 스코프에서 사용 불가 |

### 기본 예시

```tsx
import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife('hours');

  const users = await db.query('SELECT * FROM users');

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 2. Cache Profiles와 cacheLife

### 목적

미리 정의된 프로필이나 커스텀 설정을 사용하여 캐시 지속 시간을 정의합니다. `use cache` 스코프 내에서만 동작합니다.

### 미리 정의된 프로필

```tsx
import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife('hours'); // 빠르게 변하는 데이터
  // 또는
  cacheLife('days'); // 정기적 업데이트
  // 또는
  cacheLife('weeks'); // 드문 변경
  // 또는
  cacheLife('max'); // 최대/무기한 캐싱
}
```

### 커스텀 설정

```tsx
import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife({
    stale: 3600, // 1시간 후 stale로 간주 (여전히 사용 가능)
    revalidate: 7200, // 2시간 후 재검증
    expire: 86400, // 1일 후 만료
  });

  const users = await db.query('SELECT * FROM users');
  return <ul>{/* users 렌더링 */}</ul>;
}
```

### 설정 매개변수

| 매개변수     | 설명                                                     |
| ------------ | -------------------------------------------------------- |
| `stale`      | 콘텐츠가 stale로 간주되지만 여전히 사용 가능한 시간 (초) |
| `revalidate` | 새 데이터를 가져올 때까지의 시간 (초)                    |
| `expire`     | 캐시 항목이 완전히 만료될 때까지의 시간 (초)             |

---

## 3. Cache Tags와 cacheTag

### cacheTag 함수

캐시된 데이터를 의미적 태그와 연결하여 조직적인 무효화를 가능하게 합니다:

```tsx
import { cacheTag } from 'next/cache';

export async function getBlogPosts() {
  'use cache';
  cacheTag('posts');

  const res = await fetch('https://api.example.com/blog');
  return res.json();
}

export async function getProductCatalog() {
  'use cache';
  cacheTag('products');

  const res = await fetch('https://api.example.com/products');
  return res.json();
}
```

### 여러 태그

```tsx
export async function getCart() {
  'use cache';
  cacheTag('cart', 'user-data');
  // 데이터 페칭
}
```

---

## 4. Revalidation Strategies

### updateTag - 즉시 재검증

같은 요청 내에서 캐시된 데이터를 **만료시키고 즉시 새로고침**해야 할 때 사용:

```tsx
// app/actions.ts
import { cacheTag, updateTag } from 'next/cache';

export async function getCart() {
  'use cache';
  cacheTag('cart');
  return await fetchCartData();
}

export async function updateCart(itemId: string) {
  'use server';
  // 데이터베이스 업데이트
  await db.updateCart(itemId);
  // 즉시 재검증 및 새로고침
  updateTag('cart');
}
```

**사용 사례**: 즉각적인 캐시 업데이트가 필요할 때 (장바구니, 실시간 재고)

### revalidateTag - Stale-While-Revalidate

최종 일관성을 허용하며 캐시 항목을 무효화하고 싶을 때 사용:

```tsx
// app/actions.ts
import { cacheTag, revalidateTag } from 'next/cache';

export async function getPosts() {
  'use cache';
  cacheTag('posts');
  return await fetchBlogPosts();
}

export async function createPost(post: FormData) {
  'use server';
  // 새 포스트 작성
  await saveBlogPost(post);
  // 재검증을 위해 캐시 표시
  revalidateTag('posts', 'max');
}
```

**사용 사례**: 최종 일관성을 허용할 수 있는 정적 콘텐츠 (블로그, CMS)

### updateTag vs revalidateTag

| 함수            | 동작                   | 사용 사례                |
| --------------- | ---------------------- | ------------------------ |
| `updateTag`     | 즉시 만료 및 새로고침  | 장바구니, 실시간 재고    |
| `revalidateTag` | Stale-while-revalidate | 블로그, CMS, 정적 콘텐츠 |

---

## 5. Cache Scope

### 컴포넌트 레벨 캐싱 (권장)

정적 셸을 최대화하기 위해 `use cache`를 데이터 접근에 가능한 가깝게 배치:

```tsx
import { Suspense } from 'react';
import { cacheLife } from 'next/cache';

// 캐시된 컴포넌트 - 이것만 동적으로 페칭
async function BlogPosts() {
  'use cache';
  cacheLife('hours');

  const res = await fetch('https://api.vercel.app/blog');
  const posts = await res.json();

  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>
              By {post.author} on {post.date}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// 페이지는 캐시된 컴포넌트 사용
export default function Page() {
  return (
    <>
      <header>
        <h1>Blog</h1>
      </header>
      <BlogPosts />
    </>
  );
}
```

### 페이지 레벨 캐싱

모든 콘텐츠가 같은 캐시 요구사항을 공유할 때 전체 페이지나 레이아웃을 캐시:

```tsx
import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife('days');

  // 여기의 모든 데이터 페칭이 캐시됨
  const data1 = await fetch('...');
  const data2 = await fetch('...');

  return <div>{/* 렌더링 */}</div>;
}
```

---

## 6. Dynamic Data와 Caching

### 패턴: 외부 소스에서 캐시된 콘텐츠

모든 요청에서 새 데이터가 필요하지 않을 때 외부 API의 동적 콘텐츠를 캐시:

```tsx
// 모든 사용자가 같은 블로그 포스트를 봄
async function CachedContent() {
  'use cache';
  cacheLife('hours');

  const data = await fetch('https://api.example.com/data');
  const users = await db.query('SELECT * FROM users');

  return <div>정적 셸에 포함</div>;
}
```

### 패턴: 런타임 데이터 + 캐시된 함수

런타임 데이터를 추출하고 캐시된 함수에 전달:

```tsx
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { cacheLife } from 'next/cache';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

// 컴포넌트가 런타임 데이터 읽음 (캐시 안 됨)
async function ProfileContent() {
  const session = (await cookies()).get('session')?.value;
  return <CachedContent sessionId={session} />;
}

// 캐시된 함수가 런타임 데이터를 인자로 받음
async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache';
  // sessionId가 캐시 키의 일부가 됨
  cacheLife('hours');

  const data = await fetchUserData(sessionId);
  return <div>{data}</div>;
}
```

### 패턴: 비결정적 연산

`use cache` 내에서 비결정적 연산은 프리렌더링 중 한 번만 실행됩니다:

```tsx
export default async function Page() {
  'use cache';

  // 한 번 실행, 모든 요청에 캐시됨
  const random = Math.random();
  const uuid = crypto.randomUUID();
  const now = Date.now();

  return (
    <div>
      <p>{random}</p>
      <p>{uuid}</p>
      <p>{now}</p>
    </div>
  );
}
```

캐시가 재검증될 때까지 모든 요청이 같은 랜덤 값을 제공합니다.

---

## 7. Cache Invalidation Strategies

### 전략 1: 시간 기반 (자동)

미리 정의된 또는 커스텀 기간으로 `cacheLife` 사용:

```tsx
// 매 시간 자동으로 재검증
'use cache';
cacheLife('hours');
```

### 전략 2: `updateTag`로 온디맨드

Server Actions에서 즉각적인 캐시 무효화:

```tsx
'use server';

async function updateProduct(id: string, data: any) {
  await db.updateProduct(id, data);
  updateTag('products', 'product-' + id);
}
```

### 전략 3: `revalidateTag`로 온디맨드

Stale-while-revalidate 패턴:

```tsx
'use server';

async function publishBlogPost(post: any) {
  await saveToDB(post);
  revalidateTag('posts', 'max');
}
```

### 전략 4: CMS 패턴

긴 캐시 기간과 태그를 사용하고 업데이트 시 `revalidateTag`에 의존:

```tsx
// 며칠간 캐시, 온디맨드로 무효화
export async function getContent() {
  'use cache';
  cacheTag('content');
  cacheLife('days');

  return await fetchCMSContent();
}

// 관리자 액션이 재검증 트리거
export async function updateContent(newContent: any) {
  'use server';
  await saveToDB(newContent);
  revalidateTag('content');
}
```

---

## 8. Migration Guide

### `dynamic = 'force-dynamic'` 제거

필요 없음 - 모든 페이지가 기본적으로 동적:

```tsx
// 이전
export const dynamic = 'force-dynamic';

// 이후 - 그냥 제거
```

### `dynamic = 'force-static'` 대체

`use cache`와 `cacheLife` 사용:

```tsx
// 이전
export const dynamic = 'force-static';
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>...</div>;
}

// 이후
export default async function Page() {
  'use cache';
  cacheLife('max');
  const data = await fetch('https://api.example.com/data');
  return <div>...</div>;
}
```

### `revalidate` 대체

`cacheLife` 함수 사용:

```tsx
// 이전
export const revalidate = 3600;

// 이후
('use cache');
cacheLife('hours');
```

### `fetchCache` 제거

필요 없음 - `use cache`가 모든 페칭 제어:

```tsx
// 이전
export const fetchCache = 'force-cache';

// 이후 - 'use cache' 사용
export default async function Page() {
  'use cache';
  // 여기의 모든 fetch가 캐시됨
}
```

---

## Best Practices

### ✅ DO

| 모범 사례                          | 설명                            |
| ---------------------------------- | ------------------------------- |
| `use cache`를 데이터 접근에 가깝게 | 정적 셸 콘텐츠 최대화           |
| 의미적 기간으로 `cacheLife` 사용   | `'hours'`, `'days'`, `'weeks'`  |
| 관련 캐시 데이터에 태그            | 일괄 무효화 가능                |
| 캐싱 전 런타임 데이터 추출         | 캐시된 함수에 인자로 전달       |
| 즉각 업데이트에 `updateTag`        | 장바구니, 재고                  |
| 최종 일관성에 `revalidateTag`      | 블로그, 정적 콘텐츠             |
| 컴포넌트 레벨에서 캐시             | 정적 vs 동적에 대한 세밀한 제어 |

### ❌ DON'T

| 피해야 할 것                   | 이유                                    |
| ------------------------------ | --------------------------------------- |
| `use cache`와 런타임 API 혼합  | 먼저 데이터 추출 후 인자로 전달         |
| 모든 것 캐시                   | 자주 업데이트가 필요 없는 데이터만 캐시 |
| 캐시 무효화 무시               | 미리 재검증 전략 계획                   |
| `runtime: 'edge'` 사용         | Cache Components는 Node.js 런타임 필요  |
| 캐시 키 고려 잊기              | 인자와 클로저 값이 키에 영향            |
| 민감한 런타임 데이터 직접 캐시 | 항상 추출하고 props로 전달              |
