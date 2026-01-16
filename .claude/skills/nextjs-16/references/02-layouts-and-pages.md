# Next.js Layouts and Pages

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/layouts-and-pages

---

## Contents

- [1. Pages](#1-pages)
- [2. Layouts](#2-layouts)
- [3. Templates](#3-templates)
- [4. Dynamic Routes](#4-dynamic-routes)
- [5. Search Parameters](#5-search-parameters)
- [6. Linking Between Pages](#6-linking-between-pages)
- [7. Route Props Helpers](#7-route-props-helpers)

---

## 1. Pages

### 페이지 생성

**page**는 특정 라우트에 렌더링되는 UI입니다. 페이지를 생성하려면:

- `app` 디렉토리 내에 `page` 파일 추가
- React 컴포넌트를 default export

```tsx
// app/page.tsx - 인덱스 페이지 (/)
export default function Page() {
  return <h1>Hello Next.js!</h1>;
}
```

### 라우트 공개 설정

폴더 내에 `page.tsx` (또는 `page.js`) 파일을 추가하면 라우트가 공개적으로 접근 가능해집니다.

```
app/
├── page.tsx          → URL: /
└── blog/
    └── page.tsx      → URL: /blog
```

```tsx
// app/blog/page.tsx
import { getPosts } from '@/lib/posts';
import { Post } from '@/ui/post';

export default async function Page() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
}
```

---

## 2. Layouts

### 레이아웃 생성

**layout**은 여러 페이지 간에 **공유**되는 UI입니다. 레이아웃의 특징:

- 네비게이션 시 상태 유지
- 인터랙티브 상태 유지
- 리렌더링 없음

레이아웃을 생성하려면:

- `layout` 파일 생성
- React 컴포넌트를 default export
- `children` prop 받기 (페이지 또는 중첩 레이아웃)

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 레이아웃 UI */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### 루트 레이아웃 요구사항

- **루트 레이아웃**은 `app` 디렉토리 루트에 정의
- **필수** 파일
- 반드시 `<html>`과 `<body>` 태그 포함

### 중첩 레이아웃

폴더 계층 구조의 레이아웃은 자동으로 중첩되며, `children` prop을 통해 자식 레이아웃을 래핑합니다.

```
app/
├── layout.tsx              → 루트 레이아웃
└── blog/
    ├── layout.tsx          → 블로그 레이아웃
    ├── page.tsx            → /blog
    └── [slug]/
        └── page.tsx        → /blog/[slug]
```

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
```

**중첩 결과**: 루트 레이아웃이 블로그 레이아웃을 래핑하고, 블로그 레이아웃이 블로그 페이지와 블로그 포스트 페이지를 래핑합니다.

---

## 3. Templates

### 레이아웃 vs 템플릿

| 특성      | Layout                    | Template                                   |
| --------- | ------------------------- | ------------------------------------------ |
| 상태 유지 | 네비게이션 시 상태 유지   | 매번 새 인스턴스 생성                      |
| 리렌더링  | 리렌더링 없음             | 매 네비게이션마다 리렌더링                 |
| 사용 사례 | 헤더, 사이드바 등 공유 UI | 페이지 전환 애니메이션, 페이지별 useEffect |

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

**템플릿 사용 시점**:

- 페이지 진입/이탈 애니메이션
- `useEffect`에 의존하는 기능 (페이지 조회수 로깅 등)
- 매 네비게이션마다 상태 초기화가 필요한 경우

---

## 4. Dynamic Routes

### 동적 세그먼트 생성

**동적 세그먼트**는 데이터에서 생성되는 라우트를 허용합니다. 폴더 이름을 대괄호로 감쌉니다: `[segmentName]`

```
app/blog/[slug]/page.tsx    → /blog/my-first-post
```

```tsx
// app/blog/[slug]/page.tsx
// Next.js 16에서 params는 Promise입니다
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

### PageProps 헬퍼 사용 (권장)

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  return <h1>Blog post: {slug}</h1>;
}
```

동적 세그먼트 내의 레이아웃도 `params` prop에 접근할 수 있습니다.

---

## 5. Search Parameters

### 서버 컴포넌트에서 searchParams 사용

서버 컴포넌트 페이지에서 `searchParams` prop을 사용하여 검색 파라미터에 접근:

```tsx
// app/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = (await searchParams).filters;
  // filters를 사용한 데이터 페칭
}
```

**주의**: `searchParams` 사용 시 페이지가 **동적 렌더링**으로 전환됩니다.

### 클라이언트 컴포넌트에서 searchParams 사용

클라이언트 컴포넌트에서는 `useSearchParams` 훅 사용:

```tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function Component() {
  const searchParams = useSearchParams();
  const filters = searchParams.get('filters');
  // ...
}
```

### 사용 시점 가이드

| 방법                             | 사용 시점                                    |
| -------------------------------- | -------------------------------------------- |
| `searchParams` prop              | 페이지 데이터 로드 (페이지네이션, DB 필터링) |
| `useSearchParams` hook           | 클라이언트 전용 (미리 로드된 데이터 필터링)  |
| `new URLSearchParams(window...)` | 콜백/이벤트 핸들러에서 리렌더링 없이 읽기    |

---

## 6. Linking Between Pages

### Link 컴포넌트

`next/link`의 `<Link>` 컴포넌트를 사용하여 네비게이션:

```tsx
// app/ui/post.tsx
import Link from 'next/link';

export default async function Post({ post }) {
  const posts = await getPosts();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

### Link 컴포넌트 특징

| 특징                  | 설명                                 |
| --------------------- | ------------------------------------ |
| HTML `<a>` 확장       | 기본 앵커 태그 기능 포함             |
| 프리페칭              | 뷰포트에 들어오면 자동 프리페치      |
| 클라이언트 네비게이션 | SPA처럼 부드러운 페이지 전환         |
| 기본 네비게이션 방법  | Next.js에서 권장하는 네비게이션 방식 |

고급 네비게이션이 필요한 경우 `useRouter` 훅 사용.

---

## 7. Route Props Helpers

Next.js는 타입 안전한 라우트 props를 위한 유틸리티 타입을 제공합니다.

### PageProps

`page` 컴포넌트용, `params`와 `searchParams` 포함:

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  return <h1>Blog post: {slug}</h1>;
}
```

### LayoutProps

`layout` 컴포넌트용, `children`과 명명된 슬롯 포함:

```tsx
// app/dashboard/layout.tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {/* @analytics 같은 명명된 슬롯이 타입된 props로 나타남 */}
    </section>
  );
}
```

### 주요 특징

| 특징           | 설명                                             |
| -------------- | ------------------------------------------------ |
| 전역 사용 가능 | import 없이 사용 가능                            |
| 정적 라우트    | `params`가 `{}`로 해결됨                         |
| 타입 생성 시점 | `next dev`, `next build`, `next typegen` 실행 시 |

---

## File System Routing 구조

Next.js는 **파일 시스템 기반 라우팅** 사용:

- **폴더**: URL 세그먼트에 매핑되는 라우트 세그먼트 정의
- **파일** (`page`, `layout`): 세그먼트에 대한 UI 생성

```
URL: /blog/hello-world

라우트 세그먼트:
├── /           → 루트 세그먼트
├── blog        → 세그먼트
└── hello-world → 리프 세그먼트 (동적)
```
