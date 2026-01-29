# Agents

코드 리뷰 및 품질 검증을 위한 전문 에이전트 모음입니다.

## 📚 에이전트 목록

| 에이전트                                      | 설명                                  | 모델   |
| --------------------------------------------- | ------------------------------------- | ------ |
| [security-reviewer](#security-reviewer)       | 보안 취약점 탐지 및 수정 전문가       | Sonnet |
| [performance-reviewer](#performance-reviewer) | Next.js/React 렌더링 성능 리뷰 전문가 | Sonnet |

## 🔒 security-reviewer

보안 취약점을 탐지하고 수정안을 제시하는 **보안 리뷰 전문 에이전트**입니다. 사용자 입력, 인증, API 엔드포인트, 민감 데이터를 다루는 코드 작성 후 **자동으로(proactively)** 실행됩니다.

### 사용 도구

`Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`

### 핵심 점검 영역

- **OWASP Top 10 분석**: Injection, XSS, SSRF, 인증/인가 결함 등
- **시크릿 탐지**: 하드코딩된 API 키, 비밀번호, 토큰
- **입력 유효성 검증**: 사용자 입력 새니타이즈 여부
- **의존성 보안**: 취약한 npm 패키지 점검
- **금융 보안**: Race Condition, 원자적 트랜잭션, Rate Limiting

### 리뷰 워크플로우

1. **Initial Scan** — 자동화 도구 실행 (npm audit, eslint-plugin-security, grep)
2. **OWASP Top 10 분석** — 10가지 카테고리별 취약점 점검
3. **프로젝트 특화 검사** — 금융/블록체인/인증/DB/API 보안 체크리스트

### 실행 시점

- 새 API 엔드포인트 추가 시
- 인증/인가 코드 변경 시
- 사용자 입력 처리 추가 시
- DB 쿼리 수정 시
- 결제/금융 코드 변경 시
- 의존성 업데이트 시
- 프로덕션 인시던트 발생 시

## 🏍️ performance-reviewer

Next.js/React 애플리케이션의 **렌더링 성능을 리뷰하는 전문 에이전트**입니다. Core Web Vitals(LCP, CLS, FCP, INP) 관점에서 성능 문제를 탐지하고 개선안을 제시합니다.

### 사용 도구

`Read`, `Grep`, `Glob`, `Bash`

### 핵심 점검 영역

- **LCP**: above-the-fold 이미지 priority, 서버 컴포넌트 렌더링
- **CLS**: Image dimensions, next/font, skeleton/placeholder
- **FCP**: 초기 번들 크기, 폰트 로딩 차단
- **INP**: 이벤트 핸들러 debounce/throttle, Web Worker 분리
- **Memoization**: useMemo, useCallback, React.memo 적정성
- **캐시 전략**: Next.js 16+ 캐시 설정 및 무효화 전략

### 리뷰 워크플로우

1. **Phase 1: 정적 코드 분석** — Image, Font, Dynamic import, Memoization 패턴 검사
2. **Phase 2: 구조 분석** — 서버/클라이언트 컴포넌트 분리, 로딩/에러 상태 처리
3. **Phase 3: 캐시 전략 분석** — fetch 캐시 옵션, 무효화 전략 점검

### 실행 시점

- 새 페이지/컴포넌트 작성 후
- 이미지 관련 코드 변경 시
- 데이터 fetching 로직 변경 시
- 외부 라이브러리 추가 시
- `'use client'` 지시문 추가 시
- PR 리뷰 시
- Lighthouse 점수 저하 보고 시
