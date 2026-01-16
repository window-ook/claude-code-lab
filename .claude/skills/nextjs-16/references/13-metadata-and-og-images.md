# Next.js Metadata and OG Images

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/metadata-and-og-images

---

## Contents

- [1. Metadata 정의 방식 개요](#1-metadata-정의-방식-개요)
- [2. Static Metadata](#2-static-metadata)
- [3. Dynamic Metadata (generateMetadata)](#3-dynamic-metadata-generatemetadata)
- [4. Metadata Streaming](#4-metadata-streaming)
- [5. 데이터 요청 메모이제이션](#5-데이터-요청-메모이제이션)
- [6. File-Based Metadata](#6-file-based-metadata)
- [7. Favicons](#7-favicons)
- [8. Static Open Graph Images](#8-static-open-graph-images)
- [9. Generated Open Graph Images](#9-generated-open-graph-images)
- [Best Practices](#best-practices)

---

## 1. Metadata 정의 방식 개요

Next.js는 SEO와 웹 공유성 향상을 위해 세 가지 메타데이터 정의 방식을 제공합니다.

### 세 가지 접근 방식

| 방식                    | 설명                                 | 사용 시점                     |
| ----------------------- | ------------------------------------ | ----------------------------- |
| Static `metadata` 객체  | layout.js 또는 page.js에서 정적 정의 | 고정된 메타데이터             |
| `generateMetadata` 함수 | 데이터에 의존하는 동적 메타데이터    | API/DB 데이터 기반 메타데이터 |
| File conventions        | favicon, OG 이미지용 특수 파일       | 이미지 기반 메타데이터        |

**중요**: Metadata export는 **Server Components에서만** 지원됩니다.

### 기본 제공 필드

Next.js는 자동으로 두 가지 기본 메타 태그를 추가합니다:

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## 2. Static Metadata

### 기본 사용법

`layout.js` 또는 `page.js`에서 `Metadata` 객체를 export합니다:

```tsx
// app/blog/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A blog about web development',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

### 확장된 Metadata 객체

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Website',
  description: 'Website description',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'Author Name' }],
  creator: 'Creator Name',
  publisher: 'Publisher Name',
  openGraph: {
    title: 'My Website',
    description: 'Website description',
    url: 'https://mywebsite.com',
    siteName: 'My Website',
    images: [
      {
        url: 'https://mywebsite.com/og.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Website',
    description: 'Website description',
    images: ['https://mywebsite.com/twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

---

## 3. Dynamic Metadata (generateMetadata)

### 목적

라우트 파라미터나 외부 데이터에 기반하여 동적으로 메타데이터를 생성합니다.

### 기본 구현

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  // 포스트 정보 가져오기
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  );

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  return <div>Blog Post: {slug}</div>;
}
```

### generateMetadata Props

| Prop           | 타입                                     | 설명                     |
| -------------- | ---------------------------------------- | ------------------------ |
| `params`       | `Promise<{ [key]: string }>`             | 동적 라우트 파라미터     |
| `searchParams` | `Promise<{ [key]: string \| string[] }>` | URL 쿼리 파라미터        |
| `parent`       | `ResolvingMetadata`                      | 부모 라우트의 메타데이터 |

### 부모 메타데이터 확장

```tsx
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  // 부모 메타데이터에서 openGraph 이미지 가져오기
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    openGraph: {
      images: [post.image, ...previousImages],
    },
  };
}
```

---

## 4. Metadata Streaming

### 개념

동적으로 렌더링되는 페이지에서 Next.js는 `generateMetadata`가 완료된 후 메타데이터를 별도로 스트리밍합니다. 이를 통해 UI가 메타데이터 로딩을 기다리지 않고 렌더링됩니다.

### 봇 처리

| 봇 유형     | 동작                                    |
| ----------- | --------------------------------------- |
| 일반 사용자 | 메타데이터 스트리밍                     |
| 봇/크롤러   | `<head>` 태그에 메타데이터 포함 후 전송 |

**비활성화 대상 봇**: TwitterBot, Slackbot, Bingbot 등 `<head>` 태그에 메타데이터를 기대하는 봇들.

### htmlLimitedBots 설정

```ts
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  htmlLimitedBots: /Googlebot|Bingbot|Slackbot|TwitterBot/i,
};

export default config;
```

---

## 5. 데이터 요청 메모이제이션

### 목적

`generateMetadata`와 페이지 컴포넌트에서 동일한 데이터를 중복 요청하는 것을 방지합니다.

### React cache 사용

```ts
// app/lib/data.ts
import { cache } from 'react';
import { db } from '@/app/lib/db';

// getPost는 두 번 호출되지만 한 번만 실행됨
export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });
  return res;
});
```

### 메모이제이션 적용

```tsx
// app/blog/[slug]/page.tsx
import { getPost } from '@/app/lib/data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug); // 첫 번째 호출
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug); // 두 번째 호출 (캐시에서 반환)
  return <div>{post.title}</div>;
}
```

---

## 6. File-Based Metadata

### 지원 파일 컨벤션

| 파일                  | 용도                    |
| --------------------- | ----------------------- |
| `favicon.ico`         | 웹사이트 파비콘         |
| `icon.jpg`            | 웹 아이콘               |
| `apple-icon.jpg`      | Apple 터치 아이콘       |
| `opengraph-image.jpg` | 소셜 공유용 OG 이미지   |
| `twitter-image.jpg`   | 트위터 카드 이미지      |
| `robots.txt`          | 검색 엔진 크롤러 지시   |
| `sitemap.xml`         | SEO를 위한 XML 사이트맵 |

### 파일 구조 예시

```
app/
├── favicon.ico
├── icon.png
├── apple-icon.png
├── opengraph-image.jpg
├── twitter-image.jpg
├── robots.txt
├── sitemap.xml
├── layout.tsx
└── page.tsx
```

---

## 7. Favicons

### 정적 파비콘

`app` 폴더 루트에 `favicon.ico` 파일을 생성합니다:

```
app/
├── favicon.ico
├── layout.tsx
└── page.tsx
```

### 동적 파비콘 생성

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
```

---

## 8. Static Open Graph Images

### 기본 설정

`app` 루트에 `opengraph-image.jpg` 파일 생성:

```
app/
├── opengraph-image.jpg
├── layout.tsx
└── page.tsx
```

### 라우트별 OG 이미지

더 깊은 폴더에 이미지를 배치하면 해당 라우트에 특화된 이미지로 적용됩니다. 더 구체적인 이미지가 우선:

```
app/
├── opengraph-image.jpg           (기본)
├── blog/
│   ├── opengraph-image.jpg       (blog 전용, 우선)
│   └── [slug]/
│       └── page.tsx
```

### 지원 형식

| 형식 | 확장자          |
| ---- | --------------- |
| JPEG | `.jpg`, `.jpeg` |
| PNG  | `.png`          |
| GIF  | `.gif`          |

---

## 9. Generated Open Graph Images

### ImageResponse 사용

`ImageResponse` 생성자를 사용하여 JSX와 CSS로 동적 OG 이미지를 생성합니다:

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getPost } from '@/app/lib/data';

// 이미지 메타데이터
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// 이미지 생성
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    { ...size }
  );
}
```

### ImageResponse 지원 기능

| 지원됨           | 미지원          |
| ---------------- | --------------- |
| Flexbox 레이아웃 | `display: grid` |
| 절대 위치 지정   | 고급 레이아웃   |
| 커스텀 폰트      | 복잡한 CSS      |
| 텍스트 래핑      | -               |
| 중앙 정렬        | -               |
| 중첩된 이미지    | -               |

### 커스텀 폰트 사용

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // 폰트 로드
  const interSemiBold = fetch(
    new URL('./Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hello World!
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
```

### ImageResponse 기술 스택

| 기술         | 역할                      |
| ------------ | ------------------------- |
| `@vercel/og` | OG 이미지 생성 라이브러리 |
| `satori`     | HTML/CSS를 SVG로 변환     |
| `resvg`      | SVG를 PNG로 변환          |

**플레이그라운드**: [Vercel OG Playground](https://og-playground.vercel.app/)

---

## Best Practices

| 모범 사례                        | 설명                                    |
| -------------------------------- | --------------------------------------- |
| Static metadata 우선 사용        | 고정 데이터는 정적 export로 성능 최적화 |
| generateMetadata로 동적 처리     | API/DB 기반 데이터는 동적 생성          |
| React cache로 메모이제이션       | 중복 데이터 요청 방지                   |
| 라우트별 OG 이미지 제공          | 각 페이지에 맞는 소셜 미리보기          |
| ImageResponse로 동적 이미지 생성 | 데이터 기반 OG 이미지                   |
| htmlLimitedBots 설정             | 봇별 메타데이터 전달 방식 제어          |
| 파일 기반 메타데이터 활용        | favicon, robots.txt, sitemap.xml 등     |
| Server Components에서만 export   | 메타데이터는 서버에서만 정의 가능       |

---

## Metadata 객체 주요 속성

| 속성           | 타입               | 설명                    |
| -------------- | ------------------ | ----------------------- |
| `title`        | `string \| object` | 페이지 제목             |
| `description`  | `string`           | 페이지 설명             |
| `keywords`     | `string[]`         | 키워드 목록             |
| `authors`      | `Author[]`         | 작성자 정보             |
| `creator`      | `string`           | 콘텐츠 생성자           |
| `publisher`    | `string`           | 발행자                  |
| `openGraph`    | `OpenGraph`        | Open Graph 메타데이터   |
| `twitter`      | `Twitter`          | Twitter 카드 메타데이터 |
| `robots`       | `Robots`           | 검색 엔진 지시          |
| `icons`        | `Icons`            | 파비콘 및 아이콘        |
| `manifest`     | `string`           | Web App Manifest 경로   |
| `alternates`   | `Alternates`       | 대체 URL (언어별 등)    |
| `verification` | `Verification`     | 사이트 소유권 확인      |

---

## OpenGraph 설정 옵션

| 옵션          | 타입        | 설명                               |
| ------------- | ----------- | ---------------------------------- |
| `title`       | `string`    | OG 제목                            |
| `description` | `string`    | OG 설명                            |
| `url`         | `string`    | 페이지 URL                         |
| `siteName`    | `string`    | 사이트 이름                        |
| `images`      | `OGImage[]` | OG 이미지 배열                     |
| `locale`      | `string`    | 로케일 (예: `ko_KR`)               |
| `type`        | `string`    | 콘텐츠 유형 (`website`, `article`) |

---

## Twitter 카드 설정 옵션

| 옵션          | 타입       | 설명                              |
| ------------- | ---------- | --------------------------------- |
| `card`        | `string`   | 카드 유형 (`summary_large_image`) |
| `title`       | `string`   | 카드 제목                         |
| `description` | `string`   | 카드 설명                         |
| `images`      | `string[]` | 카드 이미지 URL 배열              |
| `site`        | `string`   | 사이트 @username                  |
| `creator`     | `string`   | 콘텐츠 작성자 @username           |
