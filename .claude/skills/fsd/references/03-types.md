# FSD Types

**Source**: https://feature-sliced.design/kr/docs/guides/examples/types

---

## Contents

- [1. 유틸리티 타입](#1-유틸리티-타입)
- [2. 비즈니스 Entity와 상호 참조](#2-비즈니스-entity와-상호-참조)
- [3. DTO와 Mappers](#3-dto와-mappers)
- [4. Global 타입과 Redux](#4-global-타입과-redux)
- [5. 열거형 (Enum)](#5-열거형-enum)
- [6. 타입 검증 Schema (Zod)](#6-타입-검증-schema-zod)
- [7. Component Props & Context 타입](#7-component-props--context-타입)
- [8. Ambient 선언 파일](#8-ambient-선언-파일)
- [9. 타입 자동 생성](#9-타입-자동-생성)
- [Key Principles](#key-principles)

---

## 1. 유틸리티 타입

- 외부 라이브러리(`type-fest`) 설치 또는 내부 라이브러리 구축
- 실제 사용 위치 근처에 배치하는 것이 유지보수에 유리

```typescript
// ❌ WRONG - 목적이 드러나지 않음
shared/types/

// ✅ CORRECT - 목적 기반 배치
shared/lib/date-utils/types.ts
```

---

## 2. 비즈니스 Entity와 상호 참조

### 백엔드 Response 타입

```typescript
// shared/api/songs.ts
interface Song {
  id: number;
  title: string;
  artists: Array<Artist>;
}
```

Request/Response 코드를 shared에 두면 entity 간 상호 참조를 한곳에서 관리 가능

### 상호 참조 해결 방법

**방법 1: 제네릭 타입 매개변수화** (단순한 구조에 적합)

```typescript
interface Song<ArtistType extends { id: string }> {
  id: number;
  title: string;
  artists: Array<ArtistType>;
}
```

**방법 2: Cross-Import (`@x` 패턴)** (명시적 의존 관계 표현)

```
entities/song/@x/artist.ts   ← artist 전용 public API
```

```typescript
import type { Song } from "entities/song/@x/artist";
```

---

## 3. DTO와 Mappers

### DTO 위치: Request 함수가 있는 곳 바로 옆

```typescript
// shared/api/songs.ts
interface SongDTO {
  id: number;
  title: string;
  disc_no: number;
  artist_ids: Array<ArtistDTO["id"]>;
}
```

### Mapper: DTO와 최대한 가까운 위치

```typescript
function adaptSongDTO(dto: SongDTO): Song {
  return {
    id: String(dto.id),
    title: dto.title,
    fullTitle: `${dto.disc_no} / ${dto.title}`,
    artistIds: dto.artist_ids.map(String),
  };
}
```

---

## 4. Global 타입과 Redux

### `RootState`, `AppDispatch` 문제

shared에서 app의 store 타입에 접근할 수 없음 (import 규칙 위반)

### 해결책: 제한된 암묵적 의존성 허용

```typescript
// app/store/index.ts
declare type RootState = ReturnType<typeof rootReducer>;
declare type AppDispatch = typeof store.dispatch;

// shared/store/index.ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
```

---

## 5. 열거형 (Enum)

- 가장 가까운 사용 위치에 정의
- 용도 기준으로 배치 (UI → `ui` segment, 백엔드 상태 → `api` segment)
- 전역 공통값은 shared에 배치

---

## 6. 타입 검증 Schema (Zod)

| 목적 | 위치 |
|------|------|
| 백엔드 Response 검증 | `api` segment |
| 폼 입력 값 검증 | `ui` 또는 `model` segment |

---

## 7. Component Props & Context 타입

- 기본: 해당 파일과 같은 파일에 정의
- 공유 필요 시: 같은 폴더에 별도 타입 파일 생성

```typescript
// ✅ 같은 파일에 정의
interface RecentActionsProps {
  actions: Array<{ id: string; text: string }>;
}
```

---

## 8. Ambient 선언 파일 (*.d.ts)

| 상황 | 위치 |
|------|------|
| 단순한 경우 | `src/` 직접 |
| 명확성 필요 | `app/ambient/` |
| 타입 없는 외부 패키지 | `shared/lib/untyped-packages/%LIB%.d.ts` |

```typescript
// shared/lib/untyped-packages/use-react-screenshot.d.ts
declare module "use-react-screenshot";
```

---

## 9. 타입 자동 생성

- 전용 디렉터리 생성: `shared/api/openapi/`
- README에 폴더 용도, 타입 재생성 스크립트 명령 기록

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **목적 중심 배치** | "타입이니까" 가 아닌 "왜 존재하는가"로 위치 결정 |
| **근접성 우선** | 최대한 사용 위치 근처에 배치 |
| **명시적 의존성** | cross-import 필요 시 `@x` 패턴으로 명확히 표현 |
| **공유의 신중함** | 재사용 가능하다고 무조건 shared에 두지 않기 |
