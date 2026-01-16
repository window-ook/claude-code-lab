# Next.js Route Handlers

**Doc Version:** 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/route-handlers

---

## Contents

- [1. 기본 개념](#1-기본-개념)
- [2. 지원되는 HTTP 메서드](#2-지원되는-http-메서드)
- [3. 캐싱 동작](#3-캐싱-동작)
- [4. NextRequest와 NextResponse](#4-nextrequest와-nextresponse)
- [5. 동적 라우트 파라미터](#5-동적-라우트-파라미터)
- [6. 쿠키와 헤더](#6-쿠키와-헤더)
- [7. 리다이렉트](#7-리다이렉트)
- [8. 스트리밍](#8-스트리밍)
- [9. CORS 설정](#9-cors-설정)
- [10. Request Body 처리](#10-request-body-처리)
- [11. Route Resolution 규칙](#11-route-resolution-규칙)
- [12. Best Practices](#12-best-practices)

---

## 1. 기본 개념

Route Handlers는 `app` 디렉토리 내에서 `route.ts` (또는 `route.js`) 파일로 정의합니다.

### 파일 규칙

| 규칙   | 설명                                             |
| ------ | ------------------------------------------------ |
| 파일명 | `route.ts` 또는 `route.js`                       |
| 위치   | `app` 디렉토리 내 어디서든 가능                  |
| 제약   | `page.tsx`와 동일 폴더에 존재 불가               |
| 특징   | 레이아웃과 클라이언트 네비게이션에 참여하지 않음 |

### 기본 예제

```typescript
// app/api/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello, World!' });
}
```

### 중첩 경로 예제

```typescript
// app/api/users/route.ts -> /api/users
// app/api/users/[id]/route.ts -> /api/users/:id
// app/dashboard/stats/route.ts -> /dashboard/stats
```

---

## 2. 지원되는 HTTP 메서드

Route Handlers는 다음 HTTP 메서드를 지원합니다.

| 메서드    | 용도                | 캐싱 가능  |
| --------- | ------------------- | ---------- |
| `GET`     | 리소스 조회         | O (조건부) |
| `POST`    | 리소스 생성         | X          |
| `PUT`     | 리소스 전체 수정    | X          |
| `PATCH`   | 리소스 부분 수정    | X          |
| `DELETE`  | 리소스 삭제         | X          |
| `HEAD`    | 헤더만 조회         | O (조건부) |
| `OPTIONS` | CORS preflight 요청 | X          |

### 여러 메서드 정의

```typescript
// app/api/items/route.ts
export async function GET() {
  const items = await getItems();
  return Response.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newItem = await createItem(body);
  return Response.json(newItem, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await deleteItem(id);
  return new Response(null, { status: 204 });
}
```

### 지원하지 않는 메서드 호출 시

```typescript
// 지원하지 않는 메서드 호출 시 자동으로 405 Method Not Allowed 응답
// 별도 처리 불필요
```

---

## 3. 캐싱 동작

### 기본 동작

- **기본값**: 캐싱되지 않음 (동적)
- **GET 메서드만** 캐싱 가능
- **다른 HTTP 메서드**: 캐싱 불가

### 캐싱 비활성화 조건 (동적 전환)

다음 요소 사용 시 Route Handler가 동적으로 전환됩니다:

- `headers()`, `cookies()`, `connection()` 호출
- 동적 라우트 파라미터 사용
- `Request` 객체 읽기
- 네트워크 요청, DB 쿼리 등 비결정적 작업

### 정적 캐싱 강제 활성화

```typescript
// app/api/items/route.ts
export const dynamic = 'force-static';

export async function GET() {
  const res = await fetch('https://api.example.com/data', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
  });
  const data = await res.json();
  return Response.json({ data });
}
```

### use cache와 cacheLife 활용

```typescript
// app/api/products/route.ts
import { cacheLife } from 'next/cache';

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

// 캐시 가능한 함수로 분리
async function getProducts() {
  'use cache';
  cacheLife('hours'); // 1시간 캐시
  return await db.query('SELECT * FROM products');
}
```

> **주의**: `'use cache'`는 Route Handler 본문에서 직접 사용할 수 없습니다. 반드시 별도 함수로 분리해야 합니다.

### 캐싱 예제 비교

```typescript
// 정적 (빌드 시 프리렌더링)
export async function GET() {
  return Response.json({ projectName: 'Next.js' });
}

// 동적 (매 요청마다 실행)
export async function GET() {
  return Response.json({ randomNumber: Math.random() });
}

// 런타임 데이터 사용 (동적)
import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  return Response.json({ userAgent });
}
```

---

## 4. NextRequest와 NextResponse

Next.js는 기본 Web API를 확장한 `NextRequest`와 `NextResponse`를 제공합니다.

### NextRequest 확장 기능

```typescript
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // URL 파싱 편의 기능
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  // 지역 정보 (Vercel 배포 시)
  const country = request.geo?.country;
  const city = request.geo?.city;

  // IP 주소
  const ip = request.ip;

  // 쿠키 접근
  const token = request.cookies.get('token')?.value;

  return Response.json({ query, country, city, ip, token });
}
```

### NextResponse 확장 기능

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ success: true });

  // 쿠키 설정
  response.cookies.set('session', 'abc123', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1일
  });

  // 헤더 설정
  response.headers.set('X-Custom-Header', 'custom-value');

  return response;
}
```

---

## 5. 동적 라우트 파라미터

### RouteContext 타입 헬퍼 (Next.js 16)

```typescript
// app/users/[id]/route.ts
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: RouteContext<'/users/[id]'>
) {
  // Next.js 16: params는 Promise
  const { id } = await context.params;

  const user = await getUser(id);
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json(user);
}
```

### 다중 파라미터

```typescript
// app/posts/[category]/[slug]/route.ts
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: RouteContext<'/posts/[category]/[slug]'>
) {
  const { category, slug } = await context.params;

  const post = await getPost(category, slug);
  return Response.json(post);
}
```

### Catch-all 라우트

```typescript
// app/docs/[...slug]/route.ts
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: RouteContext<'/docs/[...slug]'>
) {
  const { slug } = await context.params;
  // slug는 string[] 타입
  // /docs/a/b/c -> slug = ['a', 'b', 'c']

  return Response.json({ path: slug.join('/') });
}
```

---

## 6. 쿠키와 헤더

### 쿠키 읽기

```typescript
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  return Response.json({ token: token?.value });
}
```

### 쿠키 설정

```typescript
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();

  // 쿠키 설정
  cookieStore.set('session', 'value', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1주일
  });

  return Response.json({ success: true });
}
```

### 헤더 읽기

```typescript
import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();

  const userAgent = headersList.get('user-agent');
  const authorization = headersList.get('authorization');
  const contentType = headersList.get('content-type');

  return Response.json({ userAgent, authorization, contentType });
}
```

### 헤더 설정

```typescript
export async function GET() {
  return new Response('Hello', {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, max-age=0',
      'X-Custom-Header': 'custom-value',
    },
  });
}
```

---

## 7. 리다이렉트

### redirect 함수 사용

```typescript
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) redirect('/login');

  const isValid = await validateToken(token);
  if (!isValid) redirect('/login?error=invalid_token');

  redirect('/dashboard');
}
```

### Response로 리다이렉트

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // 308 Permanent Redirect
  return NextResponse.redirect(new URL('/new-path', request.url), {
    status: 308,
  });
}

export async function POST() {
  // 303 See Other (POST 후 GET으로 리다이렉트)
  return NextResponse.redirect(new URL('/success', request.url), {
    status: 303,
  });
}
```

### 리다이렉트 상태 코드

| 코드 | 이름               | 용도                   |
| ---- | ------------------ | ---------------------- |
| 301  | Moved Permanently  | 영구 이동 (캐시됨)     |
| 302  | Found              | 임시 이동 (기본값)     |
| 303  | See Other          | POST 후 GET 리다이렉트 |
| 307  | Temporary Redirect | 메서드 유지 임시 이동  |
| 308  | Permanent Redirect | 메서드 유지 영구 이동  |

---

## 8. 스트리밍

### ReadableStream 사용

```typescript
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        const chunk = encoder.encode(`data: ${i}\n\n`);
        controller.enqueue(chunk);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

### Server-Sent Events (SSE)

```typescript
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // 초기 데이터 전송
      sendEvent({ type: 'connected', timestamp: Date.now() });

      // 주기적 업데이트
      const interval = setInterval(() => {
        sendEvent({ type: 'update', value: Math.random() });
      }, 1000);

      // 10초 후 종료
      setTimeout(() => {
        clearInterval(interval);
        sendEvent({ type: 'complete' });
        controller.close();
      }, 10000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
```

---

## 9. CORS 설정

### 단일 Route Handler에서 CORS

```typescript
export async function GET() {
  return Response.json(
    { data: 'Hello' },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24시간 캐시
    },
  });
}
```

### CORS 헬퍼 함수

```typescript
// lib/cors.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function cors(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export function corsOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Access-Control-Max-Age': '86400',
    },
  });
}
```

```typescript
// app/api/data/route.ts
import { cors, corsOptions } from '@/lib/cors';

export async function GET() {
  return cors(Response.json({ data: 'Hello' }));
}

export const OPTIONS = corsOptions;
```

### Middleware로 전역 CORS

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

export const config = {
  matcher: '/api/:path*',
};
```

---

## 10. Request Body 처리

### JSON Body

```typescript
export async function POST(request: Request) {
  const body = await request.json();

  // 유효성 검사
  if (!body.name || !body.email) {
    return Response.json(
      { error: 'name과 email은 필수입니다.' },
      { status: 400 }
    );
  }

  const user = await createUser(body);
  return Response.json(user, { status: 201 });
}
```

### FormData

```typescript
export async function POST(request: Request) {
  const formData = await request.formData();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const file = formData.get('file') as File | null;

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // 파일 저장 로직...
  }

  return Response.json({ name, email, fileSize: file?.size });
}
```

### URL-encoded Body

```typescript
export async function POST(request: Request) {
  const text = await request.text();
  const params = new URLSearchParams(text);

  const username = params.get('username');
  const password = params.get('password');

  return Response.json({ username });
}
```

### Raw Body (Binary)

```typescript
export async function POST(request: Request) {
  const arrayBuffer = await request.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 바이너리 데이터 처리...

  return Response.json({ size: buffer.length });
}
```

---

## 11. Route Resolution 규칙

### page.tsx와 route.ts 충돌

| 구조                                       | 결과                |
| ------------------------------------------ | ------------------- |
| `app/page.tsx` + `app/route.ts`            | ❌ 충돌 (동일 경로) |
| `app/page.tsx` + `app/api/route.ts`        | ✅ 유효 (다른 경로) |
| `app/[user]/page.tsx` + `app/api/route.ts` | ✅ 유효             |

### 올바른 구조 예제

```
app/
├── page.tsx              # / 페이지
├── api/
│   └── route.ts          # /api API 엔드포인트
├── users/
│   ├── page.tsx          # /users 페이지
│   └── api/
│       └── route.ts      # /users/api API 엔드포인트
└── dashboard/
    ├── page.tsx          # /dashboard 페이지
    └── stats/
        └── route.ts      # /dashboard/stats API 엔드포인트
```

### 특수 Route Handlers

메타데이터 파일도 Route Handler처럼 동작합니다:

| 파일                  | 경로               | 기본 동작 |
| --------------------- | ------------------ | --------- |
| `sitemap.ts`          | `/sitemap.xml`     | 정적      |
| `robots.ts`           | `/robots.txt`      | 정적      |
| `opengraph-image.tsx` | `/opengraph-image` | 정적      |
| `icon.tsx`            | `/icon`            | 정적      |

---

## 12. Best Practices

### 에러 처리 패턴

```typescript
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof NotFoundError) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### 인증 미들웨어 패턴

```typescript
import { headers } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function authenticate() {
  const headersList = await headers();
  const authorization = headersList.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice(7);
  return verifyToken(token);
}

export async function GET() {
  const user = await authenticate();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getUserData(user.id);
  return Response.json(data);
}
```

### 응답 헬퍼 함수

```typescript
// lib/api-response.ts
export function success<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function error(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

export function created<T>(data: T) {
  return success(data, 201);
}

export function noContent() {
  return new Response(null, { status: 204 });
}

export function notFound(message = 'Resource not found') {
  return error(message, 404);
}

export function unauthorized(message = 'Unauthorized') {
  return error(message, 401);
}
```

```typescript
// app/api/users/route.ts
import { success, created, error } from '@/lib/api-response';

export async function GET() {
  const users = await getUsers();
  return success(users);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.email) return error('이메일은 필수입니다.');

  const user = await createUser(body);
  return created(user);
}
```

### 요약 테이블

| 항목        | 권장 사항                                       |
| ----------- | ----------------------------------------------- |
| 파일 위치   | `page.tsx`와 같은 폴더에 배치하지 않음          |
| HTTP 메서드 | 필요한 메서드만 export                          |
| 캐싱        | GET 요청에만 캐싱 적용 가능                     |
| 'use cache' | Route Handler 본문이 아닌 별도 함수에서 사용    |
| 에러 처리   | 적절한 HTTP 상태 코드 반환                      |
| 타입 안전성 | `RouteContext<T>` 타입 헬퍼 활용                |
| CORS        | 필요시 OPTIONS 메서드 구현 또는 Middleware 사용 |
| 인증        | 재사용 가능한 인증 함수 분리                    |
