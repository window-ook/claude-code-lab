---
name: nextjs-16
description: Next.js 16 App Router development guide with latest patterns (params Promise, PageProps helpers, useActionState, Server Components, Cache Components, Proxy). Use when creating pages, layouts, routes, Server Actions, or working with Next.js 16 projects.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Next. js 16 Quick Reference

**Version:** 16.1.2 (Jan 2026)
**Doc Source:** Official Next.js documentation

---

##

🚨 CRITICAL RULES (Always Enforce)

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
