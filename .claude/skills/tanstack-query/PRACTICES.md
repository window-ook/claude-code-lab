# TanStack Query Best Practices

## 전역 queryClient

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      (mod) => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error?.name === 'NetworkError') return failureCount < 3;
              return false;
            },
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: 'always',
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </main>
  );
}
```

## 조건부 실행

```tsx
const queryData = useQuery({
  enabled: !!session, // 세션 있을 때만 queryFn 실행
  queryKey: bookmarkCafeQuery.all(session?.user?.id ?? ''),
  // ...
});
```

## 선언형 프로그래밍에서 사용하는 API

#### #1 useSuspenseQuery 커스텀 훅

- useSuspenseQuery는 언제나 성공인 데이터를 반환합니다.
  - 로딩 상태는 `React.Suspense`가 처리합니다.
  - 에러 상태는 `ErrorBoundary`가 처리합니다.

- 주의: `React.Suspense`는 서버 사이드 렌더링 환경에서 지원하지 않습니다.
  - Next.js App Router의 page.tsx에서 useSuspenseQuery를 사용하는 컴포넌트는 **Prefetch 컴포넌트**를 만들어서 감싸줘야합니다.
  - `queryClient.prefetchQuery` 를 사용하여 쿼리키에 데이터를 미리 페치합니다.
  - `queryClient`를 `dehydrate`하여 `Hydration Boundary` 에 상태로 담습니다.

```tsx
'use client';

export function useThisDomain(itemId: string, domainId: string) {
  return useSuspenseQuery({
    queryKey: domainKey.detail(itemId, domainId),
    queryFn: () => fetchThisDomain(itemId, domainId),
  });
}
```

#### #2 prefetchQuery 함수

서버 사이드에서 데이터를 미리 페칭하는 함수입니다.

```tsx
export async function prefetchDomain(
  queryClient: QueryClient,
  parentId: string,
  params?: IDomainListParams,
) {
  await queryClient.prefetchQuery({
    queryKey: domainQueryKeys.list(parentId, params),
    queryFn: () => fetchDomainServer(parentId, params),
    staleTime: 1000 * 60 * 5,
  });
}
```

#### #3 페이지 HydrationBoundary

`dehydrate`로 QueryClient 상태를 직렬화하고, `HydrationBoundary`로 클라이언트에 주입합니다.

```tsx
export default async function DomainPage({ params }: IDomainPage) {
  const { parentId } = await params;

  const queryClient = new QueryClient();
  await prefetchDomain(queryClient, parentId, { page: 1, limit: 20 });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DomainPageContent parentId={parentId} />
    </HydrationBoundary>
  );
}
```

#### #4 클라이언트 컴포넌트에서 훅 사용

HydrationBoundary 덕분에 초기 데이터가 즉시 사용 가능합니다.

```tsx
'use client';

export default function DomainPageContent({ parentId }: IDomainPageContent) {
  const [params, setParams] = useState<IDomainListParams>(DEFAULT_PARAMS);

  const { data } = useDomains(parentId, params);

  const items = useMemo(() => data?.data || [], [data]);

  return <DomainList items={items} params={params} />;
}
```

### QueryErrorResetBoundary

**ErrorBoundary**와 **TanStack Query**를 연결해서 함께 리셋합니다.

- React Error Boundary와 함께 사용할 때
- 에러 리셋 범위를 명확히 정의하고 싶을 때
- 컴포넌트 트리 구조로 에러 처리를 표현하고 싶을 때

```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function MyApp() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              <p>카페 목록을 불러오는데 실패했습니다</p>
              <button onClick={resetErrorBoundary}>다시 불러오기</button>
            </div>
          )}
        >
          <CafeList />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

## Query Key Factory

```tsx
import { IStudentListParams } from '@/domains/student/types';

export const studentQueryKeys = {
  all: ['student'] as const,
  list: (organizationId: string, params?: IStudentListParams) =>
    [...studentQueryKeys.all, 'list', organizationId, params] as const,
  detail: (organizationId: string, studentId: string) =>
    [...studentQueryKeys.all, 'detail', organizationId, studentId] as const,
} as const;
```

참고: https://github.com/lukemorales/query-key-factory

## Cache Invalidation

useMutation의 `onSettled`에서 관련 쿼리를 무효화합니다.

```tsx
const { mutate } = useMutation({
  mutationFn: (id: number) => deleteBookmarkCafe(id),
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: bookmarkCafeQuery.all(userId) });
    queryClient.invalidateQueries({
      queryKey: bookmarkCafeQuery.counts(userId),
    });
  },
});
```
