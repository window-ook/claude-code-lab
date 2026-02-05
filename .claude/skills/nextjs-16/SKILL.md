---
name: nextjs-16
description: Next.js 16 App Router development guide with latest patterns (params Promise, PageProps helpers, useActionState, Server Components, Cache Components, Proxy). Use when creating pages, layouts, routes, Server Actions, or working with Next.js 16 projects.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Next.js 16 Quick Reference

**Version:** 16.1.2 (Jan 2026)

## 🎯 Skill 목적

Next.js 16 App Router 기반 개발 시 최신 패턴과 베스트 프랙티스를 적용합니다. params Promise 처리, PageProps 헬퍼, useActionState, Server Components, Cache Components 등 Next.js 16의 핵심 변경사항을 올바르게 구현하도록 안내합니다.

## 🔑 활성화 조건

### 활성화 키워드

- "Next.js", "nextjs", "next js"
- "App Router"
- "Server Component", "서버 컴포넌트"
- "Server Action", "서버 액션"
- "페이지 생성", "page 생성"
- "레이아웃 생성", "layout 생성"
- "라우트 생성", "route 생성"
- "params", "searchParams"
- "useActionState"

### 필수 조건

- Next.js 16 프로젝트에서 작업 중일 때
- App Router 패턴을 사용하는 코드 작성 시
- Server Actions 또는 Server Components 구현 시

---
**Doc Source:** Official Next.js documentation

---

## 🚨 CRITICAL RULES (Always Enforce)

### 1. params are Promise

```typescript
// ❌ WRONG
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>;
}

// ✅ CORRECT
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  return <h1>{slug}</h1>;
}
```

### 2. Use useActionsState (NOT useFormState)

```typescript
// ❌ DEPRECATED
import { useFormState } from 'react-dom';

// ✅ CORRECT
import { useActionState } from 'react-dom';
```

### 3. Form Actions Return Void

```typescript
// ❌ WRONG - Form actions can't return data
export async function submitForm(formData: FormData) {
  'use server';
  return { success: true }; // Type error!
}

// ✅ CORRECT
export async function submitForm(formData: FormData) {
  'use server';
  await saveData(formData);
  revalidatePath('/posts');
}
```

### 4. No `any` Types

```typescript
// ❌ WRONG
const data:any = await fetch(...);

// ✅ CORRECT
const data:Post[] = await fetch(...).then(r => r.json());
```

### 5. Use PageProps/LayoutProps Helpers

```typescript
// ✅ Type-safe with auto-completion
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
}
```

### 6. Use 'use cache' for Cached Dynamic content

```typescript
// ❌ WRONG - Dynamic data without caching
export default async function Page() {
    const posts = await db.posts.findMany() // Fetched on every request
    return <PostList posts={posts}>;
}

// ✅ CORRECT - Cache with 'use cache'
'use cache'
import {cacheLife} from 'next/cache'

export default async function Page() {
    cacheLife('hours') // Cache for 1 hour
    const posts = await db.posts.findMany()
    return <PostList posts={posts}>;
}
```

---

## Essential Patterns

### Static Page

```typescript
// app/about/page.tsx
export const metaData = {
  title: 'About',
  description: 'About Page',
};

export default function Page() {
  return <h1>About</h1>;
}
```

## 📚 When to Read Additional Files

### Project Setup

**Starting new project?** → [references/01-project-structure.md](references/01-project-structure.md)

- Folder conventions (app/, pages/, public/, src/)
- File conventions (page.tsx, layout.tsx, route.ts)
- Route groups `(marketing)`, private folders `_lib`

### Creating Routes

**Creating pages/layouts?** → [references/02-layouts-and-pages.md](references/02-layouts-and-pages.md)

- Static and dynamic pages
- Nested routes and layouts
- Dynamic segments `[slug]`, catch-all `[...slug]`
- Parallel routes `@modal`, intercepting routes `(.)`

### Navigation

**Implementing links?** → [references/03-linking-and-navigating.md](references/03-linking-and-navigating.md)

- `<Link>` component usage
- Prefetching strategies
- Streaming with `loading.tsx`
- `useLinkStatus` hook for slow networks

### Server/Client Components

**Choosing component type?** → [references/04-server-and-client-components.md](references/04-server-and-client-components.md)

- When to use Server vs Client Components
- `'use client'` directive placement
- Composition patterns, serialization boundaries

### Cache Components

**Caching dynamic content?** → [references/05-cache-components.md](references/05-cache-components.md)

- `'use cache'` directive
- `cacheLife`, `cacheTag` APIs
- Cache scope (component, page, function level)

### Data Fetching

**Fetching data?** → [references/06-fetching-data.md](references/06-fetching-data.md)

- Server Component data fetching
- `fetch` with `next.revalidate`, `next.tags`
- Parallel data fetching, streaming

**Updating data?** → [references/07-updating-data.md](references/07-updating-data.md)

- Server Actions, `'use server'`
- Form handling, `useActionState`
- `revalidatePath`, `revalidateTag`

### Caching & Revalidation

**Caching strategy?** → [references/08-caching-and-revalidating.md](references/08-caching-and-revalidating.md)

- Time-based vs on-demand revalidation
- `unstable_cache`, Data Cache, Full Route Cache

### Error Handling

**Handling errors?** → [references/09-error-handling.md](references/09-error-handling.md)

- `error.tsx`, `global-error.tsx`
- Error recovery, `reset` function
- `notFound()`, `not-found.tsx`

### Styling

**Setting up CSS?** → [references/10-css.md](references/10-css.md)

- CSS Modules, Tailwind CSS
- Global styles, CSS-in-JS

### Optimization

**Optimizing images?** → [references/11-image-optimization.md](references/11-image-optimization.md)

- `<Image>` component, `sizes`, `priority`
- Remote images, `next.config.js` domains

**Optimizing fonts?** → [references/12-font-optimization.md](references/12-font-optimization.md)

- `next/font/google`, `next/font/local`
- Font subsetting, variable fonts

### SEO & Metadata

**Adding metadata?** → [references/13-metadata-and-og-images.md](references/13-metadata-and-og-images.md)

- Static/dynamic metadata export
- `generateMetadata`, Open Graph images
- `opengraph-image.tsx` convention

### API Routes

**Creating API endpoints?** → [references/14-route-handlers.md](references/14-route-handlers.md)

- `route.ts` GET, POST, PUT, DELETE
- Request/Response handling, streaming

### Proxy

**Setting up proxy?** → [references/15-proxy.md](references/15-proxy.md)

- `next.config.js` rewrites
- Middleware proxy patterns

### Deployment

**Deploying?** → [references/16-deploying.md](references/16-deploying.md)

- Vercel, self-hosted, static export
- Environment variables, build configuration

### Upgrading

**Upgrading Next.js?** → [references/17-upgrading.md](references/17-upgrading.md)

- Migration guides, codemods
- Breaking changes checklist
