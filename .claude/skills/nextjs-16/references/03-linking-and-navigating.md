# Next.js Linking and Navigating

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/linking-and-navigating

---

## Contents

- [1. Link Component](#1-link-component)
- [2. Prefetching](#2-prefetching)
- [3. Streaming & Loading States](#3-streaming--loading-states)
- [4. Native History API](#4-native-history-api)
- [5. useLinkStatus Hook](#5-uselinkstatus-hook)
- [6. Dynamic Routes 최적화](#6-dynamic-routes-최적화)
- [7. Performance 최적화](#7-performance-최적화)
- [Best Practices](#best-practices)

---

## 1. Link Component

### 기본 사용법

`<Link>` 컴포넌트는 Next.js에서 클라이언트 사이드 네비게이션을 활성화하는 기본 방법입니다:

```tsx
import Link from 'next/link';

export default function Navigation() {
  return <Link href="/blog">Blog</Link>;
}
```

### 주요 특징

| 특징                   | 설명                                        |
| ---------------------- | ------------------------------------------- |
| 자동 프리페칭          | 링크가 뷰포트에 들어오거나 호버 시 프리페치 |
| 클라이언트 사이드 전환 | 전체 페이지 리로드 없이 상태와 스크롤 유지  |
| 공유 레이아웃          | 네비게이션 간 UI 상태 유지                  |

### prefetch Prop 제어

```tsx
// 프리페칭 완전 비활성화
<Link prefetch={false} href="/blog">Blog</Link>

// 호버 시에만 프리페칭 (리소스 효율적)
<Link prefetch={active ? null : false} href="/blog">Blog</Link>
```

### 라우트 타입별 프리페칭 동작

| 라우트 타입 | 프리페칭 동작                                 |
| ----------- | --------------------------------------------- |
| 정적 라우트 | 전체 라우트 프리페치                          |
| 동적 라우트 | 스킵되거나 부분 프리페치 (`loading.tsx` 필요) |

---

## 2. Prefetching

### 자동 프리페칭 트리거

- 링크가 뷰포트에 진입할 때
- 링크를 호버할 때
- `<Link>` 컴포넌트에서만 동작 (일반 `<a>` 태그는 프리페치 안 함)

### 서버 렌더링 전략

**정적 렌더링 (Prerendering)**

- 빌드 타임 또는 재검증 시 발생
- 결과가 캐시됨
- 전체 라우트 프리페치 가능

**동적 렌더링**

- 클라이언트 요청에 응답하여 요청 시점에 발생
- 부분 프리페칭을 위해 `loading.tsx` 필요
- `loading.tsx` 없으면 콘텐츠 표시 전 대기 시간 발생

### 클라이언트 사이드 전환

전체 페이지 리로드 대신 Next.js는:

- 공유 레이아웃과 UI 유지
- 현재 페이지를 프리페치된 로딩 상태 또는 새 페이지로 교체
- 스크롤 위치와 상태 유지
- 서버 렌더링 앱이 클라이언트 렌더링 앱처럼 "느껴지게" 함

---

## 3. Streaming & Loading States

### loading.tsx로 로딩 상태 생성

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />;
}
```

### 동작 원리

1. Next.js가 자동으로 `page.tsx`를 `<Suspense>` 경계로 래핑
2. 라우트 로딩 중 프리페치된 폴백 UI 표시
3. 준비되면 실제 콘텐츠로 교체

### 장점

| 장점                 | 설명                                 |
| -------------------- | ------------------------------------ |
| 즉각적 네비게이션    | 시각적 피드백 즉시 제공              |
| 인터랙티브 레이아웃  | 공유 레이아웃이 인터랙티브 상태 유지 |
| Core Web Vitals 개선 | TTFB, FCP, TTI 향상                  |

### 동적 라우트용 loading.tsx

```tsx
// app/blog/[slug]/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />;
}
```

---

## 4. Native History API

### window.history.pushState

히스토리 스택에 새 항목 추가 (사용자가 뒤로 갈 수 있음):

```tsx
// app/ui/sort-products.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SortProducts() {
  const searchParams = useSearchParams();

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortOrder);
    window.history.pushState(null, '', `?${params.toString()}`);
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  );
}
```

**사용 사례**: 정렬, 필터링, 페이지네이션

### window.history.replaceState

현재 히스토리 항목 교체 (사용자가 뒤로 갈 수 없음):

```tsx
// app/ui/locale-switcher.tsx
'use client';

import { usePathname } from 'next/navigation';

export function LocaleSwitcher() {
  const pathname = usePathname();

  function switchLocale(locale: string) {
    const newPath = `/${locale}${pathname}`;
    window.history.replaceState(null, '', newPath);
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  );
}
```

**사용 사례**: 로케일 전환, 영구적 네비게이션 변경

### pushState vs replaceState

| 메서드         | 히스토리       | 사용 사례                  |
| -------------- | -------------- | -------------------------- |
| `pushState`    | 새 항목 추가   | 정렬, 필터링, 페이지네이션 |
| `replaceState` | 현재 항목 교체 | 로케일 전환, 인증 상태     |

---

## 5. useLinkStatus Hook

### 느린 네트워크 처리

프리페칭이 사용자 클릭 전에 완료되지 않을 수 있으며, 로딩 스켈레톤이 즉시 나타나지 않을 수 있습니다.

### useLinkStatus 사용

```tsx
// app/ui/loading-indicator.tsx
'use client';

import { useLinkStatus } from 'next/link';

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  );
}
```

### 모범 사례

디바운스 딜레이 추가 권장 (예: 100ms 애니메이션 딜레이, `opacity: 0`으로 시작):

- 인디케이터는 네비게이션이 예상보다 오래 걸릴 때만 표시
- 빠른 네비게이션에서는 깜빡임 방지

---

## 6. Dynamic Routes 최적화

### 문제: 동적 라우트에서 느린 전환

**`loading.tsx` 없이:**

- 클라이언트가 서버 응답 전까지 대기
- 사용자에게 응답 없는 것처럼 느껴짐
- 부분 프리페치 불가

**해결책: `loading.tsx` 추가**

- 부분 프리페칭 활성화
- 즉각적 네비게이션 트리거
- 데이터 로딩 중 로딩 스켈레톤 표시

### generateStaticParams로 빌드 타임 생성

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // ...
}
```

**장점**: 라우트가 빌드 타임에 사전 렌더링되어 완전히 프리페치 가능

---

## 7. Performance 최적화

### 번들 사이즈 축소

- `@next/bundle-analyzer`로 큰 의존성 식별
- 가능하면 클라이언트에서 서버로 로직 이동
- 기본적으로 서버 컴포넌트 사용

### 하이드레이션 개선

- React Selective Hydration이 지연된 하이드레이션 완화
- JavaScript 번들 사이즈 축소
- 초기 방문 시 프리페칭 지연 방지

### 호버 기반 프리페칭 전략

리소스 사용 제한을 위해 호버 시에만 프리페치:

```tsx
// app/ui/hover-prefetch-link.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

function HoverPrefetchLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  );
}
```

---

## Best Practices

| 모범 사례                         | 세부 내용                                |
| --------------------------------- | ---------------------------------------- |
| `<Link>` 컴포넌트 사용            | 프리페칭과 클라이언트 사이드 전환 활성화 |
| `loading.tsx` 추가                | 동적 라우트에서 부분 프리페칭 활성화     |
| `generateStaticParams` 사용       | 동적 세그먼트를 빌드 타임에 사전 렌더링  |
| `useLinkStatus` 구현              | 느린 네비게이션 중 피드백 표시           |
| 되돌릴 수 있는 변경에 `pushState` | 정렬, 필터링, 페이지네이션               |
| 영구 변경에 `replaceState`        | 로케일 전환, 인증 상태                   |
| 번들 사이즈 최적화                | 빠른 하이드레이션 = 빠른 프리페칭        |
| 대량 링크에 호버 프리페치         | 불필요한 리소스 사용 감소                |
| 일반 `<a>` 태그는 프리페치 안 함  | 앱 내 네비게이션에는 항상 `<Link>` 사용  |
