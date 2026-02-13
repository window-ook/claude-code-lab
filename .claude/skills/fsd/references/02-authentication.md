# FSD Authentication

**Source**: https://feature-sliced.design/kr/docs/guides/examples/auth

---

## Contents

- [1. 인증 플로우 개요](#1-인증-플로우-개요)
- [2. Credential 입력 수집](#2-credential-입력-수집)
- [3. Credentials 전송](#3-credentials-전송)
- [4. Token 저장](#4-token-저장)
- [5. 로그아웃 및 Token 무효화](#5-로그아웃-및-token-무효화)
- [Key Principles](#key-principles)

---

## 1. 인증 플로우 개요

웹 애플리케이션의 인증은 3단계로 진행된다:

1. **Credential 입력 수집** — 사용자가 아이디, 비밀번호 또는 OAuth redirect URL 입력
2. **백엔드 Endpoint 호출** — `/login`, `/oauth/callback`, `/2fa` 등으로 request 전송
3. **Token 저장** — 응답받은 token을 cookie 또는 store에 저장하여 이후 request에 자동 포함

---

## 2. Credential 입력 수집

### 2-1. 로그인 전용 페이지

```
📂 pages
  📂 login
    📂 ui
      📄 LoginPage.tsx
      📄 RegisterPage.tsx
    📄 index.ts
```

- Form element와 submit handler만 포함
- 복잡한 비즈니스 로직은 다른 segment으로 분리

### 2-2. 로그인 Dialog (Widget)

```
📂 widgets
  📂 login-dialog
    📂 ui
      📄 LoginDialog.tsx
    📄 index.ts
```

- 페이지마다 로그인 로직을 따로 만들 필요 없음
- 재사용 가능한 widget으로 구현

### 2-3. Client-side Validation

```
📂 pages/login
  📂 model
    📄 registration-schema.ts
  📂 ui
    📄 RegisterPage.tsx
```

```typescript
// pages/login/model/registration-schema.ts
import { z } from "zod";

export const registrationData = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});
```

---

## 3. Credentials 전송

### 배치 전략

| 목적 | 권장 위치 | 이유 |
|------|-----------|------|
| 전역 재사용 | `shared/api` | 모든 slice에서 import 가능 |
| 로그인 전용 | `pages/login/api` | slice 내부 캡슐화 유지 |

### shared/api에 저장

```
📂 shared
  📂 api
    📂 endpoints
      📄 login.ts
    📄 client.ts
    📄 index.ts
```

```typescript
// shared/api/endpoints/login.ts
import { POST } from "../client";

export function login({ email, password }: { email: string; password: string }) {
  return POST("/login", { email, password });
}
```

### Page의 api Segment에 저장

```typescript
// pages/login/api/login.ts
import { POST } from "shared/api";

export function login({ email, password }: { email: string; password: string }) {
  return POST("/login", { email, password });
}
```

> **참고:** 로그인 페이지 내부에서만 사용하므로 index.ts에서 다시 export할 필요 없음

### Two-Factor Auth (2FA)

- `/login` 응답에 `has2FA` 플래그가 있으면 `/login/2fa` 페이지로 redirect
- 2FA 관련 API는 모두 `pages/login` slice에 함께 배치

---

## 4. Token 저장

### 4-1. Shared Layer에 저장 (권장)

```
📂 shared
  📂 api
    📄 client.ts
  📂 auth
    📄 token-manager.ts
```

- request 함수는 `shared/api`에, token 관리는 `shared/auth`로 분리
- Token 자동 재발급(Refresh) 플로우 포함

### 4-2. Entities Layer에 저장

```
📂 entities
  📂 user
    📂 model
      📄 user-store.ts
    📄 index.ts
```

Layer import 규칙 준수를 위한 3가지 방법:

| 방법 | 설명 | 장단점 |
|------|------|--------|
| **Token 직접 전달** | 각 request마다 token 파라미터 추가 | 단순하지만 코드 반복 |
| **Context/localStorage** | 앱 전역에 token 노출 (pull 방식) | 설계 자유도 높음 |
| **Store subscription** | token 변경 시 클라이언트 자동 업데이트 (push 방식) | 자동화된 관리 |

### 4-3. Pages/Widgets — 권장하지 않음

> **⚠️** token을 page/widget layer에 두면 전역에서 의존하게 되어 다른 slice에서 재사용 어려움

---

## 5. 로그아웃 및 Token 무효화

### 로그아웃 처리 (2단계)

1. 백엔드에 인증된 로그아웃 request 전송 (`POST /logout`)
2. Token store reset (access token + refresh token 모두 제거)

### 자동 로그아웃 필수 시나리오

- 로그아웃 request 실패 시
- Token 갱신 (`/refresh`) 실패 시

> **⚠️** Token이 남아있으면, 화면상으로는 로그인된 것처럼 보이지만 실제로는 대부분의 요청이 실패하는 애매한 상태가 됨

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Validation은 model segment** | Zod 스키마 등 검증 로직은 `model/`에 배치 |
| **Token은 Shared 또는 Entities** | Pages/Widgets에 token 저장 금지 |
| **API 함수 배치는 재사용성 기준** | 전역 → `shared/api`, 전용 → slice의 `api/` |
| **자동 로그아웃 필수** | refresh 실패 시 token 즉시 초기화 |
