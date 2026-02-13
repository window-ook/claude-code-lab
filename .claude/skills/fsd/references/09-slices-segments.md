# FSD Slices & Segments Reference

**Source**: https://feature-sliced.design/kr/docs/reference/slices-segments

---

## Contents

- [1. 슬라이스 정의](#1-슬라이스-정의)
- [2. 슬라이스 핵심 원칙](#2-슬라이스-핵심-원칙)
- [3. 슬라이스 그룹](#3-슬라이스-그룹)
- [4. 세그먼트 정의](#4-세그먼트-정의)
- [5. 표준 세그먼트](#5-표준-세그먼트)
- [6. 커스텀 세그먼트](#6-커스텀-세그먼트)
- [Key Principles](#key-principles)

---

## 1. 슬라이스 정의

슬라이스(Slice)는 FSD의 두 번째 계층으로, 서로 관련 있는 코드를 하나로 묶는 역할을 한다. 비즈니스 도메인에 따라 자유롭게 명명한다.

### 예시

| 프로젝트 | 슬라이스 예시 |
|----------|--------------|
| 사진 갤러리 | `photo`, `effects`, `gallery-page` |
| 소셜 네트워크 | `post`, `comments`, `news-feed` |

### 예외 레이어

- **Shared** — 비즈니스 로직이 없어 슬라이스를 갖지 않음
- **App** — 애플리케이션 전체를 다루므로 슬라이스 불필요

---

## 2. 슬라이스 핵심 원칙

### 결합도와 응집도

- 다른 Slice와 최대한 독립적이어야 함
- 자신의 핵심 목적과 직접 관련된 코드 대부분을 내부에 포함해야 함

### 레이어 Import 규칙

> Slice 내부 모듈은 자신보다 아래 계층의 Slice만 import할 수 있다.

### Public API 규칙

> 모든 Slice는 Public API를 정의해야 한다. 외부 모듈은 내부 구조에 직접 접근하지 않고, Public API를 통해서만 접근해야 한다.

---

## 3. 슬라이스 그룹

연관성 높은 슬라이스들을 폴더로 묶어 관리할 수 있다.

```
📂 entities/
  📂 user-related/        ← 슬라이스 그룹 (폴더)
    📂 user/              ← 슬라이스
    📂 user-profile/      ← 슬라이스
    📂 user-settings/     ← 슬라이스
```

> **⚠️** 그룹 내에서도 격리 규칙이 적용되며 코드 공유는 허용되지 않는다.

---

## 4. 세그먼트 정의

세그먼트(Segment)는 FSD의 세 번째이자 마지막 계층으로, 기술적인 역할과 성격에 따라 코드를 분류한다.

---

## 5. 표준 세그먼트

| Segment | 설명 | 예시 |
|---------|------|------|
| **ui** | 컴포넌트, 날짜 포매터, 스타일 등 UI 관련 코드 | `Button.tsx`, `formatDate.ts` |
| **api** | 백엔드 통신, 요청 함수, 데이터 타입, 매퍼 | `fetchUser.ts`, `userDTO.ts` |
| **model** | 스키마, 인터페이스, 스토어, 비즈니스 로직 | `userStore.ts`, `schema.ts` |
| **lib** | 슬라이스 내부에서 사용하는 라이브러리 코드 | `helpers.ts`, `constants.ts` |
| **config** | 설정, 기능 플래그 등 구성 관련 코드 | `featureFlags.ts` |

---

## 6. 커스텀 세그먼트

프로젝트 특성에 맞게 사용자 정의 세그먼트를 정의할 수 있다. 특히 Shared와 App 레이어에서 자주 활용한다.

### 네이밍 가이드

```
// ❌ WRONG - 성격 중심 이름
📂 components/
📂 hooks/
📂 types/

// ✅ CORRECT - 목적 중심 이름
📂 auth/
📂 analytics/
📂 i18n/
```

> **원칙:** 세그먼트명은 "무엇을 위해 존재하는지(목적)"를 드러내야 한다.

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **도메인 기반 슬라이스** | 비즈니스 도메인에 따라 자유롭게 명명 |
| **슬라이스 격리** | 같은 레이어 내 슬라이스 간 상호 참조 금지 |
| **Public API 필수** | 모든 슬라이스는 index.ts를 통해서만 외부에 노출 |
| **목적 기반 세그먼트명** | `components` 대신 `ui`, `hooks` 대신 구체적 목적명 사용 |
| **슬라이스 그룹 가능** | 연관 슬라이스를 폴더로 묶되, 격리 규칙은 유지 |
