# FSD Handling API Requests

**Source**: https://feature-sliced.design/kr/docs/guides/examples/api-requests

---

## Contents

- [1. 개요](#1-개요)
- [2. 공유 API 요청 (shared/api)](#2-공유-api-요청-sharedapi)
- [3. 슬라이스별 API 요청](#3-슬라이스별-api-요청)
- [4. Entities와 API의 관계](#4-entities와-api의-관계)
- [5. API 타입 자동 생성](#5-api-타입-자동-생성)
- [6. 서버 상태 라이브러리 연동](#6-서버-상태-라이브러리-연동)
- [Key Principles](#key-principles)

---

## 1. 개요

FSD에서는 API 요청을 두 가지 범주로 관리한다:

| 범주 | 위치 | 용도 |
|------|------|------|
| **공유 요청** | `shared/api` | 애플리케이션 전체에서 재사용 |
| **슬라이스별 요청** | `슬라이스/api` | 특정 slice 내부에서만 사용 |

---

## 2. 공유 API 요청 (shared/api)

### 폴더 구조

```
📂 shared
  📂 api
    📄 client.ts
    📄 index.ts
    📂 endpoints
      📄 login.ts
```

### client.ts — 중앙 HTTP 설정

```typescript
// shared/api/client.ts (Fetch 기반)
export const client = {
  async post(endpoint: string, body: any, options?: RequestInit) {
    const response = await fetch(`https://your-api-domain.com/api${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return response.json();
  }
};
```

### Endpoint 정의

```typescript
// shared/api/endpoints/login.ts
import { client } from '../client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export function login(credentials: LoginCredentials) {
  return client.post('/login', credentials);
}
```

### 공개 API 내보내기

```typescript
// shared/api/index.ts
export { client } from './client';
export { login } from './endpoints/login';
export type { LoginCredentials } from './endpoints/login';
```

---

## 3. 슬라이스별 API 요청

특정 페이지/feature에서만 사용하는 요청은 해당 슬라이스의 `api` segment에 배치한다.

```
📂 pages
  📂 login
    📂 api
      📄 login.ts
    📂 ui
      📄 LoginPage.tsx
    📄 index.ts
```

```typescript
// pages/login/api/login.ts
import { client } from 'shared/api';

export function login(credentials: { email: string; password: string }) {
  return client.post('/login', credentials);
}
```

> **참고:** 내부에서만 사용하므로 슬라이스의 public API로 re-export 불필요

---

## 4. Entities와 API의 관계

```
// ❌ WRONG - entities에 백엔드 응답 타입/API 함수를 직접 배치
📂 entities/user/api/fetchUser.ts

// ✅ CORRECT - shared/api에 배치하고 entity는 프론트엔드 관점의 로직만
📂 shared/api/endpoints/user.ts     ← 백엔드 데이터 처리
📂 entities/user/model/user.ts      ← 프론트엔드 도메인 로직
```

---

## 5. API 타입 자동 생성

OpenAPI 스펙이 있다면 자동 생성 도구 활용:

- **orval**, **openapi-typescript**
- 생성된 코드는 `shared/api/openapi/`에 저장
- README.md에 생성 스크립트, 사용 예시 문서화

---

## 6. 서버 상태 라이브러리 연동

TanStack Query, Pinia Colada 등 사용 시 `shared` 레이어에 공유해야 할 항목:

- API 데이터 타입
- 캐시 키
- 공통 query/mutation 옵션

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **중앙 집중식 client** | `shared/api/client.ts`에서 HTTP 설정 통합 관리 |
| **endpoint별 분리** | 각 endpoint를 개별 파일로 분리하여 유지보수성 확보 |
| **재사용성 기준 배치** | 전역 재사용 → `shared/api`, 전용 → slice의 `api/` |
| **Entities에 API 금지** | entities는 프론트엔드 도메인 로직만 담당 |
