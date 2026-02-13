# FSD Overview

**Source**: https://feature-sliced.design/kr/docs/get-started/overview

---

## Contents

- [1. 개요](#1-개요)
- [2. 3단계 계층 구조](#2-3단계-계층-구조)
- [3. Layer (레이어)](#3-layer-레이어)
- [4. Slice (슬라이스)](#4-slice-슬라이스)
- [5. Segment (세그먼트)](#5-segment-세그먼트)
- [6. 핵심 장점](#6-핵심-장점)
- [7. 점진적 도입](#7-점진적-도입)
- [Key Principles](#key-principles)

---

## 1. 개요

Feature-Sliced Design(FSD)은 프론트엔드 애플리케이션의 코드를 구조화하기 위한 아키텍처 방법론이다. 변화하는 요구사항에도 견고한 구조를 유지하면서 기능 추가를 용이하게 하는 것이 핵심 목표이다.

코드를 **책임도**와 **모듈 간 의존성**에 따라 계층화한다.

### 적용 대상

- 웹, 모바일, 데스크톱 등 프론트엔드 애플리케이션 프로젝트에 최적화
- 단순 라이브러리보다는 완전한 애플리케이션에 적합

### 도입 추천 상황

- 프로젝트 규모 증가로 구조가 복잡해진 경우
- 신규 팀원이 폴더 구조 이해에 어려움을 겪는 경우

---

## 2. 3단계 계층 구조

FSD는 **Layer → Slice → Segment** 3단계로 코드를 조직한다.

```
📂 app                    ← Layer
  📁 routes               ← Segment (app은 Slice 없음)
  📁 analytics
📂 pages                  ← Layer
  📁 home                 ← Slice
  📂 article-reader       ← Slice
    📁 ui                 ← Segment
    📁 api                ← Segment
  📁 settings
📂 shared                 ← Layer (Slice 없음)
  📁 ui                   ← Segment
  📁 api                  ← Segment
```

---

## 3. Layer (레이어)

7개의 표준 레이어 (위에서 아래로, 상위가 하위를 import 가능):

| 순서 | Layer | 역할 |
|------|-------|------|
| 1 | **App** | 라우팅, 진입점, 글로벌 스타일, Provider |
| 2 | ~~Processes~~ | Deprecated |
| 3 | **Pages** | 라우트 기준 주요 화면 단위 |
| 4 | **Widgets** | 독립적으로 동작하는 큰 UI 블록 |
| 5 | **Features** | 비즈니스 가치를 제공하는 재사용 가능한 기능 단위 |
| 6 | **Entities** | 프로젝트의 비즈니스 Entity (User, Post 등) |
| 7 | **Shared** | 모든 레이어에서 재사용되는 코드 |

### 의존성 규칙

```
// ✅ CORRECT - 상위 레이어가 하위 레이어를 import
import { Button } from "shared/ui";         // features → shared
import { UserCard } from "entities/user";    // widgets → entities

// ❌ WRONG - 하위 레이어가 상위 레이어를 import
import { LoginForm } from "features/auth";   // entities → features (금지)
```

---

## 4. Slice (슬라이스)

레이어 내부를 비즈니스 도메인별로 구분하는 단위이다.

### 규칙

- 이름과 개수에 제한 없음
- **같은 레이어 내 다른 슬라이스와 상호 참조 금지**
- 높은 응집도와 낮은 결합도 보장
- 반드시 Public API(index.ts)를 통해서만 외부에 노출

### 예외

- **App**, **Shared** 레이어는 Slice 없이 Segment로만 구성

---

## 5. Segment (세그먼트)

코드 역할에 따라 슬라이스를 세분화하는 최소 단위이다.

| Segment | 역할 | 예시 |
|---------|------|------|
| **ui** | UI 컴포넌트, 포매터, 스타일 | `Button.tsx`, `UserCard.tsx` |
| **api** | 요청 함수, 데이터 타입, 맵퍼 | `fetchUser.ts`, `userDTO.ts` |
| **model** | 스키마, 인터페이스, 스토어, 비즈니스 로직 | `userStore.ts`, `validation.ts` |
| **lib** | 슬라이스 내 공통 라이브러리 코드 | `formatDate.ts` |
| **config** | 설정 파일, 기능 플래그 | `featureFlags.ts` |

> **참고:** `components`, `hooks`, `types` 같은 기술적 이름은 피하고, 목적 기반 이름을 사용한다.

---

## 6. 핵심 장점

| 항목 | 설명 |
|------|------|
| **일관성** | 구조가 표준화되어 팀 간 협업과 온보딩이 쉬워짐 |
| **격리성** | 특정 모듈만 안전하게 수정 가능 |
| **재사용 범위 제어** | DRY 원칙과 실용성 균형 |
| **도메인 중심** | 비즈니스 용어 기반 구조 |

---

## 7. 점진적 도입

1. `app`, `shared` 레이어 정리
2. 기존 UI를 `widgets`, `pages`로 분배
3. Import 위반 해결하며 로직을 `entities`, `features`로 이동

> **⚠️ 주의:** 도입 단계에서는 대규모 Entity나 복잡한 기능 추가를 지양한다.

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Layer → Slice → Segment** | 3단계 계층으로 코드를 조직 |
| **단방향 의존성** | 상위 레이어만 하위 레이어를 import 가능 |
| **슬라이스 격리** | 같은 레이어 내 슬라이스 간 상호 참조 금지 |
| **Public API** | 슬라이스는 index.ts를 통해서만 외부에 노출 |
| **도메인 중심 네이밍** | 기술적 이름이 아닌 비즈니스 도메인 기반 |
