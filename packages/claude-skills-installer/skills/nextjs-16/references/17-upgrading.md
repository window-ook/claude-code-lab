# Next.js Upgrading Guide

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/upgrading

---

## Contents

- [1. 업그레이드 방법](#1-업그레이드-방법)
- [2. 시스템 요구사항](#2-시스템-요구사항)
- [3. Turbopack 기본값 변경](#3-turbopack-기본값-변경)
- [4. 비동기 Request API](#4-비동기-request-api)
- [5. middleware → proxy 변경](#5-middleware--proxy-변경)
- [6. next/image Breaking Changes](#6-nextimage-breaking-changes)
- [7. 캐싱 API 개선](#7-캐싱-api-개선)
- [8. React 19.2 및 React Compiler](#8-react-192-및-react-compiler)
- [9. ESLint 변경사항](#9-eslint-변경사항)
- [10. 제거된 기능](#10-제거된-기능)
- [11. 기타 Breaking Changes](#11-기타-breaking-changes)
- [12. 업그레이드 체크리스트](#12-업그레이드-체크리스트)

---

## 1. 업그레이드 방법

### AI 에이전트 활용 (MCP)

Model Context Protocol을 지원하는 AI 코딩 어시스턴트 사용:

```json
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

```
Next Devtools, help me upgrade my Next.js app to version 16
```

### 자동 업그레이드 (코드모드) - 권장

```bash
# Next.js 16+
next upgrade

# Next.js 15 이하
npx @next/codemod@canary upgrade latest
```

**자동 변환 항목:**

- `next.config.js`의 `turbopack` 설정 위치 변경
- `next lint` → ESLint CLI 마이그레이션
- `middleware` → `proxy` 컨벤션
- `unstable_` 접두사 제거
- `experimental_ppr` 라우트 세그먼트 설정 제거

### 수동 업그레이드

```bash
# npm
npm install next@latest react@latest react-dom@latest
npm install -D @types/react @types/react-dom eslint-config-next@latest

# pnpm
pnpm add next@latest react@latest react-dom@latest
pnpm add -D @types/react @types/react-dom eslint-config-next@latest

# yarn
yarn add next@latest react@latest react-dom@latest
yarn add -D @types/react @types/react-dom eslint-config-next@latest

# bun
bun add next@latest react@latest react-dom@latest
bun add -D @types/react @types/react-dom eslint-config-next@latest
```

### Canary 버전 (최신 기능 미리보기)

```bash
npm install next@canary
```

**Canary 전용 기능:**

- `forbidden()` 함수
- `unauthorized()` 함수
- `forbidden.js` 파일 규칙
- `unauthorized.js` 파일 규칙
- `authInterrupts` 설정

---

## 2. 시스템 요구사항

| 요구사항       | Next.js 16                                         |
| -------------- | -------------------------------------------------- |
| **Node.js**    | 20.9.0 이상 필수 (18 지원 중단)                    |
| **TypeScript** | 5.1.0 이상                                         |
| **브라우저**   | Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+ |

---

## 3. Turbopack 기본값 변경

### 기본 동작 변경 (Breaking Change)

**v15 (Turbopack 명시적 활성화):**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack"
  }
}
```

**v16 (Turbopack이 기본값):**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
```

**Webpack 사용 유지:**

```json
{
  "scripts": {
    "build": "next build --webpack"
  }
}
```

### 설정 위치 변경

**v15:**

```typescript
const nextConfig = {
  experimental: {
    turbopack: {
      /* options */
    },
  },
};
```

**v16:**

```typescript
const nextConfig = {
  turbopack: {
    /* options */
  },
};
```

### Node.js 네이티브 모듈 처리

```typescript
// next.config.ts
const nextConfig = {
  turbopack: {
    resolveAlias: {
      fs: {
        browser: './empty.ts',
      },
    },
  },
};
```

### Sass import 변경

```scss
// ❌ Webpack (레거시)
@import '~bootstrap/dist/css/bootstrap.min.css';

// ✅ Turbopack
@import 'bootstrap/dist/css/bootstrap.min.css';
```

### 파일시스템 캐싱 (베타)

```typescript
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};
```

---

## 4. 비동기 Request API

### 완전 비동기화된 API (Breaking Change)

다음 API는 **반드시 비동기**로 접근해야 합니다:

| API            | 영향 받는 파일                                    |
| -------------- | ------------------------------------------------- |
| `cookies()`    | 모든 서버 컴포넌트/Route Handler                  |
| `headers()`    | 모든 서버 컴포넌트/Route Handler                  |
| `draftMode()`  | 모든 서버 컴포넌트/Route Handler                  |
| `params`       | layout, page, route, default, generateMetadata 등 |
| `searchParams` | page.tsx                                          |

### params 마이그레이션

**v15:**

```tsx
export default function Page({ params }) {
  const slug = params.slug; // ❌ 동기 접근
}
```

**v16:**

```tsx
export default async function Page({ params }) {
  const { slug } = await params; // ✅ 비동기 접근
}
```

### 타입 자동 생성

```bash
npx next typegen
```

**자동 생성되는 타입 헬퍼:**

```tsx
// 자동 생성된 타입 사용
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const query = await props.searchParams;
  return <h1>Blog Post: {slug}</h1>;
}
```

### 이미지 생성 함수 변경

**v15:**

```tsx
export function generateImageMetadata({ params }) {
  const { slug } = params; // 동기
  return [{ id: '1' }];
}

export default function Image({ params, id }) {
  const slug = params.slug; // 동기
  const imageId = id; // 문자열
}
```

**v16:**

```tsx
export async function generateImageMetadata({ params }) {
  const { slug } = params; // 동기 (유지)
  return [{ id: '1' }];
}

export default async function Image({ params, id }) {
  const { slug } = await params; // ✅ 비동기
  const imageId = await id; // ✅ Promise<string>
}
```

### Sitemap ID 변경

**v16:**

```tsx
export default async function sitemap({ id }) {
  const resolvedId = await id; // ✅ Promise<string>
  const start = Number(resolvedId) * 50000;
}
```

---

## 5. middleware → proxy 변경

### 파일명 및 함수명 변경 (Breaking Change)

```bash
# 파일명 변경
mv middleware.ts proxy.ts
```

**v15:**

```typescript
// middleware.ts
export function middleware(request: Request) {
  // ...
}
```

**v16:**

```typescript
// proxy.ts
export function proxy(request: Request) {
  // ...
}
```

### 설정 플래그 변경

```typescript
// v15
const nextConfig = {
  skipMiddlewareUrlNormalize: true,
};

// v16
const nextConfig = {
  skipProxyUrlNormalize: true,
};
```

> **주의**: `edge` 런타임은 더 이상 지원되지 않습니다. proxy는 Node.js 런타임만 사용합니다.

---

## 6. next/image Breaking Changes

### 쿼리 문자열이 있는 로컬 이미지

```tsx
// 설정 필요
<Image src="/assets/photo?v=1" alt="Photo" width="100" height="100" />
```

```typescript
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '?v=1',
      },
    ],
  },
};
```

### 기본값 변경 요약

| 설정               | v15 기본값 | v16 기본값      |
| ------------------ | ---------- | --------------- |
| `minimumCacheTTL`  | 60초       | 14400초 (4시간) |
| `imageSizes`       | 16 포함    | 16 제외         |
| `qualities`        | 모든 품질  | [75]만          |
| `maximumRedirects` | 무제한     | 3               |

### 기존 동작 유지하려면

```typescript
const nextConfig = {
  images: {
    minimumCacheTTL: 60,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 75, 100], // 또는 필요한 품질들
    maximumRedirects: 10, // 또는 원하는 값
  },
};
```

### 로컬 IP 제한

```typescript
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, // 프라이빗 네트워크만 허용
  },
};
```

### 제거된 기능

```tsx
// ❌ 제거됨
import Image from 'next/legacy/image';

// ✅ 사용
import Image from 'next/image';
```

```javascript
// ❌ 제거됨
module.exports = {
  images: {
    domains: ['example.com'],
  },
};

// ✅ 대체
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};
```

---

## 7. 캐싱 API 개선

### revalidateTag - 새로운 서명

```typescript
'use server';
import { revalidateTag } from 'next/cache';

export async function updateArticle(articleId: string) {
  // 'max' 옵션: 사용자가 스테일 데이터를 보는 동안 백그라운드에서 재검증
  revalidateTag(`article-${articleId}`, 'max');
}
```

### updateTag - 신규 API (즉시 업데이트)

```typescript
'use server';
import { updateTag } from 'next/cache';

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile);
  // 사용자가 변경사항을 즉시 확인 (read-your-writes)
  updateTag(`user-${userId}`);
}
```

### refresh - 라우터 새로고침

```typescript
'use server';
import { refresh } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.markAsRead(notificationId);
  refresh(); // 헤더의 알림 수 새로고침
}
```

### unstable\_ 접두사 제거

```typescript
// v15
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache';

// v16
import { cacheLife, cacheTag } from 'next/cache';
```

---

## 8. React 19.2 및 React Compiler

### React 19.2 주요 신기능

| 기능             | 설명                                 |
| ---------------- | ------------------------------------ |
| View Transitions | 네비게이션 중 요소 애니메이션        |
| `useEffectEvent` | Effect 내 비반응형 로직 추출         |
| Activity         | `display: none`으로 배경 활동 렌더링 |

### React Compiler (안정화)

```typescript
const nextConfig = {
  reactCompiler: true,
};
```

```bash
npm install -D babel-plugin-react-compiler
```

---

## 9. ESLint 변경사항

### next lint 명령 제거

```bash
# ❌ 제거됨
next lint

# ✅ 직접 사용
npx eslint .
npx biome check .
```

**마이그레이션 코드모드:**

```bash
npx @next/codemod@canary next-lint-to-eslint-cli .
```

### ESLint Flat Config

`@next/eslint-plugin-next`가 기본값으로 ESLint Flat Config를 사용합니다.

```javascript
// eslint.config.js (Flat Config)
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
];
```

---

## 10. 제거된 기능

### AMP 지원 완전 제거

```tsx
// ❌ 모두 제거됨
import { useAmp } from 'next/amp';
export const config = { amp: true };
```

### 런타임 설정 제거

**v15:**

```javascript
module.exports = {
  serverRuntimeConfig: { dbUrl: process.env.DATABASE_URL },
  publicRuntimeConfig: { apiUrl: '/api' },
};
```

**v16 - 서버 값:**

```tsx
// Server Component에서 직접 접근
async function fetchData() {
  const dbUrl = process.env.DATABASE_URL;
  return await db.query(dbUrl, 'SELECT * FROM users');
}
```

**v16 - 클라이언트 값:**

```bash
# .env.local
NEXT_PUBLIC_API_URL="/api"
```

```tsx
'use client';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**런타임 환경 변수 (번들링 방지):**

```tsx
import { connection } from 'next/server';

export default async function Page() {
  await connection();
  const config = process.env.RUNTIME_CONFIG;
  return <p>{config}</p>;
}
```

### devIndicators 옵션 제거

- ❌ `appIsrStatus`
- ❌ `buildActivity`
- ❌ `buildActivityPosition`

### dynamicIO → cacheComponents

**v15:**

```javascript
module.exports = {
  experimental: { dynamicIO: true },
};
```

**v16:**

```javascript
module.exports = {
  cacheComponents: true,
};
```

### PPR → Cache Components

**v15:**

```javascript
module.exports = {
  experimental: { ppr: true },
};
```

**v16:**

```javascript
module.exports = {
  cacheComponents: true,
};
```

---

## 11. 기타 Breaking Changes

### Parallel Routes - default.js 필수

모든 parallel route 슬롯에 명시적 `default.js` 필수:

```tsx
// app/@modal/default.tsx
import { notFound } from 'next/navigation';

export default function Default() {
  notFound();
  // 또는 return null
}
```

### Scroll Behavior 변경

**v15:** Next.js가 `scroll-behavior: smooth` 자동 오버라이드

**v16:** 오버라이드 안 함

**기존 동작 복원:**

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
```

### next build 출력 변경

- ❌ `size`, `First Load JS` 메트릭 제거
- 이유: RSC 기반 아키텍처에서 부정확
- 권장: Chrome Lighthouse, Vercel Analytics 사용

### next dev 설정 로드 최적화

```javascript
// ❌ 작동하지 않음
if (process.argv.includes('dev')) {
  /* ... */
}

// ✅ 대체 방법
const isDev = process.env.NODE_ENV === 'development';
```

### 동시 dev와 build 실행

- `next dev` → `.next/dev` 출력
- `next build` → `.next` 출력

---

## 12. 업그레이드 체크리스트

### 필수 항목

- [ ] Node.js 20.9.0+ 업그레이드
- [ ] `npm install next@latest react@latest react-dom@latest` 실행
- [ ] `npm run build` 테스트
- [ ] 코드모드 실행: `npx @next/codemod@canary upgrade latest`

### 코드 변경

- [ ] 비동기 Request API 마이그레이션 (`params`, `searchParams`, `cookies()`, `headers()`)
- [ ] `middleware.ts` → `proxy.ts` 이름 변경
- [ ] Turbopack 설정 위치 변경 (`experimental.turbopack` → `turbopack`)
- [ ] Parallel routes에 `default.js` 추가

### 설정 변경

- [ ] `next/image` 설정 검토 (`minimumCacheTTL`, `imageSizes`, `qualities`)
- [ ] `images.domains` → `images.remotePatterns` 마이그레이션
- [ ] ESLint 설정 검토 (Flat Config)
- [ ] `next lint` → ESLint CLI 변경

### 제거된 기능 확인

- [ ] AMP 사용 여부 확인 (제거됨)
- [ ] `serverRuntimeConfig`/`publicRuntimeConfig` 사용 여부 확인 (제거됨)
- [ ] `next/legacy/image` 사용 여부 확인 (제거됨)

### 테스트

- [ ] 모든 페이지 렌더링 테스트
- [ ] API Routes 동작 테스트
- [ ] 이미지 최적화 동작 테스트
- [ ] 프로덕션 빌드 테스트

---

## 관련 리소스

- [Next.js DevTools MCP](https://www.npmjs.com/package/next-devtools-mcp)
- [ESLint 마이그레이션 가이드](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Chrome Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)
- [GitHub Discussion](https://github.com/vercel/next.js/discussions/77721)
