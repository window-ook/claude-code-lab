# Skills

현재 등록된 커스텀 스킬 모음입니다.

## 📚 스킬 목록

| 스킬                                  | 설명                                   | 활성화 명령어       |
| ------------------------------------- | -------------------------------------- | ------------------- |
| [code-flow-report](#code-flow-report) | 코드 플로우 시각화 리포트 생성         | `/code-flow-report` |
| [idea-plan](#idea-plan)               | 아이디어 기획서 작성                   | `/idea-plan`        |
| [prd](#prd)                           | 제품 요구사항 정의서(PRD) 작성         | `/prd`              |
| [nextjs-16](#nextjs-16)               | Next.js 16 공식 문서 컨텍스트          | `/nextjs-16`        |
| [clean-tailwind](#clean-tailwind)     | Tailwind CSS를 컨벤션에 따라 순서 개선 | `/clean-tailwind`   |
| [playwright-pom](#playwright-pom)     | Playwright E2E 테스트 POM 패턴 가이드  | `/playwright-pom`   |

## 🪄 code-flow-report

웹 애플리케이션의 소스 코드를 분석하고, 런타임 플로우를 시각화하여 **인터랙티브 웹 리포트**를 생성합니다.

### 주요 기능

- Routes → Controllers → Services → DB 흐름 분석
- 클릭 가능한 인터랙티브 다이어그램 생성
- 초보자도 이해하기 쉬운 요약 제공
- JSON 그래프 모델 내보내기

### 사용 예시

```
"이 레포지토리를 분석해서 인터랙티브 웹 리포트를 생성해줘"
"코드 플로우를 시각화해줘"
```

## 🪄 idea-plan

서비스 개발을 위한 **아이디어 기획서**를 작성합니다. 사용자와의 Q&A를 통해 서비스 컨셉, 핵심 기능, 디자인 방향을 정의합니다.

### 사전 질문 항목

1. **서비스 컨셉**: 만들고자 하는 서비스의 컨셉
2. **핵심 기능**: 서비스에서 제공할 핵심 기능
3. **디자인 방향**: 서비스의 분위기, 참고 디자인

### 사용 예시

```
"/idea-plan"
"아이디어 기획서를 작성해줘"
```

## 🪄 prd

서비스 개발을 위한 **제품 요구사항 정의서(PRD)**를 작성합니다. 사용자와의 Q&A를 통해 비즈니스 목표, 기능 요구사항, 기술 스택을 정의합니다.

### 사전 질문 항목

1. **문제 정의**: 해결하고자 하는 핵심 문제
2. **타겟 사용자**: 주요 타겟 사용자와 Pain Point
3. **성공 지표**: KPI 및 성공 측정 방법
4. **핵심 기능 및 우선순위**: Must-have / Nice-to-have 구분
5. **사용자 시나리오**: User Flow 정의
6. **제약 조건 및 가정**: 기술적/비즈니스적 제약사항
7. **차별점 및 비전**: 경쟁 제품 대비 차별화 요소

### 사용 예시

```
"/prd"
"PRD 문서를 작성해줘"
```

## 🪄 nextjs-16

Next.js 16 App Router 개발을 위한 **공식 문서 기반 레퍼런스 가이드**입니다. 최신 패턴과 베스트 프랙티스를 제공합니다.

### 주요 내용

- **params Promise 패턴**: Next.js 16에서 params는 Promise로 처리
- **PageProps/LayoutProps 헬퍼**: 타입 안전한 페이지/레이아웃 props
- **useActionState**: useFormState 대신 사용하는 새로운 Hook
- **'use cache' 디렉티브**: Cache Components를 위한 캐싱 패턴
- **Server Components / Client Components**: 서버/클라이언트 컴포넌트 구분
- **Proxy 패턴**: 외부 API 프록시 설정

### 레퍼런스 문서 목록

| 번호 | 주제                         |
| ---- | ---------------------------- |
| 01   | Project Structure            |
| 02   | Layouts and Pages            |
| 03   | Linking and Navigating       |
| 04   | Server and Client Components |
| 05   | Cache Components             |
| 06   | Fetching Data                |
| 07   | Updating Data                |
| 08   | Caching and Revalidating     |
| 09   | Error Handling               |
| 10   | CSS                          |
| 11   | Image Optimization           |
| 12   | Font Optimization            |
| 13   | Metadata and OG Images       |
| 14   | Route Handlers               |
| 15   | Proxy                        |
| 16   | Deploying                    |
| 17   | Upgrading                    |

### 사용 예시

```
"/nextjs-16"
"Next.js 16 패턴으로 페이지를 만들어줘"
"App Router로 동적 라우트를 구현해줘"
```

## 🪄 clean-tailwind

Tailwind CSS 클래스를 일관된 순서로 정렬하는 리팩토링 스킬입니다. **핵심 원칙**: 시각적 렌더링 순서(바깥→안쪽→콘텐츠)를 따릅니다.

### 정렬 순서

| 순위 | 카테고리   | 속성 예시                                       |
| ---- | ---------- | ----------------------------------------------- |
| 0    | 커스텀 CSS | `card-tilt`, `hover-button` (맨 앞)             |
| 1    | 포지션     | `absolute`, `relative`, `fixed`, `top-*`        |
| 2    | 레이아웃   | `w-*`, `h-*`, `size-*`, `min-w-*`, `overflow-*` |
| 3    | 공백       | `m-*`, `mx-*`, `p-*`, `px-*`, `py-*`            |
| 4    | 외곽 효과  | `border-*`, `rounded-*`, `shadow-*`             |
| 5    | 배경색     | `bg-*`, `opacity-*`                             |
| 6    | Flex/Grid  | `flex`, `grid`, `gap-*`, `justify-*`, `items-*` |
| 7    | 폰트       | `text-*`, `font-*`, `leading-*`                 |
| 8    | 애니메이션 | `animate-*`                                     |
| 9    | 트랜지션   | `transition-*`, `duration-*`, `ease-*`          |

### 주요 규칙

- **조건부 클래스 배치**: `hover:`, `focus:` 등은 해당 기본 클래스 바로 뒤에 위치
- **크기 통합**: `w-8 h-8` → `size-8`로 통합
- **동적 클래스**: 정적 부분만 정렬하고 동적 부분은 원래 위치 유지

### 사용 예시

```
"/clean-tailwind"
"이 컴포넌트의 Tailwind 클래스 순서를 정리해줘"
"className 정렬 컨벤션을 적용해줘"
```

## 🪄 playwright-pom

Playwright E2E 테스트를 위한 **Page Object Model(POM) 패턴 가이드**입니다. 선택자와 비즈니스 로직을 분리하여 유지보수성과 재사용성을 극대화합니다.

### 디렉토리 구조

```
tests/e2e/
├── page-objects/           # POM 클래스들
│   ├── SignInPage.ts
│   └── MainPage.ts
├── utils/
│   ├── constants.ts        # 상수 (선택자, 목 데이터)
│   └── helpers.ts          # 공유 헬퍼 함수
└── core-flow/              # 테스트 스펙 파일들
```

### 주요 규칙

- **Locator 선언**: `readonly` 속성으로 생성자에서 초기화
- **메서드 네이밍**: `goto`, `fill`, `click`, `select`, `mock`, `ensure`, `wait` 접두사 사용
- **API 모킹**: CRUD 통합 메서드로 구현 (`mockCollectionAPI()`)
- **상수 관리**: 선택자/모킹 데이터는 `constants.ts`에서 중앙 관리

### 사용 예시

```
"/playwright-pom"
"E2E 테스트를 POM 패턴으로 작성해줘"
"Page Object 클래스를 만들어줘"
```
