# FSD Desegmentation

**Source**: https://feature-sliced.design/kr/docs/guides/issues/desegmented

---

## Contents

- [1. 개념 정의](#1-개념-정의)
- [2. 전형적인 탈세그먼트화 구조](#2-전형적인-탈세그먼트화-구조)
- [3. 문제점](#3-문제점)
- [4. 해결 방안](#4-해결-방안)
- [Key Principles](#key-principles)

---

## 1. 개념 정의

탈세그먼트화(Desegmentation)는 기술적 역할에 따라 파일을 그룹화하되, 비즈니스 도메인과는 독립적으로 처리하는 안티패턴이다. "수평적 슬라이싱" 또는 "레이어별 패키징"으로도 알려져 있다.

---

## 2. 전형적인 탈세그먼트화 구조

### 메타프레임워크 패턴 (Next.js, Nuxt)

```
// ❌ WRONG - 기술 역할별 폴더 분리
📂 app
  📂 components/
    📄 DeliveryCard.jsx
    📄 DeliveryChoice.jsx
    📄 RegionSelect.jsx
    📄 UserAvatar.jsx
  📂 actions/
    📄 delivery.js
    📄 region.js
    📄 user.js
  📂 stores/
    📂 delivery/
      📄 getters.js
      📄 actions.js
```

### FSD 내 탈세그먼트화 (안티패턴)

```
// ❌ WRONG - 제네릭 폴더명 사용
📂 features/delivery/ui/
  📂 components    ← 제네릭 폴더

📂 entities/recommendations/
  📂 utils         ← 제네릭 폴더
```

---

## 3. 문제점

| 문제 | 설명 |
|------|------|
| **낮은 응집도** | 단일 기능 수정 시 여러 대규모 폴더의 파일을 동시에 편집해야 함 |
| **높은 결합도** | 컴포넌트 간 예상치 못한 의존성 → 복잡한 종속성 체인 |
| **리팩토링 어려움** | 특정 도메인 관련 코드를 수동으로 추출하는 데 추가 노력 필요 |

### 제네릭 파일명의 문제

```typescript
// ❌ WRONG - 여러 도메인이 한 파일에 혼재
// pages/delivery/model/types.ts
export interface DeliveryOption { id: string; name: string; price: number; }
export interface UserInfo { id: string; name: string; avatar: string; }

// pages/delivery/model/utils.ts
export function formatDeliveryPrice(price: number) { /* ... */ }
export function getUserInitials(name: string) { /* ... */ }
```

---

## 4. 해결 방안

### 핵심 원칙

1. **도메인별 응집** — 특정 도메인 관련 모든 코드를 한 곳에 그룹화
2. **제네릭 폴더명 제거** — `types`, `components`, `utils` 같은 기술적 폴더명 회피
3. **명확한 파일명** — `types.ts`, `utils.ts` 대신 도메인을 반영한 파일명 사용

### 개선된 구조

```
// ✅ CORRECT - 도메인별 파일 분리
📂 pages/delivery/
  📄 index.tsx
  📂 ui/
    📄 DeliveryPage.tsx
    📄 DeliveryCard.tsx
    📄 DeliveryChoice.tsx
  📂 model/
    📄 delivery.ts      ← 배송 로직만
    📄 user.ts           ← 사용자 로직만 (분리)
```

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **도메인별 응집** | 기술 역할이 아닌 비즈니스 도메인 기준으로 파일 그룹화 |
| **제네릭 네이밍 금지** | `types.ts`, `utils.ts`, `components/` 같은 이름 회피 |
| **단일 도메인 파일** | 한 파일에 여러 도메인 로직 혼재 금지 |
