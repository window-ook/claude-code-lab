# Next.js Caching and Revalidating

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/caching-and-revalidating

---

## Contents

- [1. fetch API 캐싱](#1-fetch-api-캐싱)
- [2. cacheTag 함수](#2-cachetag-함수)
- [3. revalidateTag 함수](#3-revalidatetag-함수)
- [4. updateTag 함수](#4-updatetag-함수)
- [5. revalidatePath 함수](#5-revalidatepath-함수)
- [6. unstable_cache 함수 (레거시)](#6-unstable_cache-함수-레거시)
- [캐싱 전략 비교](#캐싱-전략-비교)
- [Best Practices](#best-practices)

---

## 1. fetch API 캐싱

### 기본 동작

`fetch` 요청은 **기본적으로 캐시되지 않습니다**. 하지만 Next.js는 `fetch` 요청이 있는 라우트를 프리렌더링하고 HTML을 캐시합니다.

### 강제 캐싱

```tsx
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' });
}
```

### 시간 기반 재검증

```tsx
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } });
}
```

지정된 초 후에 캐시된 데이터를 재검증합니다.

### 태그를 사용한 온디맨드 재검증

```tsx
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: {
      tags: ['user'],
    },
  });
}
```

### fetch 옵션 요약

| 옵션                      | 설명                          |
| ------------------------- | ----------------------------- |
| `cache: 'force-cache'`    | 응답을 강제로 캐시            |
| `cache: 'no-store'`       | 캐싱 비활성화                 |
| `next: { revalidate: N }` | N초 후 재검증                 |
| `next: { tags: [...] }`   | 태그로 온디맨드 재검증 활성화 |

**참고**: 라우트가 동적임을 보장해야 하는 경우 `connection` API를 사용하세요.

---

## 2. cacheTag 함수

### 목적

`use cache` 지시어와 Cache Components와 함께 사용하여 `fetch` 요청 외의 모든 계산을 캐싱할 수 있습니다.

### 사용법

```tsx
import { cacheTag } from 'next/cache';

export async function getProducts() {
  'use cache';
  cacheTag('products');

  const products = await db.query('SELECT * FROM products');
  return products;
}
```

### 적용 범위

| 범위              | 설명                        |
| ----------------- | --------------------------- |
| 데이터베이스 쿼리 | ORM이나 직접 쿼리 결과 캐싱 |
| 파일 시스템 작업  | 파일 읽기 결과 캐싱         |
| 서버 사이드 계산  | 기타 서버 측 연산 결과 캐싱 |

`revalidateTag` 또는 `updateTag`를 사용하여 재검증할 수 있습니다.

---

## 3. revalidateTag 함수

### 목적

이벤트 발생 후 태그 기반으로 캐시 항목을 재검증합니다.

### 두 가지 동작 모드

**`profile="max"` 사용 (권장)**:

```tsx
import { revalidateTag } from 'next/cache';

export async function updateUser(id: string) {
  revalidateTag('user', 'max'); // stale-while-revalidate 시맨틱 사용
}
```

- 백그라운드에서 새 콘텐츠를 가져오는 동안 stale 콘텐츠 제공
- 빠른 응답으로 더 나은 사용자 경험

**레거시 동작** (Deprecated):

```tsx
revalidateTag('user'); // 캐시 즉시 만료
```

### 사용 위치

- Route Handlers
- Server Actions

### 재사용성

여러 함수에서 동일한 태그를 사용하여 한 번에 모두 무효화할 수 있습니다.

---

## 4. updateTag 함수

### 목적

Server Actions에서 read-your-own-writes 시나리오를 위해 캐시된 데이터를 즉시 만료시킵니다.

### 사용법

```tsx
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  });

  // 가시성을 위해 캐시 즉시 만료
  updateTag('posts');
  updateTag(`post-${post.id}`);

  redirect(`/posts/${post.id}`);
}
```

### 주요 특성

| 특성      | 설명                 |
| --------- | -------------------- |
| 사용 위치 | Server Actions만     |
| 동작      | 캐시 즉시 만료       |
| 사용 사례 | read-your-own-writes |

### revalidateTag vs updateTag 비교

| 기능      | `updateTag`          | `revalidateTag`                 |
| --------- | -------------------- | ------------------------------- |
| 사용 위치 | Server Actions만     | Server Actions & Route Handlers |
| 동작      | 즉시 만료            | stale-while-revalidate 가능     |
| 사용 사례 | read-your-own-writes | 일반 캐시 무효화                |

---

## 5. revalidatePath 함수

### 목적

이벤트 발생 후 전체 라우트를 재검증합니다.

### 사용법

```tsx
import { revalidatePath } from 'next/cache';

export async function updateUser(id: string) {
  // 데이터 뮤테이션
  revalidatePath('/profile');
}
```

### 사용 위치

- Route Handlers
- Server Actions

### 경로 옵션

```tsx
// 특정 페이지 재검증
revalidatePath('/blog/post-1');

// 레이아웃 포함 재검증
revalidatePath('/blog', 'layout');

// 동적 라우트 재검증
revalidatePath('/blog/[slug]', 'page');
```

---

## 6. unstable_cache 함수 (레거시)

### 주의

**실험적이고 deprecated** - Cache Components의 `use cache` 지시어 사용을 권장합니다.

### 기본 사용법

```tsx
import { unstable_cache } from 'next/cache';
import { getUserById } from '@/app/lib/data';

export default async function Page({ params }) {
  const { userId } = await params;

  const getCachedUser = unstable_cache(
    async () => {
      return getUserById(userId);
    },
    [userId] // 캐시 키
  );
}
```

### 고급 옵션

```tsx
const getCachedUser = unstable_cache(
  async () => {
    return getUserById(userId);
  },
  [userId],
  {
    tags: ['user'], // 재검증용 태그
    revalidate: 3600, // 재검증까지 초
  }
);
```

### 마이그레이션

Cache Components에서 `use cache` 지시어와 `cacheTag`로 대체하세요.

```tsx
// 이전 (unstable_cache)
const getCachedUser = unstable_cache(
  async () => getUserById(userId),
  [userId],
  { tags: ['user'] }
);

// 이후 (use cache + cacheTag)
async function getCachedUser(userId: string) {
  'use cache';
  cacheTag('user');
  return getUserById(userId);
}
```

---

## 캐싱 전략 비교

### 함수별 비교

| 함수             | 용도             | 동작                        | 사용 위치                      |
| ---------------- | ---------------- | --------------------------- | ------------------------------ |
| `cacheTag`       | 캐시 태그 지정   | `use cache`와 함께 사용     | Server Components              |
| `revalidateTag`  | 태그 기반 재검증 | stale-while-revalidate 지원 | Server Actions, Route Handlers |
| `updateTag`      | 즉시 캐시 만료   | 즉각 만료                   | Server Actions만               |
| `revalidatePath` | 경로 기반 재검증 | 전체 라우트 재검증          | Server Actions, Route Handlers |

### 시나리오별 권장 전략

| 시나리오                | 권장 전략                           |
| ----------------------- | ----------------------------------- |
| 정적 데이터             | `fetch` + `cache: 'force-cache'`    |
| 주기적 업데이트         | `fetch` + `next: { revalidate: N }` |
| 사용자 액션 후 업데이트 | `updateTag` (Server Actions)        |
| 백그라운드 재검증       | `revalidateTag` + `profile="max"`   |
| DB 쿼리 캐싱            | `use cache` + `cacheTag`            |
| 전체 페이지 재검증      | `revalidatePath`                    |

---

## Best Practices

| 모범 사례                              | 설명                             |
| -------------------------------------- | -------------------------------- |
| 드물게 변하는 데이터에 `force-cache`   | 정적 데이터는 강제 캐싱          |
| 시간 기반 업데이트에 `next.revalidate` | 주기적 재검증 필요 시            |
| 세밀한 제어에 태그 + `revalidateTag`   | 특정 데이터만 무효화             |
| `profile="max"` 사용                   | stale-while-revalidate로 UX 개선 |
| Server Actions에서 `updateTag`         | 즉각적 캐시 만료가 필요할 때     |
| `use cache` + `cacheTag` 사용          | 레거시 `unstable_cache` 대체     |
| 전체 라우트 무효화에 `revalidatePath`  | 경로 전체 재검증 필요 시         |
| 동적 라우트 보장에 `connection` API    | 캐싱 없이 동적 렌더링 필요 시    |
