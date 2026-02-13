# FSD Page Layouts

**Source**: https://feature-sliced.design/kr/docs/guides/examples/page-layout

---

## Contents

- [1. 개요](#1-개요)
- [2. Simple Layout](#2-simple-layout)
- [3. Widget 적용 시 고려사항](#3-widget-적용-시-고려사항)
- [4. 레이어 규칙 준수 방법](#4-레이어-규칙-준수-방법)
- [Key Principles](#key-principles)

---

## 1. 개요

여러 페이지에서 공통 영역(header, sidebar, footer)을 공유하되, 콘텐츠 영역만 변경되는 페이지 레이아웃 패턴을 설명한다.

---

## 2. Simple Layout

### 구성 요소

- 상단 header (네비게이션, 테마 버튼)
- 좌우 sidebar (목차, 관련 페이지)
- 외부 링크가 포함된 footer

### 배치 위치

레이아웃 컴포넌트는 `shared/ui` 또는 `app/layouts`에 배치한다.

### Props 주입 패턴

레이아웃은 틀만 제공하고, 구체적인 내용은 props로 렌더링한다:

```typescript
export function Layout({ siblingPages, headings }) {
  const [theme, toggleTheme] = useThemeSwitcher();
  return (
    <div>
      <header>{/* 네비게이션 및 테마 버튼 */}</header>
      <main>
        <SiblingPageSidebar />
        <Outlet />  {/* 주요 콘텐츠 */}
        <HeadingsSidebar />
      </main>
      <footer>{/* 외부 링크 */}</footer>
    </div>
  );
}
```

---

## 3. Widget 적용 시 고려사항

### 문제점

레이아웃이 비즈니스 로직(인증, 데이터 로딩)을 수행해야 할 때, "위에서 아래를 가져오는" 잘못된 의존성이 생길 수 있다.

### 선행 검토 항목

- 이 레이아웃이 정말 필요한가?
- 2~3곳의 페이지만 사용한다면 특정 페이지용 wrapper일 수 있음

### 대안 1: App Layer Inline 작성

React Router의 nesting 기능으로 URL 패턴이 공통된 경로를 route group으로 묶어 한 번만 레이아웃을 지정한다.

### 대안 2: 코드 복사-붙여넣기

레이아웃은 자주 변경되지 않으므로, 필요한 페이지마다 복사해 사용하고 주석으로 관계를 표시한다.

---

## 4. 레이어 규칙 준수 방법

### 방법 1: Render Props / Slots 패턴

부모 레이아웃이 UI 틀을 제공하고, 자식이 전달한 UI를 특정 위치에 주입한다.

```typescript
// ✅ CORRECT - render props로 의존성 역전
<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  content={<PageContent />}
/>
```

### 방법 2: App Layer 이동

레이아웃을 `app/layouts`로 이동하면, App layer는 아래 layer를 자유롭게 import할 수 있어 레이어 규칙을 지킨다.

```
// ✅ CORRECT
📂 app
  📂 layouts
    📄 MainLayout.tsx    ← widgets, features 자유롭게 import 가능
```

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Props 주입** | 레이아웃은 틀만 제공, 내용은 props/children으로 전달 |
| **의존성 방향 준수** | 레이아웃이 상위 레이어를 import하지 않도록 설계 |
| **과도한 추상화 지양** | 2~3곳만 사용하면 복사-붙여넣기가 더 나을 수 있음 |
