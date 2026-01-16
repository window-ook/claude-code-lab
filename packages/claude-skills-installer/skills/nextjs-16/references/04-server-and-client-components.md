# Next.js Server and Client Components

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## Contents

- [1. Server Components](#1-server-components)
- [2. Client Components](#2-client-components)
- [3. Rendering Environments](#3-rendering-environments)
- [4. Component Composition Patterns](#4-component-composition-patterns)
- [5. Interleaving Server and Client Components](#5-interleaving-server-and-client-components)
- [6. Sharing Data Between Components](#6-sharing-data-between-components)
- [7. Server-Only Code 보호](#7-server-only-code-보호)
- [8. Third-Party Components](#8-third-party-components)
- [9. Context Providers Pattern](#9-context-providers-pattern)
- [Best Practices](#best-practices)

---

## 1. Server Components

### 기본 동작

Next.js에서 레이아웃과 페이지는 **기본적으로 Server Components**입니다. 서버에서만 실행되며 여러 이점을 제공합니다.

### 사용 시점

| 사용 사례            | 설명                                          |
| -------------------- | --------------------------------------------- |
| 데이터 페칭          | DB나 API에서 소스 근처에서 데이터 가져오기    |
| 보안 정보 접근       | API 키, 토큰 등을 클라이언트에 노출 없이 사용 |
| JavaScript 번들 감소 | 브라우저로 보내는 JS 양 줄이기                |
| 성능 개선            | FCP 향상 및 콘텐츠 점진적 스트리밍            |

### 주요 특성

- `'use client'` 지시어 불필요
- async/await로 데이터 페칭 지원
- 백엔드 리소스에 직접 접근
- 클라이언트 측 JavaScript 번들 사이즈 감소

---

## 2. Client Components

### 'use client' 지시어

클라이언트 컴포넌트는 파일 상단, import 위에 `'use client'` 지시어로 표시합니다.

```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### 사용 시점

| 사용 사례         | 예시                                    |
| ----------------- | --------------------------------------- |
| 상태 관리         | `useState`, 상태 변수                   |
| 이벤트 핸들러     | `onClick`, `onChange` 등                |
| 라이프사이클 로직 | `useEffect` 및 기타 React 훅            |
| 브라우저 전용 API | `localStorage`, `window`, `geolocation` |
| 커스텀 훅         | 재사용 가능한 클라이언트 측 로직        |

### 중요한 동작

`'use client'` 지시어는 Server와 Client 모듈 그래프 사이의 **경계** 역할을 합니다. 파일이 `'use client'`로 표시되면, **모든 import와 자식 컴포넌트가 클라이언트 번들의 일부로 간주**됩니다. 모든 자식 컴포넌트에 지시어를 추가할 필요가 없습니다.

---

## 3. Rendering Environments

### 서버 측 렌더링 프로세스

**서버에서:**

- Next.js가 React API를 사용하여 렌더링 조율
- 렌더링 작업이 라우트 세그먼트별로 청크로 분할
- **Server Components**는 **RSC Payload**로 렌더링
- **Client Components**와 RSC Payload로 HTML 사전 렌더링

### RSC Payload란?

RSC Payload는 렌더링된 React Server Components 트리의 컴팩트한 바이너리 표현입니다:

| 포함 내용                     | 설명                                               |
| ----------------------------- | -------------------------------------------------- |
| Server Components 렌더링 결과 | 서버에서 렌더링된 컴포넌트 출력                    |
| Client Components 위치        | 클라이언트 컴포넌트가 렌더링될 위치와 JS 파일 참조 |
| Props                         | Server → Client로 전달된 props                     |

### 클라이언트 측 첫 로드 프로세스

```
1. HTML → 빠른 비인터랙티브 미리보기 즉시 표시
2. RSC Payload → Client와 Server Component 트리 조정
3. JavaScript → Client Components 하이드레이션, 앱 인터랙티브화
```

### Hydration이란?

하이드레이션은 React가 정적 HTML을 인터랙티브하게 만들기 위해 DOM에 이벤트 핸들러를 연결하는 프로세스입니다.

### 후속 네비게이션

- **RSC Payload**가 프리페치 및 캐시되어 즉각적 네비게이션
- **Client Components**는 서버 렌더링 HTML 없이 클라이언트에서 완전히 렌더링

---

## 4. Component Composition Patterns

### JavaScript 번들 사이즈 줄이기

큰 섹션을 Client Components로 표시하는 대신, 특정 인터랙티브 컴포넌트에만 `'use client'`를 추가합니다.

```tsx
// app/layout.tsx - 기본적으로 Server Component
import Search from './search'; // Client Component
import Logo from './logo'; // Server Component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  );
}
```

```tsx
// app/ui/search.tsx
'use client';

export default function Search() {
  // 이 컴포넌트만 클라이언트 측 기능 필요
}
```

### Server Component에서 데이터 페칭 후 Client로 전달

```tsx
// app/[id]/page.tsx - Server Component
import LikeButton from '@/app/ui/like-button';
import { getPost } from '@/lib/data';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div>
      <h1>{post.title}</h1>
      <LikeButton likes={post.likes} />
    </div>
  );
}
```

```tsx
// app/ui/like-button.tsx - Client Component
'use client';

import { useState } from 'react';

export default function LikeButton({ likes }: { likes: number }) {
  // 서버에서 전달받은 likes prop으로 인터랙티비티 처리
}
```

---

## 5. Interleaving Server and Client Components

Server Components를 Client Components에 props로 전달하여, 클라이언트 컴포넌트 내에 서버 렌더링 UI를 시각적으로 중첩할 수 있습니다.

### `children`을 사용한 슬롯 패턴

```tsx
// app/ui/modal.tsx - Client Component
'use client';

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

```tsx
// app/page.tsx - Server Component
import Modal from './ui/modal';
import Cart from './ui/cart'; // Server Component

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  );
}
```

**핵심 포인트**: props로 전달된 것들을 포함한 모든 Server Components는 미리 서버에서 렌더링됩니다. RSC payload에는 Client Components가 트리 내에서 렌더링될 위치의 참조가 포함됩니다.

---

## 6. Sharing Data Between Components

### Server에서 Client로 Props 전달

Props는 Server Components에서 Client Components로 직접 전달할 수 있습니다. Props는 React에 의해 **직렬화 가능**해야 합니다.

```tsx
// Server Component
const post = await getPost(id);
return <LikeButton likes={post.likes} />;

// Client Component 수신: { likes: number }
```

### 대안: `use` Hook으로 데이터 스트리밍

`use` Hook을 사용하여 Server Component에서 Client Component로 데이터를 스트리밍할 수 있습니다.

---

## 7. Server-Only Code 보호

JavaScript 모듈은 Server와 Client Components 간에 공유될 수 있어, 민감한 서버 코드가 실수로 클라이언트에 import될 위험이 있습니다.

### 문제 예시

```ts
// lib/data.ts - API 키 포함
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY, // 클라이언트에 절대 도달하면 안 됨
    },
  });
  return res.json();
}
```

### 해결책: `server-only` 패키지

```bash
npm install server-only
```

```ts
// lib/data.ts
import 'server-only'; // Client Component에서 import 시 빌드 타임 에러 발생

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });
  return res.json();
}
```

### 클라이언트 코드용 패키지

`client-only` 패키지는 클라이언트 전용 로직(`window` 객체 접근 등)을 포함하는 모듈을 표시합니다.

### 환경 변수

| 접두사         | 클라이언트 번들 포함 여부 |
| -------------- | ------------------------- |
| `NEXT_PUBLIC_` | 포함됨                    |
| 접두사 없음    | 빈 문자열로 대체          |

---

## 8. Third-Party Components

### 클라이언트 전용 기능을 사용하는 서드파티 컴포넌트 처리

서드파티 컴포넌트가 클라이언트 전용 기능을 사용하지만 `'use client'` 지시어가 없으면, Server Components에서 실패합니다.

**문제:**

```tsx
// app/page.tsx - Server Component
import { Carousel } from 'acme-carousel';

export default function Page() {
  return <Carousel />; // 에러: Carousel이 useState 사용하지만 'use client' 없음
}
```

**해결책: Client Component로 래핑**

```tsx
// app/carousel.tsx
'use client';

import { Carousel } from 'acme-carousel';

export default Carousel;
```

```tsx
// app/page.tsx - Server Component
import Carousel from './carousel';

export default function Page() {
  return <Carousel />; // 이제 동작!
}
```

### 라이브러리 작성자를 위한 조언

클라이언트 전용 기능에 의존하는 진입점에 `'use client'` 지시어를 추가하세요. 이렇게 하면 사용자가 래퍼를 만들지 않고도 Server Components에서 직접 컴포넌트를 import할 수 있습니다.

---

## 9. Context Providers Pattern

React Context는 Server Components에서 지원되지 않으므로, Client Component 프로바이더를 생성해야 합니다.

### Context Provider 생성

```tsx
// app/theme-provider.tsx
'use client';

import { createContext } from 'react';

export const ThemeContext = createContext({});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
```

### Server Component에서 Provider 사용

```tsx
// app/layout.tsx - Server Component
import ThemeProvider from './theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**모범 사례**: 프로바이더를 트리에서 가능한 깊게 렌더링하세요. 위 예시에서 `ThemeProvider`는 전체 `<html>` 문서가 아닌 `{children}`만 래핑합니다. 이를 통해 Next.js가 Server Components의 정적 부분을 최적화할 수 있습니다.

---

## Best Practices

| 모범 사례                  | 설명                                                                             |
| -------------------------- | -------------------------------------------------------------------------------- |
| 세분화된 Client Components | 인터랙티비티나 브라우저 API가 필요할 때만 `'use client'` 표시                    |
| 중첩보다 구성              | Client Components 주변에 Server Components를 중첩하는 대신 children/props로 전달 |
| 직렬화 가능한 Props        | Server → Client로 전달되는 Props는 React에서 직렬화 가능해야 함                  |
| Provider 배치              | Context providers를 컴포넌트 트리에서 가능한 깊게 배치                           |
| 서드파티 관리              | 클라이언트 전용 기능을 사용하는 서드파티 패키지를 Client Component로 래핑        |
| 보안                       | `server-only` 패키지로 서버 코드가 클라이언트에 노출되는 것 방지                 |
| 번들 최적화                | 필요한 곳에만 Client Components 사용하여 브라우저로 보내는 JS 감소               |
