# Feature-Sliced Design (FSD) Rules

프론트엔드 프로젝트 디렉토리 구조는 FSD 아키텍처 방법론을 따른다.

## Layer 구조 (의존성 순서)

```
src/
├── app/        ← 전역 설정, Provider, 라우팅 (Slice 없음)
├── pages/      ← 라우트별 화면 (1페이지 = 1 Slice)
├── widgets/    ← 독립적 재사용 UI 블록
├── features/   ← 사용자 기능 단위
├── entities/   ← 비즈니스 Entity (선택)
└── shared/     ← 공통 UI, API, lib (Slice 없음)
```

## 필수 규칙

| 규칙 | 설명 |
|------|------|
| **단방향 의존성** | 상위 Layer → 하위 Layer import만 가능. 역방향 금지 |
| **슬라이스 격리** | 같은 Layer 내 슬라이스 간 상호 참조 금지 |
| **Public API** | 슬라이스는 `index.ts` re-export를 통해서만 외부에 노출 |
| **도메인 네이밍** | `components/`, `hooks/`, `types/` 금지. 목적 기반 이름 사용 |
| **Named Export** | `export *` 금지. 필요한 것만 명시적 export |

## Segment 종류

| Segment | 역할 |
|---------|------|
| `ui` | UI 컴포넌트, 포매터, 스타일 |
| `api` | 요청 함수, DTO, 맵퍼 |
| `model` | 스토어, 비즈니스 로직, 검증 스키마 |
| `lib` | 슬라이스 내 유틸리티 |
| `config` | 설정, Feature Flag |

## 주요 패턴

- **API 요청**: 공용 → `shared/api`, 전용 → slice의 `api/`
- **Token 관리**: `shared/auth` 또는 `entities/user/model`
- **타입 배치**: 사용 위치 근처, `shared/types/` 금지
- **Cross-Import**: Entity Layer에서만 `@x` 패턴 허용
- **레이아웃**: `shared/ui` 또는 `app/layouts`에 배치

> 상세 가이드: `.claude/skills/fsd/` 스킬 참조
