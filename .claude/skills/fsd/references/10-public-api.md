# FSD Public API Reference

**Source**: https://feature-sliced.design/kr/docs/reference/public-api

---

## Contents

- [1. 정의](#1-정의)
- [2. 좋은 Public API의 조건](#2-좋은-public-api의-조건)
- [3. 안티패턴: Wildcard Re-export](#3-안티패턴-wildcard-re-export)
- [4. Cross-Import용 Public API (@x)](#4-cross-import용-public-api-x)
- [5. Circular Import 방지](#5-circular-import-방지)
- [6. Bundle & Tree-shaking 최적화](#6-bundle--tree-shaking-최적화)
- [7. 대규모 프로젝트 최적화](#7-대규모-프로젝트-최적화)
- [Key Principles](#key-principles)

---

## 1. 정의

Public API는 Slice 기능을 외부에서 사용할 수 있는 공식 경로이다. 일반적으로 re-export를 모아둔 `index.ts` 파일로 구현한다.

```typescript
// pages/auth/index.ts
export { LoginPage } from "./ui/LoginPage";
export { RegisterPage } from "./ui/RegisterPage";
```

---

## 2. 좋은 Public API의 조건

| 조건 | 설명 |
|------|------|
| **내부 구조 변경에 영향 없음** | Slice 내부 폴더 구조 변경 시에도 외부 코드는 그대로 작동 |
| **주요 동작 변경 = API 변경** | Slice의 동작이 크게 바뀌면 Public API도 함께 변경 |
| **필요한 부분만 노출** | Slice 전체 구현이 아닌 필수 기능만 선별 공개 |

---

## 3. 안티패턴: Wildcard Re-export

```typescript
// ❌ WRONG - 무분별한 wildcard re-export
export * from "./ui/Comment";
export * from "./model/comments";
```

| 문제 | 설명 |
|------|------|
| **발견 가능성 저하** | Public API에서 제공되는 기능을 파악하기 어려움 |
| **내부 구현 노출** | 외부에서 알 필요 없는 코드에 의존성 발생 |

```typescript
// ✅ CORRECT - 명시적 named export
export { Comment } from "./ui/Comment";
export { useComments } from "./model/comments";
export type { CommentData } from "./model/comments";
```

---

## 4. Cross-Import용 Public API (@x)

같은 Layer에서 Slice가 다른 Slice를 import해야 하는 경우, `@x` 표기를 사용한다.

```
📂 entities/artist/
  📂 @x/
    📄 song.ts           ← entities/song 전용 Public API
  📄 index.ts            ← 일반 Public API
```

```typescript
// entities/song에서 사용
import type { Artist } from "entities/artist/@x/song";
```

> **⚠️** Cross-import는 Entity Layer에서만 사용을 권장. 다른 Layer에서는 최소화해야 한다.

---

## 5. Circular Import 방지

### 문제 상황

```typescript
// pages/home/index.ts
export { HomePage } from "./ui/HomePage";
export { loadUserStatistics } from "./api/loadUserStatistics";

// pages/home/ui/HomePage.tsx
import { loadUserStatistics } from "../";  // ❌ 순환 참조!
```

### 예방 원칙

| 상황 | 방법 |
|------|------|
| **같은 Slice 내부** | 상대 경로 사용 (`../api/loadUserStatistics`) |
| **다른 Slice** | 절대 경로/Alias 사용 (`@/features/...`) |

> **규칙:** Index에서 export한 모듈이 다시 Index를 참조하지 않도록 한다.

---

## 6. Bundle & Tree-shaking 최적화

### 문제

단일 거대 index.ts에서 여러 모듈을 export하면, 사용하지 않는 코드가 번들에 포함될 수 있다.

### 해결: 컴포넌트별 작은 Index 파일

```
// ❌ WRONG - 거대 단일 index
shared/ui/index.ts  ← Button만 필요해도 carousel, accordion 포함

// ✅ CORRECT - 컴포넌트별 분리
shared/ui/button/index.ts
shared/ui/text-field/index.ts
```

```typescript
// ✅ 컴포넌트 단위로 직접 import
import { Button } from "@/shared/ui/button";
import { TextField } from "@/shared/ui/text-field";
```

---

## 7. 대규모 프로젝트 최적화

Index 파일(barrel 파일)이 너무 많으면 개발 서버 속도와 HMR 성능이 저하될 수 있다.

### 최적화 방법

1. **큰 Index를 작은 단위로 쪼개기**
2. **불필요한 중첩 Index 제거**
   ```
   // ❌ 불필요
   features/comments/ui/index.ts

   // ✅ 충분
   features/comments/index.ts
   ```
3. **기능 단위로 Chunk/패키지 분리**
4. **Monorepo 전략** — 패키지마다 독립적인 FSD Root 구성

### Public API 우회 방지

- **Steiger** 같은 FSD 전용 아키텍처 린터로 import 경로를 검사하고 규칙을 강제한다.

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **명시적 Named Export** | `export *` 대신 필요한 것만 명시적으로 export |
| **내부 구조 캡슐화** | 외부에서 Slice 내부 구조에 직접 접근 금지 |
| **순환 참조 방지** | 같은 Slice 내부는 상대 경로, 외부는 절대 경로 사용 |
| **Tree-shaking 고려** | 거대 index 대신 컴포넌트별 index로 분리 |
