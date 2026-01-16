# Next.js Project Structure

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/project-structure

---

## Contents

- [1. Top-Level Folders](#1-top-level-folders)
- [2. Top-Level Files](#2-top-level-files)
- [3. Routing Files (App Router)](#3-routing-files-app-router)
- [4. Nested Routes (중첩 라우트)](#4-nested-routes-중첩-라우트)
- [5. Dynamic Routes (동적 라우트)](#5-dynamic-routes-동적-라우트)
- [6. Route Groups & Private Folders](#6-route-groups--private-folders)
- [7. Parallel & Intercepted Routes](#7-parallel--intercepted-routes)
- [8. Metadata File Conventions](#8-metadata-file-conventions)
- [9. Project Organization Strategies](#9-project-organization-strategies)
- [Key Principles](#key-principles)

---

## 1. Top-Level Folders

| Folder   | Purpose                                          |
| -------- | ------------------------------------------------ |
| `app`    | App Router - 메인 애플리케이션 코드 디렉토리     |
| `pages`  | Pages Router (레거시 라우팅 시스템)              |
| `public` | 정적 에셋 (이미지, 폰트 등) - 직접 서빙됨        |
| `src`    | 선택적 소스 폴더 - 설정 파일과 앱 코드 분리 용도 |

---

## 2. Top-Level Files

### Next.js 설정 파일

| File                 | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `next.config.js`     | Next.js 메인 설정 파일                           |
| `package.json`       | 프로젝트 의존성 및 스크립트                      |
| `instrumentation.ts` | OpenTelemetry 및 계측 설정                       |
| `proxy.ts`           | 요청 프록시 설정                                 |
| `eslint.config.mjs`  | ESLint 설정                                      |
| `tsconfig.json`      | TypeScript 설정                                  |
| `jsconfig.json`      | JavaScript 설정                                  |
| `.gitignore`         | Git 제외 규칙                                    |
| `next-env.d.ts`      | Next.js TypeScript 선언 (자동 생성, 추적 불필요) |

### 환경 변수 파일

| File               | Purpose                              |
| ------------------ | ------------------------------------ |
| `.env`             | 일반 환경 변수 (버전 관리 제외)      |
| `.env.local`       | 로컬 전용 환경 변수 (버전 관리 제외) |
| `.env.production`  | 프로덕션 환경 변수 (버전 관리 제외)  |
| `.env.development` | 개발 환경 변수 (버전 관리 제외)      |

---

## 3. Routing Files (App Router)

### 라우팅 파일 컨벤션

| File           | Extensions            | Purpose                                        |
| -------------- | --------------------- | ---------------------------------------------- |
| `layout`       | `.js`, `.jsx`, `.tsx` | 공유 UI 래퍼 (header, nav, footer)             |
| `page`         | `.js`, `.jsx`, `.tsx` | 공개 라우트 컴포넌트                           |
| `loading`      | `.js`, `.jsx`, `.tsx` | 로딩 스켈레톤/UI (React Suspense 경계)         |
| `error`        | `.js`, `.jsx`, `.tsx` | 에러 바운더리                                  |
| `global-error` | `.js`, `.jsx`, `.tsx` | 전역 에러 UI 바운더리                          |
| `not-found`    | `.js`, `.jsx`, `.tsx` | 404/찾을 수 없음 UI                            |
| `route`        | `.js`, `.ts`          | API 엔드포인트 핸들러                          |
| `template`     | `.js`, `.jsx`, `.tsx` | 재렌더링 레이아웃 (네비게이션마다 새 인스턴스) |
| `default`      | `.js`, `.jsx`, `.tsx` | 병렬 라우트 폴백 페이지                        |

### 컴포넌트 렌더링 계층 구조

파일은 다음 순서로 렌더링됩니다:

```
1. layout.js
2. template.js
3. error.js (React error boundary)
4. loading.js (React Suspense boundary)
5. not-found.js (React error boundary)
6. page.js 또는 중첩된 layout.js
```

---

## 4. Nested Routes (중첩 라우트)

라우트는 폴더 구조로 정의됩니다. `page` 또는 `route` 파일이 존재할 때만 **공개** 라우트가 됩니다.

| Path                        | URL             | Notes                            |
| --------------------------- | --------------- | -------------------------------- |
| `app/layout.tsx`            | —               | 루트 레이아웃 (모든 라우트 래핑) |
| `app/blog/layout.tsx`       | —               | `/blog` 및 하위 라우트 래핑      |
| `app/page.tsx`              | `/`             | 공개 라우트                      |
| `app/blog/page.tsx`         | `/blog`         | 공개 라우트                      |
| `app/blog/authors/page.tsx` | `/blog/authors` | 공개 라우트                      |

**핵심 원칙**: `page.js` 또는 `route.js`만 콘텐츠를 공개적으로 접근 가능하게 만듭니다. 다른 파일들은 라우트가 되지 않고 안전하게 함께 배치할 수 있습니다.

---

## 5. Dynamic Routes (동적 라우트)

대괄호를 사용하여 매개변수화된 세그먼트를 생성합니다:

| Path                            | URL Pattern                                            | Description        |
| ------------------------------- | ------------------------------------------------------ | ------------------ |
| `app/blog/[slug]/page.tsx`      | `/blog/my-first-post`                                  | 단일 동적 세그먼트 |
| `app/shop/[...slug]/page.tsx`   | `/shop/clothing`, `/shop/clothing/shirts`              | Catch-all 라우트   |
| `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts-and-pages`, `/docs/api/router` | 선택적 Catch-all   |

페이지 컴포넌트에서 `params` prop을 통해 접근합니다.

```typescript
// Next.js 16에서는 params가 Promise입니다
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  return <h1>{slug}</h1>;
}
```

---

## 6. Route Groups & Private Folders

### Route Groups (라우트 그룹)

**형식**: `(groupName)`

- URL에 영향을 주지 않고 라우트를 구성
- 다중 섹션 앱에 유용 (marketing, shop, admin)
- 같은 세그먼트 레벨에서 여러 레이아웃 활성화

```
app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx          → URL: /
├── (shop)/
│   ├── layout.tsx
│   ├── cart/page.tsx     → URL: /cart
│   └── account/page.tsx  → URL: /account
└── checkout/page.tsx     → URL: /checkout
```

### Private Folders (프라이빗 폴더)

**형식**: `_folderName`

- 폴더를 라우팅 시스템에서 제외
- 유틸리티와 컴포넌트를 함께 배치하기에 안전
- UI 로직을 라우팅 로직과 분리하는 데 유용

```
app/
├── blog/
│   ├── _components/     → 라우팅 안됨
│   │   └── Post.tsx
│   └── page.tsx
```

**언더스코어로 시작하는 URL 세그먼트 생성**: `%5FfolderName` 사용 (URL 인코딩된 언더스코어)

---

## 7. Parallel & Intercepted Routes

### Parallel Routes (병렬 라우트)

**형식**: `@slotName`

- 부모 레이아웃에서 렌더링되는 명명된 슬롯
- **사용 사례**: 사이드바 + 메인 콘텐츠 레이아웃

```
app/
├── @sidebar/
│   └── page.tsx
├── @main/
│   └── page.tsx
└── layout.tsx           → sidebar와 main 슬롯 모두 렌더링
```

### Intercepted Routes (인터셉트 라우트)

| Pattern          | Meaning             | Use Case                  |
| ---------------- | ------------------- | ------------------------- |
| `(.)folder`      | 같은 레벨 인터셉트  | 모달에서 형제 미리보기    |
| `(..)folder`     | 부모 인터셉트       | 오버레이로 자식 열기      |
| `(..)(..)folder` | 두 레벨 위 인터셉트 | 깊게 중첩된 오버레이      |
| `(...)folder`    | 루트에서 인터셉트   | 뷰에서 임의의 라우트 표시 |

**사용 사례**: 모달 패턴 - 목록에서 아이템 클릭 시 모달로 표시, 직접 URL 접근 시 전체 페이지로 표시

---

## 8. Metadata File Conventions

### App Icons

| File         | Extensions                              | Purpose             |
| ------------ | --------------------------------------- | ------------------- |
| `favicon`    | `.ico`                                  | 파비콘              |
| `icon`       | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | 앱 아이콘           |
| `icon`       | `.js`, `.ts`, `.tsx`                    | 생성된 앱 아이콘    |
| `apple-icon` | `.jpg`, `.jpeg`, `.png`                 | Apple 앱 아이콘     |
| `apple-icon` | `.js`, `.ts`, `.tsx`                    | 생성된 Apple 아이콘 |

### Open Graph & Twitter Images

| File              | Extensions                      | Purpose               |
| ----------------- | ------------------------------- | --------------------- |
| `opengraph-image` | `.jpg`, `.jpeg`, `.png`, `.gif` | Open Graph 이미지     |
| `opengraph-image` | `.js`, `.ts`, `.tsx`            | 생성된 OG 이미지      |
| `twitter-image`   | `.jpg`, `.jpeg`, `.png`, `.gif` | Twitter 카드 이미지   |
| `twitter-image`   | `.js`, `.ts`, `.tsx`            | 생성된 Twitter 이미지 |

### SEO

| File      | Extensions   | Purpose            |
| --------- | ------------ | ------------------ |
| `sitemap` | `.xml`       | XML 사이트맵       |
| `sitemap` | `.js`, `.ts` | 생성된 사이트맵    |
| `robots`  | `.txt`       | robots.txt 파일    |
| `robots`  | `.js`, `.ts` | 생성된 robots 파일 |

---

## 9. Project Organization Strategies

### Strategy 1: Files Outside `app`

재사용 가능한 코드를 루트 디렉토리(`/components`, `/lib`)에 저장하고 `app`은 순수하게 라우팅용으로 유지

```
/
├── components/
├── lib/
├── app/
│   ├── page.tsx
│   └── dashboard/page.tsx
```

### Strategy 2: Files Inside `app` Root

공유 코드를 `app/` 내 최상위 폴더에 저장

```
app/
├── _components/
├── _lib/
├── page.tsx
└── dashboard/page.tsx
```

### Strategy 3: Split by Feature/Route

전역 공유 코드는 루트 `app/`에, 기능별 코드는 라우트 세그먼트에 분할

```
app/
├── _components/         → 전역 공유 컴포넌트
├── dashboard/
│   ├── _components/     → 대시보드 전용 컴포넌트
│   └── page.tsx
└── page.tsx
```

### Strategy 4: Multiple Root Layouts

최상위 `layout.js`를 제거하고 각 라우트 그룹에 `layout.js` 추가. 각각 `<html>`과 `<body>` 태그 필요

```
app/
├── (marketing)/
│   └── layout.tsx       → <html><body>...</body></html>
├── (shop)/
│   └── layout.tsx       → <html><body>...</body></html>
```

---

## Key Principles

| Principle           | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| Safe to colocate    | 라우팅 불가 파일은 라우트 세그먼트에 공개되지 않고 함께 배치 가능 |
| Unopinionated       | Next.js는 유연성 제공, 단일 "올바른" 구조 없음                    |
| Opt-out conventions | 프라이빗 폴더(`_`)와 라우트 그룹(`()`)으로 동작 커스터마이즈      |
| Route accessibility | `page.js` 또는 `route.js`만 콘텐츠를 공개적으로 접근 가능하게 함  |
| Consistency         | 전략을 선택하고 프로젝트 전체에서 일관성 유지                     |
