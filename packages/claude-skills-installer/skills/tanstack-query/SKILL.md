---
name: tanstack-query
description: TanStack Query(React Query) 베스트 프랙티스 가이드. useQuery, useSuspenseQuery, useMutation 훅 사용, 에러 핸들링(ErrorBoundary, QueryErrorResetBoundary), Query Key Factory 패턴, Cache Invalidation 전략, SSR Prefetch 패턴 작성 시 사용. TanStack Query 관련 코드 작성이나 데이터 페칭 로직 구현 시 참조.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: false
---

# TanStack Query Quick Reference

**Version:** 5.x (v5)
**Doc Source:** Official TanStack Query documentation

**Always read first:** [PRINCIPLES.md](PRINCIPLES.md), [PRACTICES.md](PRACTICES.md)

## 🎯 Skill 목적

TanStack Query(React Query) v5를 사용한 데이터 페칭 구현 시 베스트 프랙티스를 적용합니다. useQuery, useSuspenseQuery, useMutation 훅 선택, 에러 핸들링, Query Key Factory 패턴, Cache Invalidation 전략, SSR Prefetch 패턴 등 TanStack Query의 핵심 패턴을 올바르게 구현하도록 안내합니다.

## 🔑 활성화 조건

### 활성화 키워드

- "TanStack Query", "tanstack query", "React Query", "react query"
- "useQuery", "useMutation", "useSuspenseQuery"
- "데이터 페칭", "data fetching"
- "쿼리 키", "query key"
- "캐시 무효화", "cache invalidation"
- "프리페치", "prefetch"
- "옵티미스틱 업데이트", "optimistic update"

### 필수 조건

- TanStack Query를 사용하는 프로젝트에서 작업 중일 때
- 서버 데이터 페칭 로직 구현 시
- 캐시 전략이나 뮤테이션 처리가 필요할 때

---

## Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools react-error-boundary
```

---

## ⚠️ v5 Breaking Changes (from v4)

| v4 (deprecated)                                       | v5 (current)                       |
| ----------------------------------------------------- | ---------------------------------- |
| `cacheTime`                                           | `gcTime`                           |
| `useQuery`의 `onSuccess`, `onError`, `onSettled` 콜백 | 제거됨 → 컴포넌트/훅 레벨에서 처리 |
| `useMutation`의 `onSuccess`                           | deprecated → `onSettled` 사용      |
| `useFormState`                                        | `useActionState` (React 19)        |
| `getNextPageParam` 반환 `undefined`                   | `null` 반환으로 마지막 페이지 표시 |

---

## Hook Selection Guide

| 상황                          | 훅                                              |
| ----------------------------- | ----------------------------------------------- |
| 기본 데이터 조회              | `useQuery`                                      |
| 조건부 데이터 조회            | `useQuery` + `enabled`                          |
| 선언형 데이터 조회 (Suspense) | `useSuspenseQuery`                              |
| 동적 병렬 조회                | `useQueries` / `useSuspenseQueries`             |
| 무한 스크롤 / 페이지네이션    | `useInfiniteQuery` / `useSuspenseInfiniteQuery` |
| 생성 / 수정 / 삭제            | `useMutation`                                   |
| SSR 프리페치 (서버)           | `queryClient.prefetchQuery`                     |
| SSR 프리페치 (컴포넌트)       | `usePrefetchQuery`                              |

---

## Directory Structure

```
@queries/
├── [domain]/
│   ├── keys.ts          # Query Key Factory
│   ├── use[Domain]List.ts
│   ├── use[Domain]Detail.ts
│   ├── use[Domain]Create.ts
│   ├── use[Domain]Update.ts
│   └── use[Domain]Delete.ts
├── student/
│   ├── keys.ts
│   ├── useStudentList.ts
│   └── useStudentDetail.ts
└── bookmark/
    ├── keys.ts
    └── useBookmarkList.ts
```

- 하위 디렉토리는 **도메인 중심**으로 분류
- 각 도메인 폴더에 `keys.ts`로 Query Key Factory 배치
- 커스텀 훅은 **파일 1개 = 훅 1개** 원칙

---

## 📚 When to Read Additional Files

### Guides & Concepts

#### Core

**Understanding defaults?** → [references/guides-and-concepts/01-important-defaults.md](references/guides-and-concepts/01-important-defaults.md)

- `staleTime`, `gcTime`, `retry` 기본값
- 자동 리페칭 동작

**Writing queries?** → [references/guides-and-concepts/02-queries.md](references/guides-and-concepts/02-queries.md)

- 쿼리 기본 개념, 상태(loading, error, success)

**Defining query keys?** → [references/guides-and-concepts/03-query-keys.md](references/guides-and-concepts/03-query-keys.md)

- 배열 기반 키 구조, 의존성 키

**Writing query functions?** → [references/guides-and-concepts/04-query-functions.md](references/guides-and-concepts/04-query-functions.md)

- `queryFn` 작성, AbortSignal, 에러 처리

**Using query options?** → [references/guides-and-concepts/05-query-options.md](references/guides-and-concepts/05-query-options.md)

- `queryOptions` 헬퍼로 타입 안전한 옵션 재사용

#### Advanced Query Patterns

**Network mode?** → [references/guides-and-concepts/06-network-mode.md](references/guides-and-concepts/06-network-mode.md)

- `online`, `always`, `offlineFirst` 모드

**Parallel queries?** → [references/guides-and-concepts/07-parallel-queries.md](references/guides-and-concepts/07-parallel-queries.md)

- `useQueries`로 동적 병렬 실행

**Dependent queries?** → [references/guides-and-concepts/08-dependent-queries.md](references/guides-and-concepts/08-dependent-queries.md)

- `enabled` 옵션으로 순차 실행

**Background fetching indicators?** → [references/guides-and-concepts/09-background-fetching-indicators.md](references/guides-and-concepts/09-background-fetching-indicators.md)

- `isFetching`, `isRefetching` 상태 표시

**Window focus refetching?** → [references/guides-and-concepts/10-window-focus-refetching.md](references/guides-and-concepts/10-window-focus-refetching.md)

- `refetchOnWindowFocus` 설정

**Disabling queries?** → [references/guides-and-concepts/11-disabling-queries.md](references/guides-and-concepts/11-disabling-queries.md)

- `enabled: false`, lazy query 패턴

**Query retries?** → [references/guides-and-concepts/12-query-retries.md](references/guides-and-concepts/12-query-retries.md)

- `retry`, `retryDelay` 커스텀 전략

**Paginated queries?** → [references/guides-and-concepts/13-paginated-queries.md](references/guides-and-concepts/13-paginated-queries.md)

- `placeholderData: keepPreviousData` 패턴

**Infinite queries?** → [references/guides-and-concepts/14-infinite-queries.md](references/guides-and-concepts/14-infinite-queries.md)

- `useInfiniteQuery`, `getNextPageParam`

**Initial query data?** → [references/guides-and-concepts/15-initial-query-data.md](references/guides-and-concepts/15-initial-query-data.md)

- `initialData`로 초기 데이터 설정

**Placeholder data?** → [references/guides-and-concepts/16-placeholder-query-data.md](references/guides-and-concepts/16-placeholder-query-data.md)

- `placeholderData`로 임시 데이터 표시

#### Mutations & Cache

**Writing mutations?** → [references/guides-and-concepts/17-mutations.md](references/guides-and-concepts/17-mutations.md)

- `useMutation`, `onSettled`, 상태 관리

**Query invalidation?** → [references/guides-and-concepts/18-query-invalidation.md](references/guides-and-concepts/18-query-invalidation.md)

- `invalidateQueries` 전략

**Invalidation from mutations?** → [references/guides-and-concepts/19-invalidations-from-mutations.md](references/guides-and-concepts/19-invalidations-from-mutations.md)

- mutation 후 자동 무효화 패턴

**Updating from mutation responses?** → [references/guides-and-concepts/20-updates-from-mutation-responses.md](references/guides-and-concepts/20-updates-from-mutation-responses.md)

- `setQueryData`로 캐시 직접 업데이트

**Optimistic updates?** → [references/guides-and-concepts/21-optimistic-updates.md](references/guides-and-concepts/21-optimistic-updates.md)

- 낙관적 업데이트, 롤백 패턴

**Query cancellation?** → [references/guides-and-concepts/22-query-cancellation.md](references/guides-and-concepts/22-query-cancellation.md)

- `AbortController`, 쿼리 취소

#### Advanced Features

**Scroll restoration?** → [references/guides-and-concepts/23-scroll-restoration.md](references/guides-and-concepts/23-scroll-restoration.md)

- 스크롤 위치 복원

**Filters?** → [references/guides-and-concepts/24-filters.md](references/guides-and-concepts/24-filters.md)

- `QueryFilters`, `MutationFilters`

**Performance & waterfalls?** → [references/guides-and-concepts/25-performance-request-waterfalls.md](references/guides-and-concepts/25-performance-request-waterfalls.md)

- 요청 워터폴 방지, prefetching

**Prefetching & router integration?** → [references/guides-and-concepts/26-prefetching-router-integration.md](references/guides-and-concepts/26-prefetching-router-integration.md)

- 라우터 전환 시 prefetch

**Server rendering & hydration?** → [references/guides-and-concepts/27-server-rendering-hydration.md](references/guides-and-concepts/27-server-rendering-hydration.md)

- SSR, `HydrationBoundary`, `dehydrate`

**Advanced server rendering?** → [references/guides-and-concepts/28-advanced-server-rendering.md](references/guides-and-concepts/28-advanced-server-rendering.md)

- 스트리밍, React Server Components 통합

**Caching examples?** → [references/guides-and-concepts/29-caching-examples.md](references/guides-and-concepts/29-caching-examples.md)

- 캐싱 라이프사이클 시각화

**Render optimizations?** → [references/guides-and-concepts/30-render-optimizations.md](references/guides-and-concepts/30-render-optimizations.md)

- `notifyOnChangeProps`, 구조적 공유

**Default query function?** → [references/guides-and-concepts/31-default-query-function.md](references/guides-and-concepts/31-default-query-function.md)

- 전역 기본 `queryFn` 설정

**Suspense?** → [references/guides-and-concepts/32-suspense.md](references/guides-and-concepts/32-suspense.md)

- `useSuspenseQuery`, Suspense 경계

**Testing?** → [references/guides-and-concepts/33-testing.md](references/guides-and-concepts/33-testing.md)

- 테스트 환경 설정, `renderHook`

**Replacing other libraries?** → [references/guides-and-concepts/34-possibility-replace.md](references/guides-and-concepts/34-possibility-replace.md)

- Redux, SWR 등 대체 가능성

---

### API Reference

#### QueryClient & Cache

**QueryClient methods?** → [references/api-reference/01-query-client.md](references/api-reference/01-query-client.md)

- `fetchQuery`, `prefetchQuery`, `invalidateQueries` 등 31개 메서드

**QueryCache?** → [references/api-reference/02-query-cache.md](references/api-reference/02-query-cache.md)

- 캐시 이벤트, `onError`, `onSuccess`

**MutationCache?** → [references/api-reference/03-mutation-cache.md](references/api-reference/03-mutation-cache.md)

- mutation 캐시, 전역 콜백

#### Observers

**QueryObserver?** → [references/api-reference/04-query-observer.md](references/api-reference/04-query-observer.md)

- 쿼리 상태 구독

**InfiniteQueryObserver?** → [references/api-reference/05-infinite-query-observer.md](references/api-reference/05-infinite-query-observer.md)

- 무한 쿼리 옵저버

**QueriesObserver?** → [references/api-reference/06-queries-observer.md](references/api-reference/06-queries-observer.md)

- 다중 쿼리 옵저버

#### Managers

**StreamedQuery?** → [references/api-reference/07-streamed-query.md](references/api-reference/07-streamed-query.md)

- 스트리밍 쿼리 지원

**FocusManager?** → [references/api-reference/08-focus-manager.md](references/api-reference/08-focus-manager.md)

- 윈도우 포커스 감지 커스텀

**OnlineManager?** → [references/api-reference/09-online-manager.md](references/api-reference/09-online-manager.md)

- 네트워크 상태 감지 커스텀

**NotifyManager?** → [references/api-reference/10-notify-manager.md](references/api-reference/10-notify-manager.md)

- 알림 배치 처리

**TimeoutManager?** → [references/api-reference/11-timeout-manager.md](references/api-reference/11-timeout-manager.md)

- 타임아웃 관리

#### Hooks - Query

**useQuery?** → [references/api-reference/12-use-query.md](references/api-reference/12-use-query.md)

- 기본 데이터 페칭 훅

**useQueries?** → [references/api-reference/13-use-queries.md](references/api-reference/13-use-queries.md)

- 동적 병렬 쿼리

**useInfiniteQuery?** → [references/api-reference/14-use-infinite-query.md](references/api-reference/14-use-infinite-query.md)

- 무한 스크롤, 페이지네이션

#### Hooks - Mutation

**useMutation?** → [references/api-reference/15-use-mutation.md](references/api-reference/15-use-mutation.md)

- CUD 작업, `onSettled`, `onError`

**useIsFetching?** → [references/api-reference/16-use-is-fetching.md](references/api-reference/16-use-is-fetching.md)

- 글로벌 페칭 상태

**useIsMutating?** → [references/api-reference/17-use-is-mutating.md](references/api-reference/17-use-is-mutating.md)

- 글로벌 뮤테이션 상태

**useMutationState?** → [references/api-reference/18-use-mutation-state.md](references/api-reference/18-use-mutation-state.md)

- 뮤테이션 상태 필터링

#### Hooks - Suspense

**useSuspenseQuery?** → [references/api-reference/19-use-suspense-query.md](references/api-reference/19-use-suspense-query.md)

- Suspense 기반 데이터 페칭

**useSuspenseInfiniteQuery?** → [references/api-reference/20-use-suspense-infinite-query.md](references/api-reference/20-use-suspense-infinite-query.md)

- Suspense + 무한 쿼리

**useSuspenseQueries?** → [references/api-reference/21-use-suspense-queries.md](references/api-reference/21-use-suspense-queries.md)

- Suspense + 병렬 쿼리

#### Provider & Utilities

**QueryClientProvider?** → [references/api-reference/22-query-client-provider.md](references/api-reference/22-query-client-provider.md)

- 컨텍스트 프로바이더 설정

**useQueryClient?** → [references/api-reference/23-use-query-client.md](references/api-reference/23-use-query-client.md)

- 컴포넌트에서 `queryClient` 접근

**queryOptions?** → [references/api-reference/24-query-options.md](references/api-reference/24-query-options.md)

- 타입 안전한 옵션 팩토리

**infiniteQueryOptions?** → [references/api-reference/25-infinite-query-options.md](references/api-reference/25-infinite-query-options.md)

- 무한 쿼리 옵션 팩토리

**mutationOptions?** → [references/api-reference/26-mutation-options.md](references/api-reference/26-mutation-options.md)

- 뮤테이션 옵션 팩토리

**usePrefetchQuery?** → [references/api-reference/27-use-prefetch-query.md](references/api-reference/27-use-prefetch-query.md)

- 렌더 시점 프리페치

**usePrefetchInfiniteQuery?** → [references/api-reference/28-use-prefetch-infinite-query.md](references/api-reference/28-use-prefetch-infinite-query.md)

- 무한 쿼리 프리페치

**QueryErrorResetBoundary?** → [references/api-reference/29-query-error-reset-boundary.md](references/api-reference/29-query-error-reset-boundary.md)

- 에러 리셋 경계 컴포넌트

**useQueryErrorResetBoundary?** → [references/api-reference/30-use-query-error-reset-boundary.md](references/api-reference/30-use-query-error-reset-boundary.md)

- 에러 리셋 훅

**Hydration?** → [references/api-reference/31-hydration.md](references/api-reference/31-hydration.md)

- `dehydrate`, `HydrationBoundary`, SSR 통합
