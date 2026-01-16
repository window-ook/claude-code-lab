# Next.js Fetching Data

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/fetching-data

---

## Contents

- [1. Server Components Data Fetching](#1-server-components-data-fetching)
- [2. Client Components Data Fetching](#2-client-components-data-fetching)
- [3. Parallel Data Fetching](#3-parallel-data-fetching)
- [4. Sequential Data Fetching](#4-sequential-data-fetching)
- [5. Preloading Data](#5-preloading-data)
- [6. Request Deduplication과 Caching](#6-request-deduplication과-caching)
- [7. Streaming](#7-streaming)
- [Best Practices](#best-practices)

---

## 1. Server Components Data Fetching

### Fetch API 사용

Server Components는 비동기 작업을 지원하여 `fetch` API를 직접 사용할 수 있습니다:

```tsx
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog');
  const posts = await data.json();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 주요 특징

| 특징               | 설명                                        |
| ------------------ | ------------------------------------------- |
| 기본 캐싱 없음     | `fetch` 응답은 기본적으로 캐시되지 않음     |
| 프리렌더링         | Next.js가 라우트를 프리렌더링하고 출력 캐시 |
| 동적 렌더링 옵트인 | `{ cache: 'no-store' }` 사용                |
| 개발 디버깅        | fetch 호출을 개발 중 로깅 가능              |

### ORM과 Database Client 사용

Server Components는 서버에서 실행되므로 데이터베이스 쿼리를 안전하게 직접 실행할 수 있습니다:

```tsx
import { db, posts } from '@/lib/db';

export default async function Page() {
  const allPosts = await db.select().from(posts);
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## 2. Client Components Data Fetching

### React `use` Hook

Promise를 props로 전달하여 서버에서 클라이언트로 데이터를 스트리밍:

**Server Component (부모):**

```tsx
import Posts from '@/app/ui/posts';
import { Suspense } from 'react';

export default function Page() {
  const posts = getPosts(); // await 하지 않음
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  );
}
```

**Client Component (자식):**

```tsx
'use client';

import { use } from 'react';

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>;
}) {
  const allPosts = use(posts);
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Community Libraries (SWR/React Query)

SWR을 사용한 클라이언트 사이드 데이터 페칭 예시:

```tsx
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

## 3. Parallel Data Fetching

`Promise.all`을 사용하여 여러 요청을 동시에 시작:

```tsx
export default async function Page({ params }) {
  const { username } = await params;

  // 요청을 동시에 시작
  const artistData = getArtist(username);
  const albumsData = getAlbums(username);

  // 모든 Promise 대기
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  );
}
```

### 에러 처리

하나의 실패가 전체 작업을 중단시키지 않아야 할 때 `Promise.allSettled()` 사용:

```tsx
const [artistResult, albumsResult] = await Promise.allSettled([
  artistData,
  albumsData,
]);

// 각 결과의 status를 확인하여 처리
```

---

## 4. Sequential Data Fetching

한 요청이 다른 요청의 데이터에 의존할 때:

```tsx
export default async function Page({ params }) {
  const { username } = await params;

  // 먼저 아티스트 정보 가져오기
  const artist = await getArtist(username);

  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* 아티스트 ID를 의존 컴포넌트에 전달 */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}

async function Playlists({ artistID }: { artistID: string }) {
  const playlists = await getArtistPlaylists(artistID);
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}
```

**모범 사례**: 순차 요청이 완료되는 동안 로딩 상태를 표시하려면 전체 페이지를 `<Suspense>` 또는 `loading.js`로 래핑합니다.

---

## 5. Preloading Data

컴포넌트 렌더링 전에 데이터 페칭을 미리 시작:

```tsx
export default async function Page({ params }) {
  const { id } = await params;

  // 아이템 데이터 로딩 시작
  preload(id);

  // 데이터 로딩 중 다른 작업 수행
  const isAvailable = await checkIsAvailable();

  return isAvailable ? <Item id={id} /> : null;
}

const preload = (id: string) => {
  void getItem(id);
};
```

### React `cache`를 사용한 재사용 가능한 패턴

```tsx
import { cache } from 'react';
import 'server-only';

export const preload = (id: string) => {
  void getItem(id);
};

export const getItem = cache(async (id: string) => {
  // 데이터 페칭 로직
});
```

---

## 6. Request Deduplication과 Caching

### Request Memoization

Next.js는 단일 렌더링 패스 내에서 동일한 URL과 옵션을 가진 `fetch` 호출을 자동으로 중복 제거합니다:

| 특성        | 설명              |
| ----------- | ----------------- |
| 스코프      | 요청 수명 동안    |
| 지원 메서드 | `GET`과 `HEAD`    |
| 옵트아웃    | Abort signal 사용 |

### Data Cache

`cache: 'force-cache'` 옵션을 사용하여 렌더링 패스와 요청 간에 데이터 공유.

### React Cache 함수

fetch가 아닌 데이터 소스의 경우, React의 `cache()` 함수로 래핑:

```tsx
import { cache } from 'react';
import { db, posts, eq } from '@/lib/db';

export const getPost = cache(async (id: string) => {
  return await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  });
});
```

---

## 7. Streaming

### `loading.js` 사용

페이지와 같은 폴더에 `loading.js` 파일을 생성하여 전체 페이지를 스트리밍:

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

로딩 UI가 네비게이션 시 즉시 표시되고, 렌더링이 완료되면 콘텐츠가 교체됩니다.

### `<Suspense>` 사용

페이지의 어떤 섹션을 스트리밍할지 세밀하게 제어:

```tsx
import { Suspense } from 'react';
import BlogList from '@/components/BlogList';
import BlogListSkeleton from '@/components/BlogListSkeleton';

export default function BlogPage() {
  return (
    <div>
      {/* 클라이언트에 즉시 전송 */}
      <header>
        <h1>Welcome to the Blog</h1>
      </header>

      {/* fetch 완료 후 스트리밍 */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  );
}
```

### 의미 있는 로딩 상태 만들기

| 방법                | 설명                         |
| ------------------- | ---------------------------- |
| 스켈레톤과 스피너   | 콘텐츠 형태를 미리 보여줌    |
| 의미 있는 요소 표시 | 커버 사진, 제목 등 미리 표시 |
| React DevTools      | 개발 중 로딩 상태 미리보기   |

---

## Best Practices

| 카테고리          | 모범 사례                                             |
| ----------------- | ----------------------------------------------------- |
| Server Components | `async`/`await`와 `fetch`, ORM, 파일시스템 API 사용   |
| Client Components | 스트리밍을 위해 `use` hook 또는 SWR, React Query 사용 |
| 성능              | 독립적인 요청은 `Promise.all()`로 병렬화              |
| Sequential Data   | `<Suspense>`로 전체 페이지 블로킹 방지                |
| 캐싱              | request memoization과 data cache 활용                 |
| 스트리밍          | `loading.js` 또는 `<Suspense>` 경계로 UX 개선         |
| 프리로딩          | 의존 컴포넌트 렌더링 전에 데이터를 미리 페칭          |

---

## Data Fetching 패턴 요약

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Fetching 결정 트리                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  서버에서 데이터 필요?                                       │
│  ├── Yes → Server Component에서 async/await 사용            │
│  │         ├── 독립적인 여러 요청? → Promise.all()          │
│  │         └── 의존적 요청? → Sequential + Suspense         │
│  │                                                          │
│  └── No → Client Component에서 데이터 페칭                  │
│           ├── 서버에서 시작? → use hook + Promise props     │
│           └── 클라이언트에서 시작? → SWR/React Query        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
