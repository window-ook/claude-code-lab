# Next.js CSS Styling

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/css

---

## Contents

- [1. Global CSS](#1-global-css)
- [2. CSS Modules](#2-css-modules)
- [3. Tailwind CSS](#3-tailwind-css)
- [4. CSS-in-JS](#4-css-in-js)
- [5. Sass](#5-sass)
- [6. External Stylesheets](#6-external-stylesheets)
- [7. CSS Ordering과 Merging](#7-css-ordering과-merging)
- [Best Practices](#best-practices)

---

## 1. Global CSS

### 목적

전체 애플리케이션의 모든 라우트에 스타일을 적용합니다.

### 설정

1. `app/global.css` 생성
2. 루트 레이아웃(`app/layout.tsx`)에서 import

```css
/* app/global.css */
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx
// app/layout.tsx
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 주의사항

Global 스타일은 라우트 간 네비게이션 시 스타일시트를 제거하지 않아 충돌을 일으킬 수 있습니다. 진정한 전역 CSS에만 사용하세요.

---

## 2. CSS Modules

### 목적

고유한 클래스 이름을 생성하여 CSS를 로컬로 스코프화하고, 이름 충돌을 방지합니다.

### 특징

| 특징        | 설명                          |
| ----------- | ----------------------------- |
| 파일 확장자 | `.module.css`                 |
| Import      | 모든 컴포넌트에서 import 가능 |
| 스코프      | 클래스가 해당 모듈에 스코프됨 |

### 사용 예시

```css
/* app/blog/blog.module.css */
.blog {
  padding: 24px;
}
```

```tsx
// app/blog/page.tsx
import styles from './blog.module.css';

export default function Page() {
  return <main className={styles.blog}></main>;
}
```

---

## 3. Tailwind CSS

### 개요

커스텀 디자인을 위한 저수준 유틸리티 클래스를 제공하는 utility-first CSS 프레임워크입니다.

### 설치

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

### PostCSS 설정

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### Global CSS 설정

```css
/* app/globals.css */
@import 'tailwindcss';
```

### 루트 레이아웃에서 Import

```tsx
// app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 사용 예시

```tsx
// app/page.tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  );
}
```

---

## 4. CSS-in-JS

### 개요

JavaScript 기반 CSS 라이브러리로 스타일링을 지원합니다.

### 지원 라이브러리

- styled-components
- Emotion
- StyleX
- 기타 CSS-in-JS 솔루션

자세한 내용은 [CSS-in-JS 문서](https://nextjs.org/docs/app/guides/css-in-js)를 참조하세요.

---

## 5. Sass

### 개요

Next.js 애플리케이션에서 Sass를 네이티브로 지원합니다.

### 파일 확장자

- `.scss` - SCSS 문법
- `.sass` - 들여쓰기 문법

자세한 내용은 [Sass 문서](https://nextjs.org/docs/app/guides/sass)를 참조하세요.

---

## 6. External Stylesheets

### 목적

`app` 디렉토리 어디서나 외부 패키지의 스타일시트를 import합니다.

### 사용 예시

```tsx
// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  );
}
```

### React 19 대안

```tsx
<link rel="stylesheet" href="..." />
```

---

## 7. CSS Ordering과 Merging

### 개념

CSS 순서는 코드에서의 import 순서에 따라 결정됩니다. Next.js는 프로덕션 빌드 시 스타일시트를 청크합니다.

### 예시

```tsx
// page.tsx
import { BaseButton } from './base-button'; // 먼저 import
import styles from './page.module.css'; // 나중에 import

export default function Page() {
  return <BaseButton className={styles.primary} />;
}
```

`base-button.module.css`가 최종 출력에서 `page.module.css`보다 먼저 정렬됩니다.

### 순서 보장

| 환경        | CSS 순서                |
| ----------- | ----------------------- |
| Development | 프로덕션과 다를 수 있음 |
| Production  | 최종 확정된 순서        |

---

## Best Practices

### CSS Import 구성

| 모범 사례                       | 설명                                   |
| ------------------------------- | -------------------------------------- |
| 단일 진입점에 CSS import 포함   | JavaScript/TypeScript 진입 파일에 집중 |
| 루트에서 global/Tailwind import | 애플리케이션 루트에서 import           |
| 일관된 네이밍 사용              | `<name>.module.css` 형식 사용          |
| 공유 스타일 추출                | 공유 컴포넌트로 추출                   |

### 스타일링 전략

| 전략         | 사용 시점                               |
| ------------ | --------------------------------------- |
| Tailwind CSS | 대부분의 스타일링에 기본 선택           |
| CSS Modules  | Tailwind로 부족할 때 컴포넌트별 스타일  |
| Global CSS   | 진정한 전역 스타일만 (Tailwind base 등) |

### 최적화

| 최적화 항목                    | 설명                           |
| ------------------------------ | ------------------------------ |
| auto-sort import 린터 비활성화 | ESLint의 `sort-imports` 끄기   |
| `cssChunking` 옵션             | `next.config.js`에서 청킹 제어 |
| `next build`로 CSS 순서 확인   | 프로덕션 순서 검증             |

### Development vs Production

| 측면         | Development              | Production                          |
| ------------ | ------------------------ | ----------------------------------- |
| CSS 업데이트 | Fast Refresh로 즉시 반영 | 자동 minify, code-split `.css` 파일 |
| JavaScript   | Fast Refresh에 필요      | JS 없이 CSS 로드                    |
| CSS 순서     | 프로덕션과 다를 수 있음  | 최종 확정된 순서                    |

---

## 스타일링 방식 비교

| 방식         | 스코프    | 런타임 | 번들 사이즈 | 동적 스타일 |
| ------------ | --------- | ------ | ----------- | ----------- |
| Global CSS   | 전역      | 없음   | 작음        | 제한적      |
| CSS Modules  | 컴포넌트  | 없음   | 작음        | 제한적      |
| Tailwind CSS | 유틸리티  | 없음   | 최적화됨    | 클래스 조합 |
| CSS-in-JS    | 컴포넌트  | 있음   | 다양        | 완전 지원   |
| Sass         | 전역/모듈 | 없음   | 작음        | 제한적      |
