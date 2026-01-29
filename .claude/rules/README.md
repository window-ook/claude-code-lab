# Rules

프로젝트 전반에 적용되는 코딩 규칙 및 가이드라인 모음입니다.

## 📚 규칙 목록

| 규칙                              | 설명                                        |
| --------------------------------- | ------------------------------------------- |
| [code-style](#code-style)        | 코드 스타일 및 컨벤션 규칙                  |
| [security](#security)            | 보안 체크리스트 및 가이드라인               |
| [performance](#performance)      | 렌더링 성능 최적화 가이드라인               |

## 📏 code-style

프로젝트 전반의 **코드 스타일 및 컨벤션**을 정의합니다.

### 주요 규칙

- **Single Line if & function**: 단일 실행문일 경우 `{}` 생략
- **Server Action**: Early Return 패턴, try-catch 금지, 에러는 throw
- **Declarative Programming**: Suspense/ErrorBoundary 기반 선언형 처리
- **Interface 선언**: `I-` 접두사 필수, `-Props` 접미사 금지, export 필수
- **Tailwind CSS 순서**: 포지션 → 레이아웃 → 공백 → 외곽 → 배경 → Flex/Grid → 폰트 → 애니메이션 → 트랜지션
- **Path Factory**: API/이미지 경로를 `as const`로 중앙 관리
- **Query Key Factory**: React Query 키를 도메인별 `as const`로 중앙 관리

## 🔒 security

커밋 전 필수 **보안 체크리스트**와 시크릿 관리 가이드라인입니다.

### 필수 체크 항목

- 하드코딩된 시크릿 없음 (API 키, 비밀번호, 토큰)
- 모든 사용자 입력 유효성 검증
- SQL Injection 방지 (파라미터화된 쿼리)
- XSS 방지 (HTML 새니타이즈)
- CSRF 보호 활성화
- 인증/인가 검증
- Rate Limiting 적용
- 에러 메시지에 민감 정보 미노출

### 보안 이슈 발견 시 프로토콜

1. 즉시 작업 중단
2. **security-reviewer** 에이전트 실행
3. CRITICAL 이슈 우선 수정
4. 노출된 시크릿 즉시 교체
5. 유사 이슈 전체 코드베이스 점검

## 🏍️ performance

Next.js/React 프로젝트의 **렌더링 성능 최적화** 가이드라인입니다.

### 핵심 성능 지표

| 지표 | Good    | Needs Improvement | Poor     |
| ---- | ------- | ----------------- | -------- |
| TTFB | < 800ms | 800ms-1800ms      | > 1800ms |
| FCP  | < 1.8s  | 1.8s-3.0s         | > 3.0s   |
| LCP  | < 2.5s  | 2.5s-4.0s         | > 4.0s   |
| CLS  | < 0.1   | 0.1-0.25          | > 0.25   |
| INP  | < 200ms | 200ms-500ms       | > 500ms  |

### 주요 최적화 영역

- **Memoization**: `useMemo`, `useCallback`, `React.memo` 적용 기준 및 금지 패턴
- **Image 최적화**: `next/image` 필수, `priority`/`fill`/`sizes` 속성 활용
- **Font 최적화**: `next/font/local` + `display: 'swap'` + `preload: true`
- **Code Splitting**: `dynamic import`로 초기 번들 최소화
- **Cache 전략**: Next.js 16+ 기본 동작 변경 반영, 무효화 전략 필수 명시
- **Debounce/Throttle**: 상황별 기법 및 기준값 테이블 제공
