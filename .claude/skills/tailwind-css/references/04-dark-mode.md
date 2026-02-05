# Dark Mode

**Doc Version**: 4.1
**Source**: https://tailwindcss.com/docs/dark-mode

---

## Contents

- [1. Overview](#1-overview)
- [2. Default Implementation (prefers-color-scheme)](#2-default-implementation-prefers-color-scheme)
- [3. Manual Dark Mode Toggle](#3-manual-dark-mode-toggle)
- [4. System Theme with Manual Override](#4-system-theme-with-manual-override)
- [5. Theme Color Meta Tags](#5-theme-color-meta-tags)
- [Key Principles](#key-principles)

---

## 1. Overview

Tailwind CSS는 다크 모드 스타일링을 위한 `dark` 변형을 제공합니다. 기본적으로 `prefers-color-scheme` CSS 미디어 기능을 사용하지만, 수동 다크 모드 토글을 지원하도록 커스터마이징할 수 있습니다.

---

## 2. Default Implementation (prefers-color-scheme)

기본적으로 다크 모드 유틸리티는 사용자의 운영체제 설정에 따라 적용됩니다:

```html
<div
  class="rounded-lg bg-white px-6 py-8 shadow-xl ring ring-gray-900/5 dark:bg-gray-800"
>
  <div>
    <span
      class="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg"
    >
      <svg class="h-6 w-6 stroke-white"><!-- ... --></svg>
    </span>
  </div>
  <h3 class="mt-5 text-base font-medium tracking-tight text-gray-900 dark:text-white">
    Writes upside-down
  </h3>
  <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
    The Zero Gravity Pen can be used to write in any orientation, including
    upside-down.
  </p>
</div>
```

### 생성되는 CSS

```css
.dark\:bg-gray-800 {
  @media (prefers-color-scheme: dark) {
    background-color: var(--color-gray-800);
  }
}
```

---

## 3. Manual Dark Mode Toggle

### CSS 클래스 사용

미디어 쿼리 대신 클래스 셀렉터를 사용하도록 `dark` 변형 오버라이드:

**app.css**

```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
```

**HTML**

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```

JavaScript로 `dark` 클래스를 추가/제거하여 다크 모드를 토글합니다.

### Data 속성 사용

data 속성 기반 접근 방식:

**app.css**

```css
@import 'tailwindcss';
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

**HTML**

```html
<html data-theme="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```

---

## 4. System Theme with Manual Override

라이트 모드, 다크 모드, 시스템 설정을 지원하는 3가지 테마 토글 구현:

```javascript
// 페이지 로드 시 또는 테마 변경 시
// FOUC 방지를 위해 <head>에 인라인으로 추가하는 것이 좋음
document.documentElement.classList.toggle(
  'dark',
  localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
);

// 사용자가 명시적으로 라이트 모드 선택 시
localStorage.theme = 'light';

// 사용자가 명시적으로 다크 모드 선택 시
localStorage.theme = 'dark';

// 사용자가 명시적으로 OS 설정 따르기 선택 시
localStorage.removeItem('theme');
```

### React/Next.js 구현 예시

```tsx
'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    root.classList.remove('light', 'dark');

    if (theme === 'dark' || (theme === 'system' && systemDark)) {
      root.classList.add('dark');
    }

    if (theme !== 'system') {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }, [theme]);

  return { theme, setTheme };
}
```

### 테마 토글 컴포넌트

```tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
      className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

---

## 5. Theme Color Meta Tags

브라우저/앱이 적절한 UI 크롬을 표시하도록 theme-color 메타 태그 관리:

```javascript
window._updateTheme = function updateTheme(theme) {
  const classList = document.documentElement.classList;

  classList.remove('light', 'dark', 'system');
  document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());

  if (theme === 'dark') {
    classList.add('dark');
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = 'oklch(.13 .028 261.692)'; // 다크 색상
    document.head.appendChild(meta);
  } else if (theme === 'light') {
    classList.add('light');
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = 'white'; // 라이트 색상
    document.head.appendChild(meta);
  } else {
    // 시스템 설정 (미디어 쿼리 사용)
    classList.add('system');

    const darkMeta = document.createElement('meta');
    darkMeta.name = 'theme-color';
    darkMeta.content = 'oklch(.13 .028 261.692)';
    darkMeta.media = '(prefers-color-scheme: dark)';
    document.head.appendChild(darkMeta);

    const lightMeta = document.createElement('meta');
    lightMeta.name = 'theme-color';
    lightMeta.content = 'white';
    lightMeta.media = '(prefers-color-scheme: light)';
    document.head.appendChild(lightMeta);
  }
};
```

### Next.js에서 FOUC 방지

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && systemDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Key Principles

| Principle           | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| FOUC 방지           | `<head>`에 테마 스크립트를 인라인으로 추가하여 깜빡임 방지 |
| localStorage 지속성 | 사용자 선택을 저장하여 세션 간 유지                        |
| 시스템 감지         | `matchMedia`로 OS 설정 감지                                |
| 유연한 구현         | 클라이언트 또는 서버 사이드에서 테마 관리 가능             |
| 메타 태그           | theme-color 메타 태그로 브라우저 UI 색상 조정              |
| @custom-variant     | 미디어 쿼리 대신 클래스/속성 기반 다크 모드 구현           |

### 유틸리티 클래스 사용 예시

```html
<!-- 텍스트 색상 -->
<p class="text-gray-900 dark:text-white"></p>

<!-- 배경 색상 -->
<div class="bg-white dark:bg-gray-800"></div>

<!-- 테두리 색상 -->
<button class="border border-gray-300 dark:border-gray-600"></button>

<!-- 그림자 -->
<span class="shadow-lg dark:shadow-xl"></span>

<!-- 링 -->
<input class="ring-1 ring-gray-300 dark:ring-gray-600" />
```
