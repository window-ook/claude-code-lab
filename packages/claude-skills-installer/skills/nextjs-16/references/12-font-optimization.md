# Next.js Font Optimization

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/fonts

---

## Contents

- [1. next/font 모듈 개요](#1-nextfont-모듈-개요)
- [2. Google Fonts](#2-google-fonts)
- [3. Local Fonts](#3-local-fonts)
- [4. Variable Fonts](#4-variable-fonts)
- [5. Multiple Font Files](#5-multiple-font-files)
- [6. Font 적용 방법](#6-font-적용-방법)
- [Best Practices](#best-practices)

---

## 1. next/font 모듈 개요

Next.js의 `next/font` 모듈은 폰트를 자동으로 최적화하고 향상된 프라이버시와 성능을 위해 외부 네트워크 요청을 제거합니다. **내장 셀프 호스팅** 기능으로 레이아웃 시프트 없이 최적의 웹 폰트 로딩을 제공합니다.

### 주요 이점

| 이점                    | 설명                 |
| ----------------------- | -------------------- |
| 자동 폰트 최적화        | 최적화된 폰트 로딩   |
| 외부 네트워크 요청 제거 | 프라이버시 향상      |
| 셀프 호스팅 폰트 파일   | 배포 도메인에서 제공 |
| 레이아웃 시프트 제로    | CLS 방지             |

### 기본 사용법

`next/font/google` 또는 `next/font/local`에서 import하고, 옵션으로 설정한 후 `className`으로 적용:

```tsx
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 2. Google Fonts

### 개요

Google Fonts는 **자동으로 셀프 호스팅**되어 정적 에셋으로 배포 도메인에서 제공됩니다. Google 서버로의 요청이 발생하지 않습니다.

```tsx
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
});
```

### Non-Variable Fonts

Variable 폰트가 아닌 경우 weight를 지정합니다:

```tsx
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});
```

### 여러 Weight 사용

```tsx
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});
```

---

## 3. Local Fonts

### 개요

`next/font/local`에서 import하고 `src` 경로를 지정합니다. 폰트는 `public` 폴더 또는 `app` 폴더 내에 저장할 수 있습니다.

```tsx
import localFont from 'next/font/local';

const myFont = localFont({
  src: './my-font.woff2',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 폰트 저장 위치

| 위치          | 설명                 |
| ------------- | -------------------- |
| `public` 폴더 | 정적 에셋으로 제공   |
| `app` 폴더 내 | 컴포넌트와 함께 배치 |

---

## 4. Variable Fonts

### 권장 사용

최고의 성능과 유연성을 위해 variable 폰트 사용을 권장합니다. weight 지정이 필요 없습니다.

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  // weight 지정 불필요 - variable 폰트가 모든 weight 지원
});
```

### Variable vs Non-Variable

| 특성        | Variable Font         | Non-Variable Font    |
| ----------- | --------------------- | -------------------- |
| Weight 지정 | 불필요                | 필수                 |
| 파일 크기   | 단일 파일             | weight당 별도 파일   |
| 유연성      | 모든 weight 사용 가능 | 지정된 weight만 사용 |
| 권장 여부   | 권장                  | 대안                 |

---

## 5. Multiple Font Files

### 단일 폰트 패밀리에 여러 Weight/Style

여러 weight/style을 가진 단일 폰트 패밀리의 경우 `src`에 배열을 사용합니다:

```tsx
import localFont from 'next/font/local';

const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
});
```

---

## 6. Font 적용 방법

### className으로 적용

폰트는 컴포넌트에 스코프됩니다. 반환된 객체의 `className` 속성을 통해 접근합니다:

```tsx
<html lang="en" className={geist.className}>
  <body>{children}</body>
</html>
```

### CSS 변수로 적용

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* CSS에서 사용 */
body {
  font-family: var(--font-inter);
}
```

### Tailwind CSS와 함께 사용

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// tailwind.config.js에서 설정
// theme: {
//   extend: {
//     fontFamily: {
//       sans: ['var(--font-inter)'],
//     },
//   },
// }
```

---

## Best Practices

| 모범 사례            | 설명                            |
| -------------------- | ------------------------------- |
| Variable 폰트 사용   | 최적의 성능과 유연성            |
| Root Layout에 적용   | 애플리케이션 전체 폰트 사용 시  |
| 셀프 호스팅 활용     | 외부 네트워크 요청 방지         |
| 레이아웃 시프트 방지 | 자동 최적화를 통해 CLS 제거     |
| 폰트 파일 함께 배치  | `app` 또는 `public` 폴더에 저장 |
| subsets 지정         | 필요한 문자 세트만 로드         |

---

## Font 설정 옵션 요약

| 옵션       | 타입                 | 설명                                 |
| ---------- | -------------------- | ------------------------------------ |
| `subsets`  | `string[]`           | 문자 세트 (예: `['latin']`)          |
| `weight`   | `string \| string[]` | 폰트 weight (non-variable 폰트용)    |
| `style`    | `string \| string[]` | 폰트 스타일 (`'normal'`, `'italic'`) |
| `src`      | `string \| object[]` | 폰트 파일 경로 (local 폰트용)        |
| `variable` | `string`             | CSS 변수명 (예: `'--font-inter'`)    |
| `display`  | `string`             | 폰트 디스플레이 전략 (`'swap'` 등)   |
| `preload`  | `boolean`            | 폰트 프리로드 여부 (기본값: `true`)  |
| `fallback` | `string[]`           | 폴백 폰트 목록                       |

---

## 여러 폰트 사용 예시

```tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```
