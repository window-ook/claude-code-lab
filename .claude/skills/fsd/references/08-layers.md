# FSD Layers Reference

**Source**: https://feature-sliced.design/kr/docs/reference/layers

---

## Contents

- [1. 개요](#1-개요)
- [2. Import 규칙](#2-import-규칙)
- [3. Shared](#3-shared)
- [4. Entities](#4-entities)
- [5. Features](#5-features)
- [6. Widgets](#6-widgets)
- [7. Pages](#7-pages)
- [8. App](#8-app)
- [Key Principles](#key-principles)

---

## 1. 개요

Layer는 FSD에서 코드를 나누는 가장 큰 단위이다. 모든 레이어를 반드시 사용할 필요는 없다.

```
src/
├── app/          (레벨 1 - 최상단)
├── pages/        (레벨 3)
├── widgets/      (레벨 4)
├── features/     (레벨 5)
├── entities/     (레벨 6)
└── shared/       (레벨 7 - 최하단)
```

> **참고:** Processes(레벨 2)는 Deprecated. Feature나 App Layer로 대체한다.

---

## 2. Import 규칙

> Slice 내부 코드는 자신이 속한 Layer보다 **아래 Layer에 있는 다른 Slice만** import할 수 있다.

```typescript
// features/aaa/api/request.ts 기준

// ❌ 같은 Layer의 features/bbb → import 불가
import { something } from "features/bbb";

// ✅ 더 아래 Layer (entities, shared) → import 가능
import { UserCard } from "entities/user";
import { Button } from "shared/ui";

// ✅ 같은 Slice 내부 → import 가능
import { cache } from "../lib/cache";
```

### App & Shared의 특수성

두 레이어는 Slice 없이 Segment로만 구성되며, 내부에서 Segment끼리 자유롭게 import할 수 있다.

---

## 3. Shared

**앱의 기본 구성 요소와 기반 도구들을 모아두는 곳**

- Slice 없이 Segment 구조로만 구성
- 비즈니스 도메인 없음
- 모든 곳에서 import 가능

| Segment | 역할 |
|---------|------|
| `api` | API 클라이언트, 백엔드 요청 함수 |
| `ui` | 공통 UI 컴포넌트 (비즈니스 로직 제외) |
| `lib` | 내부 라이브러리 (날짜, 색상, 텍스트 등 단일 주제) |
| `config` | 환경변수, 전역 Feature Flag |
| `routes` | 라우트 상수/패턴 |
| `i18n` | 번역 설정, 전역 문자열 |

> **⚠️** Segment 이름은 명확하게. `components`, `hooks`, `types` 피하기

---

## 4. Entities

**프로젝트의 핵심 비즈니스 개념을 표현**

- 실제 도메인 용어 사용 (User, Post, Product 등)
- Slice별 구성

| Segment | 내용 |
|---------|------|
| `model` | 데이터 상태, 도메인 로직, 검증 스키마 |
| `api` | Entity 관련 API 요청 |
| `ui` | Entity의 시각적 표현 (재사용 가능하게 설계) |

### Entity 간 관계 처리

- Entity Slice끼리는 서로를 모르는 상태가 이상적
- 데이터 포함 필요 시 `@x` 표기법으로 Cross Public API 사용

```typescript
// entities/artist/model/artist.ts
import type { Song } from "entities/song/@x/artist";

export interface Artist {
  name: string;
  songs: Array<Song>;
}
```

---

## 5. Features

**사용자가 애플리케이션에서 수행하는 주요 기능**

| Segment | 역할 |
|---------|------|
| `ui` | 상호작용 UI (폼, 검색바 등) |
| `api` | 기능 관련 API 요청 |
| `model` | 검증 로직, 내부 상태 관리 |
| `config` | Feature Flag, 기능별 설정 |

> **설계 목표:** 새로운 팀원이 Page와 Feature만 훑어봐도 앱의 기능을 이해할 수 있도록

> **⚠️** Feature를 너무 많이 만들면 중요 기능 찾기가 어려워진다.

---

## 6. Widgets

**독립적으로 동작하는 비교적 큰 UI 블록**

- 여러 페이지에서 재사용되는 경우 → Widget으로 분리
- 한 페이지에서만 쓰이고 핵심 콘텐츠인 경우 → Page 내부에 유지

---

## 7. Pages

**웹/앱에서 보이는 화면 또는 액티비티**

| Segment | 내용 |
|---------|------|
| `ui` | 페이지 UI, 로딩/에러 상태 처리 |
| `api` | 데이터 패칭/변경 요청 |

- 보통 "1페이지 = 1 Slice" (유사한 페이지는 하나의 Slice로 묶기 가능)
- 재사용되지 않는 UI는 Page 내부에 유지
- 전용 model은 보통 불필요

---

## 8. App

**앱 전역에서 동작하는 환경 설정과 공용 로직**

- Slice 없이 Segment만으로 구성

| Segment | 역할 |
|---------|------|
| `routes` | Router 설정 |
| `store` | Global State Store 설정 |
| `styles` | Global Style |
| `entrypoint` | Application Entry Point, Framework 설정 |

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **단방향 의존성** | 상위 Layer만 하위 Layer를 import 가능 |
| **최소 구성** | 대부분 `shared`, `pages`, `app` 필수, 나머지는 필요시 추가 |
| **Shared/App 특수성** | Slice 없이 Segment로만 구성, 내부 자유 import |
| **새로운 Layer 금지** | 표준 7개(실질 6개) Layer만 사용 |
