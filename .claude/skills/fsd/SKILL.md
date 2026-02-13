---
name: fsd
description: Feature-Sliced Design(FSD) 아키텍처 방법론 가이드. 프론트엔드 프로젝트의 디렉토리 구조, 레이어/슬라이스/세그먼트 설계, 의존성 규칙, Public API 패턴 참조.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# Feature-Sliced Design Quick Reference

**Doc Source:** https://feature-sliced.design/kr/docs

## 🎯 Skill 목적

FSD 아키텍처 방법론에 따라 프론트엔드 프로젝트의 디렉토리 구조를 설계하고, 레이어 간 의존성 규칙을 준수하며, 코드를 비즈니스 도메인 기반으로 조직하는 가이드를 제공한다.

## 🔑 활성화 조건

### 활성화 키워드

- "FSD", "Feature-Sliced Design", "feature sliced"
- "레이어 구조", "슬라이스", "세그먼트"
- "shared layer", "entities layer", "features layer"
- "Public API", "index.ts re-export"
- "디렉토리 구조", "프로젝트 구조", "폴더 구조"

### 필수 조건

- 프론트엔드 애플리케이션 프로젝트 (React, Next.js, Vue 등)
- 디렉토리 구조 설계 또는 리팩토링 작업

## 🚨 CRITICAL RULES (Always Enforce)

| 규칙 | 설명 |
|------|------|
| **단방향 의존성** | 상위 Layer만 하위 Layer를 import 가능. 역방향 금지 |
| **슬라이스 격리** | 같은 Layer 내 다른 슬라이스 간 상호 참조 금지 (예외: `@x` 패턴) |
| **Public API 필수** | 모든 슬라이스는 `index.ts`를 통해서만 외부에 노출 |
| **도메인 기반 네이밍** | `components/`, `hooks/`, `types/` 같은 기술적 이름 금지 |
| **명시적 Named Export** | `export *` 대신 필요한 것만 명시적으로 export |
| **Entities 신중하게** | entities는 필수가 아님. 재사용 필요가 명확할 때만 추출 |

## 📐 Layer 구조 (의존성 순서)

```
src/
├── app/        ← 전역 설정, 라우팅, Provider (Slice 없음)
├── pages/      ← 라우트별 화면 단위
├── widgets/    ← 독립적 UI 블록 (재사용)
├── features/   ← 사용자 기능 단위
├── entities/   ← 비즈니스 Entity (선택)
└── shared/     ← 공통 도구, UI, API (Slice 없음)
```

## 📋 워크플로우

### Step 1: 구조 분석

- 현재 프로젝트의 디렉토리 구조를 파악한다
- FSD Layer 구조와의 매핑 관계를 확인한다

### Step 2: 레퍼런스 참조 및 적용

- 해당 상황에 맞는 레퍼런스 문서를 읽고 패턴을 적용한다
- 의존성 규칙과 Public API 규칙을 검증한다

## 📚 When to Read Additional Files

### Core Concepts

**FSD 처음이거나 전체 구조를 파악하고 싶다면?** → [references/01-overview.md](references/01-overview.md)

- Layer → Slice → Segment 3단계 계층
- 의존성 규칙, 핵심 장점, 점진적 도입

**각 Layer의 역할과 세부 규칙이 궁금하다면?** → [references/08-layers.md](references/08-layers.md)

- Shared, Entities, Features, Widgets, Pages, App 상세 설명
- Import 규칙, Segment 구성

**슬라이스와 세그먼트 설계 방법이 필요하다면?** → [references/09-slices-segments.md](references/09-slices-segments.md)

- 슬라이스 네이밍, 그룹화
- 표준/커스텀 세그먼트

**Public API (index.ts) 작성 규칙이 궁금하다면?** → [references/10-public-api.md](references/10-public-api.md)

- re-export 패턴, `@x` cross-import
- 순환 참조 방지, tree-shaking 최적화

### Practical Guides

**인증(로그인/회원가입) 구현 시?** → [references/02-authentication.md](references/02-authentication.md)

- 인증 플로우, token 관리, 로그아웃 패턴

**타입 배치 전략이 필요하다면?** → [references/03-types.md](references/03-types.md)

- DTO/Mapper, cross-import, Zod 스키마 위치

**페이지 레이아웃 구성 시?** → [references/04-page-layouts.md](references/04-page-layouts.md)

- Render Props/Slots 패턴, App Layer 이동

**API 요청 구조 설계 시?** → [references/05-handling-api-requests.md](references/05-handling-api-requests.md)

- shared/api 구성, 슬라이스별 API, client.ts 패턴

### Common Issues

**기술적 폴더 구조 안티패턴을 피하려면?** → [references/06-desegmentation.md](references/06-desegmentation.md)

- 탈세그먼트화 문제, 도메인별 응집 방법

**Entities Layer가 비대해지는 문제가 있다면?** → [references/07-excessive-entities.md](references/07-excessive-entities.md)

- entities 없이 시작, 점진적 추출, CRUD 배치
