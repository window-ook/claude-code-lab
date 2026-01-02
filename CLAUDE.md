## MUST DO ALWAYS

- 항상 한국어로 대답합니다.

## 선언적 프로그래밍

- 페이지의 일괄적인 로딩 상태는 `app/[페이지명]/loading.tsx`를 생성하여 핸들링합니다.
- 페이지 단위 에러 핸들링은 `app/[페이지명]/error.tsx`를 생성하여 핸들링합니다.
- 컴포넌트 단위 로딩 상태는 `React.Suspense`로 감싸서 핸들링합니다.
- 컴포넌트 단위 에러 핸들링은 상황별 적절한 방식을 사용합니다.
  - react-error-boundary > `<ErrorBoundary>`: 독립적인 UI 영역, 예상치 못한 런타임 에러 처리, 에러 모니터링
  - 컴포넌트 내부 if 스코프: 예상 가능한 에러, 사용자 인터랙션 에러

## 싱글라인 패턴

- if, 화살표 함수의 스코프 내부 실행 영역이 1 line일 경우, `{}`를 사용하지 않습니다.

```tsx
// if
if (!res.ok) return { success: false, message: '에러가 발생했습니다.' };

// arrow function
const sayHi = () => console.log('hi!!');
```

## 서버 액션 패턴

- Early Return 패턴
- 절대 try catch를 사용하지 않습니다.
  - 에러 발생 시 throw

```tsx
'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

/**
 * 북마크한 카페 삭제
 * @param id 북마크 ID
 */
export async function deleteBookmarkCafe(id: number): Promise<boolean> {
  if (!id) throw new Error('북마크 삭제를 위한 카페 ID가 유효하지 않습니다.');

  const supabase = await createServerSupabaseClient();
  const user = await supabase.auth.getUser();

  if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

  const user_id = user.data.user.id;
  const { error } = await supabase
    .from('bookmark')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);

  if (error) throw new Error(`북마크 삭제에 실패했습니다: ${error.message}`);

  return true;
}
```

## interface 선언 패턴

- `I-`를 접두사로 붙입니다.
- `-Props`와 같은 접미사는 절대 사용하지 않습니다.
- 반드시 export를 해야 합니다.

```tsx
export interface ICar {
  name: string;
  engines: number;
}
```

## Tailwind CSS className order priority

| 순위 | 종류           | 속성                                                      |
| ---- | -------------- | --------------------------------------------------------- |
| 1    | 포지션         | absolute, relative, fixed, top, left…                     |
| 2    | 레이아웃       | w-, h-, size-, min-w-[], min-h-[], overflow-hiddden, …    |
| 3    | 공백           | m-, mx-, my-, p, px-, py-…                                |
| 4    | 외곽 효과      | border-[], border-color-[], shadow-[]…                    |
| 5    | 배경색         | bg-, opacity-                                             |
| 6    | Flex Box, Grid | flex, grid, flex-col, grid-cols-, gap-, justify-, items-… |
| 7    | 폰트           | text-, font-, whitespace-, leading-, …                    |
| 8    | 애니메이션     | animate-                                                  |
| 9    | 트랜지션       | transition-, duration-, ease-…                            |
| -    | 조건           | hover:, group-hover:, focus:                              |

- `hover:` `group-hover:` `focus:` `active:` 등은 해당 속성 바로 뒤에 위치

## Path Factory

src: `@lib/apiPaths.ts`, `@lib/imagePaths.ts`

API 경로와 이미지 경로는 타입 단언을 사용하여 중앙에서 관리합니다.

```tsx
const INTERNAL_PATHS = {
  PRODUCT_DETAIL: `/api/product/detail/${id}`,
  // ...
} as const;

const EXTERNAL_PATHS = {
  USER_MANUAL: 'https://velog.io/@windowook/cafe-masters',
  // ...
} as const;
```

```tsx
const IMAGE_PATHS = {
  LOGO_IMG:
    'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//card_logo.avif',
  // ...
} as const;
```

## Query key Factory

src: `@queries/**`

React Query key도 타입 단언을 사용하여 중앙에서 관리합니다.
하위 디렉토리 트리는 도메인 중심으로 분류합니다.

- ex) `queries/supabase/**`, `queries/products/**`

```tsx
export const collectionCafeQuery = {
  all: (user_id: string) => ['collectionCafe', user_id],
  counts: (user_id: string) => ['collectionCafeCounts', user_id],
} as const;
```
