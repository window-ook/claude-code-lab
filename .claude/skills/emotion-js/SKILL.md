---
name: emotion-js
description: Emotion.js(CSS-in-JS) 베스트 프랙티스 가이드. styled 컴포넌트, css prop, Object Styles, Composition, 중첩 셀렉터, 미디어 쿼리, Theming, SSR, CacheProvider, 성능 최적화 등 Emotion 기반 스타일링 구현 시 참조.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Emotion.js Quick Reference

**Version:** 11.14.0
**Doc Source:** Official Emotion.js documentation

## 🎯 Skill 목적

Emotion.js v11을 사용한 CSS-in-JS 스타일링 구현 시 베스트 프랙티스를 적용합니다. `styled` 컴포넌트와 `css` prop 사용, Object Styles 작성, 스타일 Composition, Theming, SSR 설정, 성능 최적화 등 Emotion의 핵심 패턴을 올바르게 구현하도록 안내합니다.

## 🔑 활성화 조건

### 활성화 키워드

- "Emotion", "emotion", "CSS-in-JS", "css-in-js"
- "styled", "@emotion/styled", "@emotion/react"
- "css prop", "css 프롭"
- "Object Styles", "오브젝트 스타일"
- "ThemeProvider", "useTheme", "테마"
- "ClassNames", "CacheProvider"
- "keyframes", "키프레임"

### 필수 조건

- Emotion.js를 사용하는 프로젝트에서 작업 중일 때
- CSS-in-JS 스타일링 로직 구현 시
- 테마 설정이나 SSR 스타일 추출이 필요할 때

---

## 🚨 CRITICAL RULES (Always Enforce)

| 규칙 | 설명 |
|------|------|
| **TypeScript + Object Styles** | CSS 문자열 대신 Object Styles 사용. 타입 검사로 스타일 오타 방지 |
| **스타일 외부 정의** | 스타일을 컴포넌트 함수 **외부**에 정의. 렌더링마다 재직렬화 방지 |
| **정적/동적 분리** | 정적 스타일은 `css` prop, 동적 스타일(자주 변하는 값)은 `style` prop |
| **일관된 방식** | `css` prop 또는 `styled` 중 하나를 프로젝트 전체에서 일관 사용 |
| **peer dependencies** | 라이브러리 작성 시 Emotion을 반드시 `peerDependencies`로 선언 |
| **프로파일링 우선** | 측정 없이 최적화하지 않음. React DevTools로 병목 확인 후 최적화 |

---

## 📚 When to Read Additional Files

### Core Concepts

**Creating styled components?** → [references/core-concepts/01-styled-components.md](references/core-concepts/01-styled-components.md)

- `styled.div`, props 기반 동적 스타일링, `shouldForwardProp`, `as` prop, Component Selectors

**Composing styles?** → [references/core-concepts/02-composition.md](references/core-concepts/02-composition.md)

- 스타일 합성, 배열 기반 스타일 병합, 일반 CSS와의 차이점

**Using Object Styles?** → [references/core-concepts/03-object-styles.md](references/core-concepts/03-object-styles.md)

- `css` prop / `styled`에서 Object Styles, 숫자 값 처리, 배열 스타일, Fallbacks

**Nesting selectors?** → [references/core-concepts/04-nested-selectors.md](references/core-concepts/04-nested-selectors.md)

- 중첩 셀렉터, `&` (Ampersand) 셀렉터

**Writing media queries?** → [references/core-concepts/05-media-queries.md](references/core-concepts/05-media-queries.md)

- 기본 미디어 쿼리, 재사용 가능한 breakpoints, Facepaint 라이브러리

---

### Advanced

#### Best Practices & Performance

**Best practices?** → [references/advanced/01-best-practices.md](references/advanced/01-best-practices.md)

- TypeScript + Object Styles, 스타일 코로케이션, 정적/동적 분리, CSS 변수 활용, 스타일 상수, 테마 전략

**Performance optimization?** → [references/advanced/09-performance.md](references/advanced/09-performance.md)

- 프로파일링 우선, 리렌더링 줄이기, 컴포넌트 인스턴스 통합, 스타일 외부 정의, Babel 플러그인

#### Styling Patterns

**Using keyframes?** → [references/advanced/02-keyframes.md](references/advanced/02-keyframes.md)

- `keyframes` 헬퍼, 애니메이션 정의 및 적용

**Attaching props?** → [references/advanced/04-attaching-props.md](references/advanced/04-attaching-props.md)

- props 전달 패턴, 동적 스타일링과 prop 연동

**Using labels?** → [references/advanced/06-labels.md](references/advanced/06-labels.md)

- 커스텀 라벨로 디버깅 편의성 향상

#### Theming & Providers

**Setting up themes?** → [references/advanced/05-theming.md](references/advanced/05-theming.md)

- `ThemeProvider`, `useTheme` Hook, 중첩 테마 병합, `withTheme` HOC, TypeScript 테마 타이핑

**Configuring CacheProvider?** → [references/advanced/08-cache-provider.md](references/advanced/08-cache-provider.md)

- `createCache`, `CacheProvider`, 커스텀 `key`/`nonce`/`prepend` 설정

#### Integration

**Server-side rendering?** → [references/advanced/03-ssr.md](references/advanced/03-ssr.md)

- Default vs Advanced SSR, `renderStylesToString`, `extractCritical`, Next.js/Gatsby 통합

**Styling third-party components?** → [references/advanced/07-class-names.md](references/advanced/07-class-names.md)

- `ClassNames` render prop, `css`/`cx` 함수, `wrapperClassName` 등 비표준 prop 스타일링

**Building component libraries?** → [references/advanced/10-for-library-authors.md](references/advanced/10-for-library-authors.md)

- Emotion 의존성 단점, 일반 CSS 대안, peer dependencies 필수, 라이브러리 설계 가이드라인
