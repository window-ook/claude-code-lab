# Next.js Proxy

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/proxy

## Contents

- [1. Proxy 개요](#1-proxy-개요)
- [2. 사용 사례](#2-사용-사례)
- [3. 파일 규칙](#3-파일-규칙)
- [4. 기본 사용법](#4-기본-사용법)
- [5. Matcher 설정](#5-matcher-설정)
- [6. NextResponse API](#6-nextresponse-api)
- [7. 헤더 수정](#7-헤더-수정)
- [8. 리다이렉트와 리라이트](#8-리다이렉트와-리라이트)
- [9. 인증 프록시](#9-인증-프록시)
- [10. A/B 테스팅](#10-ab-테스팅)
- [11. Best Practices](#11-best-practices)

---

## 1. Proxy 개요

**Proxy**는 Next.js 16에서 도입된 기능으로, 요청이 완료되기 전에 코드를 실행할 수 있게 해줍니다. 기존 Middleware의 역할을 대체하며, 다음과 같은 응답 수정이 가능합니다:

| 기능            | 설명                               |
| --------------- | ---------------------------------- |
| Rewriting       | 요청 URL을 다른 경로로 재작성      |
| Redirecting     | 클라이언트를 다른 URL로 리다이렉트 |
| Headers 수정    | 요청/응답 헤더 추가, 수정, 삭제    |
| Direct Response | 직접 응답 반환                     |

```tsx
// proxy.ts - 기본 구조
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 요청 처리 로직
  return NextResponse.next();
}
```

---

## 2. 사용 사례

### 적합한 사용 사례

| 사용 사례               | 설명                                   |
| ----------------------- | -------------------------------------- |
| 헤더 수정               | 모든 페이지 또는 특정 경로에 헤더 추가 |
| A/B 테스팅              | 실험에 따라 다른 페이지로 라우팅       |
| 프로그래매틱 리다이렉트 | 요청 속성 기반 동적 리다이렉트         |
| 낙관적 권한 검사        | 인증 전 사전 검증                      |

### 사용하지 말아야 할 경우

```tsx
// BAD: 단순 리다이렉트는 next.config.ts 사용
// next.config.ts
export default {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
};

// BAD: Proxy에서 느린 데이터 페칭
export function proxy(request: NextRequest) {
  // 데이터 페칭은 Proxy에 적합하지 않음
  const data = await fetch('https://slow-api.com/data'); // 피해야 함
}

// BAD: Proxy에서 캐시 옵션 사용 - 효과 없음
fetch(url, {
  cache: 'force-cache', // 효과 없음
  next: { revalidate: 60 }, // 효과 없음
});
```

---

## 3. 파일 규칙

### 파일 위치

`proxy.ts` (또는 `.js`) 파일은 프로젝트 루트 또는 `src` 폴더에 위치해야 합니다:

```
# 프로젝트 루트에 배치
project-root/
├── proxy.ts          ✅ 여기
├── app/
│   └── page.tsx
└── ...

# 또는 src 폴더 내에 배치
project-root/
├── src/
│   ├── proxy.ts      ✅ 여기
│   └── app/
│       └── page.tsx
└── ...
```

### 중요 규칙

- **프로젝트당 하나의 `proxy.ts`만** 지원됩니다
- 로직이 복잡하면 별도 모듈로 분리하여 import

```tsx
// lib/proxy/auth.ts
export function handleAuth(request: NextRequest) {
  // 인증 로직
}

// lib/proxy/headers.ts
export function setSecurityHeaders(response: NextResponse) {
  // 헤더 설정 로직
}

// proxy.ts - 메인 파일
import { handleAuth } from './lib/proxy/auth';
import { setSecurityHeaders } from './lib/proxy/headers';

export function proxy(request: NextRequest) {
  const authResult = handleAuth(request);
  if (authResult) return authResult;

  const response = NextResponse.next();
  setSecurityHeaders(response);
  return response;
}
```

---

## 4. 기본 사용법

### Named Export

```tsx
// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 홈으로 리다이렉트
  return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
  matcher: '/about/:path*',
};
```

### Default Export

```tsx
// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
  matcher: '/about/:path*',
};
```

### JavaScript 버전

```jsx
// proxy.js
import { NextResponse } from 'next/server';

export function proxy(request) {
  return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
  matcher: '/about/:path*',
};
```

---

## 5. Matcher 설정

### 기본 Matcher

```tsx
export const config = {
  // 단일 경로 매칭
  matcher: '/about/:path*',
};
```

### 복수 경로 매칭

```tsx
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
};
```

### 정규식 매칭

```tsx
export const config = {
  matcher: [
    // 정적 파일 제외
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 조건부 매칭

```tsx
export const config = {
  matcher: [
    // /api, /_next/static, /_next/image, favicon.ico 제외한 모든 경로
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
```

### Matcher 패턴 요약

| 패턴        | 설명              | 예시                                     |
| ----------- | ----------------- | ---------------------------------------- |
| `:path`     | 단일 세그먼트     | `/about/:path` → `/about/team`           |
| `:path*`    | 0개 이상 세그먼트 | `/about/:path*` → `/about`, `/about/a/b` |
| `:path+`    | 1개 이상 세그먼트 | `/about/:path+` → `/about/team`          |
| `(pattern)` | 정규식 그룹       | `/((?!api).*)`                           |

---

## 6. NextResponse API

### 주요 메서드

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. 다음 핸들러로 진행
  return NextResponse.next();

  // 2. 리다이렉트
  return NextResponse.redirect(new URL('/login', request.url));

  // 3. 리라이트 (URL 변경 없이 내부적으로 다른 경로 처리)
  return NextResponse.rewrite(new URL('/proxy-page', request.url));

  // 4. JSON 응답 직접 반환
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### NextResponse vs Response

| 메서드       | NextResponse | Response |
| ------------ | ------------ | -------- |
| `redirect()` | ✅           | ❌       |
| `rewrite()`  | ✅           | ❌       |
| `next()`     | ✅           | ❌       |
| `json()`     | ✅           | ✅       |

---

## 7. 헤더 수정

### 요청 헤더 수정

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 요청 헤더 복제 및 수정
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-custom-header', 'custom-value');
  requestHeaders.set('x-request-id', crypto.randomUUID());

  // 수정된 헤더로 요청 진행
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

### 응답 헤더 수정

```tsx
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // 보안 헤더 추가
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  );

  return response;
}
```

### CORS 헤더 설정

```tsx
export function proxy(request: NextRequest) {
  // Preflight 요청 처리
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

---

## 8. 리다이렉트와 리라이트

### 리다이렉트 (Redirect)

클라이언트에게 새로운 URL로 이동하라고 알립니다. URL이 변경됩니다.

```tsx
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /old-blog/* → /blog/*로 영구 리다이렉트
  if (pathname.startsWith('/old-blog')) {
    const newPath = pathname.replace('/old-blog', '/blog');
    return NextResponse.redirect(new URL(newPath, request.url), {
      status: 301, // 308(영구), 307(임시) 사용 가능
    });
  }

  return NextResponse.next();
}
```

### 리라이트 (Rewrite)

URL은 그대로 유지하면서 내부적으로 다른 경로를 처리합니다.

```tsx
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /api/* 요청을 외부 API로 프록시
  if (pathname.startsWith('/api/external')) {
    return NextResponse.rewrite(
      new URL(pathname.replace('/api/external', ''), 'https://api.example.com')
    );
  }

  return NextResponse.next();
}
```

### Redirect vs Rewrite 비교

| 특성          | Redirect                | Rewrite                 |
| ------------- | ----------------------- | ----------------------- |
| URL 변경      | ✅ 변경됨               | ❌ 유지됨               |
| 브라우저 인지 | ✅ 인지함               | ❌ 모름                 |
| SEO 영향      | 있음 (301/302)          | 없음                    |
| 사용 사례     | 페이지 이동, 레거시 URL | API 프록시, 내부 라우팅 |

---

## 9. 인증 프록시

### 낙관적 권한 검사

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // 보호된 경로 정의
  const protectedPaths = ['/dashboard', '/profile', '/settings'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 토큰 없이 보호된 경로 접근 시 로그인으로 리다이렉트
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인된 사용자가 로그인 페이지 접근 시 대시보드로 리다이렉트
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
  ],
};
```

### 역할 기반 접근 제어

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));

    try {
      const { payload } = await jwtVerify(token, secret);

      // 관리자 역할 확인
      if (payload.role !== 'admin')
        return NextResponse.redirect(new URL('/unauthorized', request.url));

      // 요청 헤더에 사용자 정보 추가
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
```

---

## 10. A/B 테스팅

### 쿠키 기반 A/B 테스트

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 홈페이지 A/B 테스트
  if (pathname === '/') {
    // 기존 버킷 확인
    const bucket = request.cookies.get('ab-bucket')?.value;

    if (bucket) {
      // 기존 버킷에 따라 페이지 결정
      return NextResponse.rewrite(
        new URL(bucket === 'a' ? '/home-a' : '/home-b', request.url)
      );
    }

    // 새 방문자: 랜덤 버킷 할당
    const newBucket = Math.random() < 0.5 ? 'a' : 'b';
    const response = NextResponse.rewrite(
      new URL(newBucket === 'a' ? '/home-a' : '/home-b', request.url)
    );

    // 쿠키 설정 (30일 유지)
    response.cookies.set('ab-bucket', newBucket, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    return response;
  }

  return NextResponse.next();
}
```

### 다중 실험 관리

```tsx
interface Experiment {
  name: string;
  variants: string[];
  weight?: number[];
}

const experiments: Experiment[] = [
  { name: 'homepage', variants: ['control', 'variant-a', 'variant-b'] },
  { name: 'pricing', variants: ['monthly', 'annual'], weight: [0.3, 0.7] },
];

function getVariant(experiment: Experiment, existingVariant?: string): string {
  if (existingVariant && experiment.variants.includes(existingVariant))
    return existingVariant;

  const random = Math.random();
  const weights =
    experiment.weight ||
    experiment.variants.map(() => 1 / experiment.variants.length);

  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) return experiment.variants[i];
  }

  return experiment.variants[0];
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  for (const experiment of experiments) {
    const cookieName = `exp-${experiment.name}`;
    const existingVariant = request.cookies.get(cookieName)?.value;
    const variant = getVariant(experiment, existingVariant);

    if (!existingVariant) {
      response.cookies.set(cookieName, variant, {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
      });
    }

    // 헤더에 실험 정보 추가
    response.headers.append('x-experiment', `${experiment.name}=${variant}`);
  }

  return response;
}
```

---

## 11. Best Practices

### 권장 사항

| 항목                          | 설명                                       |
| ----------------------------- | ------------------------------------------ |
| 로직 모듈화                   | 복잡한 로직은 별도 파일로 분리하여 import  |
| 단순 리다이렉트는 config 사용 | `next.config.ts`의 `redirects()` 활용      |
| 낙관적 검사만 수행            | 전체 인증/인가는 서버 컴포넌트에서 처리    |
| 빠른 실행 유지                | 무거운 연산이나 느린 API 호출 피하기       |
| 정적 자산 제외                | Matcher에서 `_next/static`, 이미지 등 제외 |

### 피해야 할 패턴

```tsx
// BAD: Proxy에서 무거운 데이터베이스 쿼리
export async function proxy(request: NextRequest) {
  const user = await db.user.findUnique({ where: { id } }); // 피해야 함
}

// BAD: Proxy에서 외부 API 호출 (느림)
export async function proxy(request: NextRequest) {
  const data = await fetch('https://slow-external-api.com'); // 피해야 함
}

// BAD: 모든 요청에 Proxy 실행
export const config = {
  matcher: '/:path*', // 너무 광범위함
};

// GOOD: 필요한 경로만 매칭
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 성능 최적화

```tsx
// 조기 반환으로 불필요한 처리 방지
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 자산은 바로 통과
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 나머지 로직 처리
  // ...
}
```

### 에러 처리

```tsx
export async function proxy(request: NextRequest) {
  try {
    // 프록시 로직
    const token = request.cookies.get('token')?.value;

    if (!token) throw new Error('No token');

    // 토큰 검증 등...
    return NextResponse.next();
  } catch (error) {
    console.error('Proxy error:', error);

    // 에러 시 안전한 기본 동작
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

---

## 관련 문서

- [Proxy API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Backend for Frontend Guide](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Authentication with Proxy](https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional)
