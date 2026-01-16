# Next.js Image Optimization

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/images

---

## Contents

- [1. next/image Component 개요](#1-nextimage-component-개요)
- [2. 주요 기능과 이점](#2-주요-기능과-이점)
- [3. Local Images](#3-local-images)
- [4. Remote Images](#4-remote-images)
- [5. Remote Image 보안 설정](#5-remote-image-보안-설정)
- [6. Placeholder와 Blur 효과](#6-placeholder와-blur-효과)
- [7. Image Sizing 방식](#7-image-sizing-방식)
- [Best Practices](#best-practices)

---

## 1. next/image Component 개요

Next.js `<Image>` 컴포넌트는 표준 HTML `<img>` 요소를 내장 최적화 기능으로 확장합니다.

### 기본 사용법

```tsx
import Image from 'next/image';

export default function Page() {
  return <Image src="" alt="" />;
}
```

---

## 2. 주요 기능과 이점

| 기능              | 설명                                                       |
| ----------------- | ---------------------------------------------------------- |
| Size Optimization | 각 디바이스에 맞는 크기의 이미지를 WebP 형식으로 자동 제공 |
| Visual Stability  | 이미지 로딩 중 레이아웃 시프트 자동 방지                   |
| Faster Page Loads | 네이티브 브라우저 지연 로딩; 뷰포트 진입 시에만 로드       |
| Asset Flexibility | 원격 서버 이미지 포함 온디맨드 이미지 리사이징             |

---

## 3. Local Images

### 기본 구현

정적 이미지를 루트 디렉토리의 `/public` 폴더에 저장합니다. 기본 URL(`/`)에서 참조합니다.

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
}
```

### Static Import (자동 치수)

```tsx
import Image from 'next/image';
import ProfileImage from './profile.png';

export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="Picture of the author"
      // width와 height가 자동으로 제공됨
      // blurDataURL이 자동으로 제공됨
      // placeholder="blur" // 선택적 blur-up 효과
    />
  );
}
```

### Static Import 시 자동 제공 항목

| 항목          | 설명                               |
| ------------- | ---------------------------------- |
| `width`       | 고유 너비 자동 결정                |
| `height`      | 고유 높이 자동 결정                |
| `blurDataURL` | placeholder 효과용 blur 데이터 URL |
| CLS 방지      | Cumulative Layout Shift 방지       |

---

## 4. Remote Images

`src` 속성에 전체 URL 문자열을 제공합니다:

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
}
```

### Remote Images 요구사항

| 요구사항                | 설명                                  |
| ----------------------- | ------------------------------------- |
| `width`와 `height` 필수 | 수동으로 props 제공 필요              |
| `blurDataURL` 선택적    | placeholder 효과용 (선택 사항)        |
| `fill` 속성 대안        | 부모 요소 크기에 반응하는 이미지 생성 |

---

## 5. Remote Image 보안 설정

`next.config.ts`에서 허용된 URL 패턴을 정의합니다:

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
};

export default config;
```

### remotePatterns 옵션

| 옵션       | 설명                                 |
| ---------- | ------------------------------------ |
| `protocol` | 허용할 프로토콜 (`https`, `http`)    |
| `hostname` | 허용할 호스트명                      |
| `port`     | 허용할 포트 (빈 문자열은 기본 포트)  |
| `pathname` | 허용할 경로 패턴 (`/**`는 모든 경로) |
| `search`   | 허용할 쿼리 문자열                   |

**모범 사례**: 악의적 사용을 방지하기 위해 패턴을 가능한 구체적으로 지정하세요.

---

## 6. Placeholder와 Blur 효과

### 개요

| 속성                 | 설명                                                        |
| -------------------- | ----------------------------------------------------------- |
| `placeholder="blur"` | 이미지 로드 중 blur-up 효과 활성화                          |
| `blurDataURL`        | 커스텀 blur placeholder 데이터 (static import 시 자동 생성) |

인지된 성능과 사용자 경험을 향상시킵니다.

### 사용 예시

```tsx
import Image from 'next/image';
import ProfileImage from './profile.png';

export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="Picture of the author"
      placeholder="blur"
      // blurDataURL은 static import 시 자동 제공
    />
  );
}
```

### Remote Image에서 Blur 사용

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="https://example.com/image.png"
      alt="Remote image"
      width={500}
      height={500}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    />
  );
}
```

---

## 7. Image Sizing 방식

### 방식 비교

| 방식                          | 사용 시점                            |
| ----------------------------- | ------------------------------------ |
| 정적 치수 (`width`, `height`) | 알려진 이미지 치수                   |
| Static import                 | 자동 치수 감지가 가능한 로컬 이미지  |
| `fill` 속성                   | 부모 컨테이너를 채우는 반응형 이미지 |

### fill 속성 사용

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Image
        src="/hero.png"
        alt="Hero image"
        fill
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
```

### fill 속성 요구사항

- 부모 요소에 `position: relative`, `fixed`, 또는 `absolute` 필요
- `objectFit`으로 이미지 맞춤 방식 지정 (`cover`, `contain` 등)

---

## Best Practices

| 모범 사례                   | 설명                                       |
| --------------------------- | ------------------------------------------ |
| 항상 `alt` 텍스트 포함      | 접근성을 위해 필수                         |
| `width`와 `height` 제공     | 로컬 및 원격 이미지에 레이아웃 시프트 방지 |
| 가능하면 static import 사용 | 자동 최적화 활용                           |
| `remotePatterns` 설정       | 보안을 위해 허용된 원격 이미지 소스 제한   |
| blur placeholder 활용       | 더 나은 인지된 성능                        |
| Next.js의 형식 변환 활용    | WebP 등 현대적 형식으로 자동 변환          |

---

## Image Component Props 요약

| Prop          | 필수 여부 | 설명                                  |
| ------------- | --------- | ------------------------------------- |
| `src`         | 필수      | 이미지 소스 (경로, URL, 또는 import)  |
| `alt`         | 필수      | 대체 텍스트 (접근성)                  |
| `width`       | 조건부    | 픽셀 단위 너비 (fill 사용 시 불필요)  |
| `height`      | 조건부    | 픽셀 단위 높이 (fill 사용 시 불필요)  |
| `fill`        | 선택      | 부모 컨테이너 채우기 모드             |
| `placeholder` | 선택      | 로딩 중 placeholder (`blur`, `empty`) |
| `blurDataURL` | 선택      | blur placeholder 데이터 URL           |
| `priority`    | 선택      | LCP 이미지에 대해 우선 로딩           |
| `loading`     | 선택      | 로딩 동작 (`lazy`, `eager`)           |
| `quality`     | 선택      | 이미지 품질 (1-100, 기본값 75)        |
| `sizes`       | 선택      | 반응형 이미지를 위한 미디어 쿼리      |
