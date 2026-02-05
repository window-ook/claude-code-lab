# TanStack Query 규칙

## 전역 queryClient

TanStack Query 기본 클라이언트 configuration을 작성합니다.
특정 쿼리 키를 제외하면 Global 세팅을 준수합니다.

## Query Key Factory

모든 쿼리키는 별도의 Query Key Factory에서 객체로 관리합니다.
절대 훅이나 컴포넌트에서 매직 문자열로 하드코딩하지 않습니다.

## 파일 및 훅 네이밍 컨벤션

`use[Domain][Action]`

| Action | 용도 | 예시 |
| ------ | ---- | ---- |
| List | 목록 조회 | `useStudentList` |
| Detail | 단건 조회 | `useStudentDetail` |
| Create | 생성 mutation | `useStudentCreate` |
| Update | 수정 mutation | `useStudentUpdate` |
| Delete | 삭제 mutation | `useStudentDelete` |
| Count | 카운트 조회 | `useStudentCount` |
| Search | 검색 조회 | `useStudentSearch` |

## 조건부 실행

useQuery를 사용할 때는 `enabled` 옵션을 활용해 조건부로 실행합니다.

## `isError`, `error` 상황별 사용 예시

| return  | 상황                           | 타입                |
| ------- | ------------------------------ | ------------------- |
| isError | 에러 발생 여부만 확인할 때     | boolean             |
| error   | 구체적인 에러 정보를 확인할 때 | object(Error), null |

## Cache Invalidation

useMutation 사용시 관련된 모든 쿼리를 정확히 무효화합니다.
v5에서 `onSuccess` 콜백은 deprecated 되었으므로, `onSettled`를 사용합니다.
