# Commands

현재 등록된 커스텀 커맨드 모음입니다.

## 📚 커맨드 목록

| 커맨드                                        | 설명                           | 활성화 명령어           |
| --------------------------------------------- | ------------------------------ | ----------------------- |
| [review](#review)                             | 코드 리뷰                      | `/review`               |
| [documentation](#documentation)               | TSDoc 문서화                   | `/documentation`        |
| [explain](#explain)                           | 코드 설명                      | `/explain`              |
| [make-design](#make-design)                   | 병렬 에이전트로 UI 디자인 생성 | `/make-design`          |
| [centralize-paths](#centralize-paths)         | 경로 중앙화                    | `/centralize-paths`     |
| [refactor-html-sturdy](#refactor-html-sturdy) | 시맨틱 HTML 리팩토링           | `/refactor-html-sturdy` |
| [cleanup-tw-cn](#cleanup-tw-cn)               | Tailwind className 정리        | `/cleanup-tw-cn`        |
| [cleanup-js](#cleanup-js)                     | JS/TS 코드 정리                | `/cleanup-js`           |
| [cleanup-css-file](#cleanup-css-file)         | CSS 파일 정리                  | `/cleanup-css-file`     |

## 🚄 review

코드의 버그, 보안 문제, 성능 이슈를 리뷰합니다.

### 사용 예시

```
/review src/components/Button.tsx
```

## 🚄 documentation

코드에 TSDoc 형식의 문서화를 추가합니다.

### 문서화 항목

- `@description`: 인터페이스, 함수, 클래스에 대한 설명
- `@params`: 파라미터 설명
- `@types`: 타입 설명
- `@return`: 반환값 설명

### 사용 예시

```
/documentation src/utils/formatDate.ts
```

## 🚄 explain

신규 개발자에게 설명하듯 코드의 실행 흐름과 사용 예시를 설명합니다.

### 사용 예시

```
/explain src/hooks/useAuth.ts
```

## 🚄 make-design

3개의 병렬 서브에이전트를 사용하여 하나의 UI를 다양한 변형으로 구현합니다. 사용자가 비교 후 선택할 수 있습니다.

### 주요 기능

- 레퍼런스 디자인 분석
- 3가지 UI 변형 동시 생성
- 사용자 피드백 기반 선택

### 사용 예시

```
/make-design "로그인 페이지 디자인"
```

## 🚄 centralize-paths

하드코딩된 API 경로와 이미지 경로를 중앙화된 상수로 관리합니다.

### 관리 파일

- `@lib/apiPaths.ts`: API 경로
  - `INTERNAL_PATHS`: 라우트 핸들러 경로
  - `EXTERNAL_PATHS`: 외부 API 엔드포인트
- `@lib/imagePaths.ts`: 이미지 경로
  - `IMAGE_PATHS`: 이미지 URL

### 사용 예시

```
/centralize-paths
```

## 🚄 refactor-html-sturdy

비시맨틱 태그를 시맨틱 HTML5 태그로 교체하고 aria 속성을 추가합니다.

### 작업 내용

- 시맨틱 태그 적용 (`<header>`, `<nav>`, `<main>`, `<section>` 등)
- aria 속성 추가 (`aria-label`, `role` 등)

### 사용 예시

```
/refactor-html-sturdy
```

## 🚄 cleanup-tw-cn

Tailwind CSS className을 정리하고 최적화합니다.

### 정리 규칙

- `w-4 h-4` → `size-4`
- `ml-2 mr-2` → `mx-2`
- `mt-2 mb-2` → `my-2`
- 반복되는 스타일을 `@layer components`로 추출

### 사용 예시

```
/cleanup-tw-cn src/components/Card.tsx
```

## 🚄 cleanup-js

JS/TS 파일에서 불필요한 코드를 정리합니다.

### 정리 대상

- 디버그 로그 (`console.log` 등)
- 주석 처리된 코드
- 사용하지 않는 import

### 사용 예시

```
/cleanup-js src/utils/*.ts
```

## 🚄 cleanup-css-file

`globals.css`에서 사용하지 않는 커스텀 클래스를 정리합니다.

### 정리 대상

- `@theme {}` 내 미사용 변수
- `@layer {}` 내 미사용 클래스

### 사용 예시

```
/cleanup-css-file
```
