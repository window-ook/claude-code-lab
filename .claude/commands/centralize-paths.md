# Centralize Paths

src: `@lib/apiPaths.ts`

- INTERNAL_PATHS
- EXTERNAL_PATHS

src: `@lib/imagePaths.ts`

- IMAGE_PATHS
  - { LOGO_IMG: 'https://www.image.com/cake.webp', ... }

## API 경로

클라이언트 컴포넌트에서 요청하는 라우트 핸들러 경로는 INTERNAL_PATHS, 서버 액션과 라우트 핸들러에서 외부 API로 요청하는 엔드포인트는 EXTERNAL_PATHS에 저장합니다.
서버 액션, 라우트 핸들러, 컴포넌트, 훅 등에서 하드코딩으로 경로를 명시하고 있다면 중앙화 후 참조하는 방식으로 변경하세요

## 이미지 경로

`<Image>` 컴포넌트에서 src에 연결한 이미지 경로가 문자열로 하드코딩되어있다면 IMAGE_PATHS에 저장합니다.
