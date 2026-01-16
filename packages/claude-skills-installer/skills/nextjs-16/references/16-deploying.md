# Next.js Deploying

**Doc Version**: 16.1.2
**Source**: https://nextjs.org/docs/app/getting-started/deploying

---

## Contents

- [1. 배포 옵션 개요](#1-배포-옵션-개요)
- [2. Production Build](#2-production-build)
- [3. Node.js Server 배포](#3-nodejs-server-배포)
- [4. Docker Container 배포](#4-docker-container-배포)
- [5. Static Export 배포](#5-static-export-배포)
- [6. Platform Adapters](#6-platform-adapters)
- [7. Vercel 배포](#7-vercel-배포)
- [8. 환경 변수](#8-환경-변수)
- [Best Practices](#best-practices)

---

## 1. 배포 옵션 개요

Next.js는 네 가지 주요 배포 방식을 지원합니다.

### 배포 옵션 비교

| 옵션             | 기능 지원     | 사용 사례            |
| ---------------- | ------------- | -------------------- |
| Node.js server   | 모든 기능     | 풀스택 애플리케이션  |
| Docker container | 모든 기능     | 컨테이너 기반 인프라 |
| Static export    | 제한된 기능   | 정적 사이트, SPA     |
| Adapters         | 플랫폼별 지원 | 특정 호스팅 플랫폼   |

### 선택 가이드

```
┌─────────────────────────────────────────────────────────────┐
│                    배포 방식 선택 가이드                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  서버 기능이 필요한가?                                       │
│  ├── Yes → Node.js 또는 Docker                              │
│  │         ├── 컨테이너 인프라? → Docker                    │
│  │         └── 일반 서버? → Node.js                         │
│  │                                                          │
│  └── No → Static Export                                     │
│           └── CDN/정적 호스팅에 배포                         │
│                                                             │
│  특정 플랫폼 사용?                                           │
│  └── Yes → Platform Adapters (Vercel, Cloudflare 등)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Production Build

### package.json 스크립트 설정

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 빌드 명령어

| 명령어          | 설명                        |
| --------------- | --------------------------- |
| `npm run build` | 프로덕션용 최적화 빌드 생성 |
| `npm run start` | 프로덕션 서버 시작          |
| `npm run dev`   | 개발 서버 시작              |

### 빌드 프로세스

```bash
# 1. 프로덕션 빌드 생성
npm run build

# 2. 빌드 출력 확인
# .next/ 폴더에 빌드 결과물 생성

# 3. 프로덕션 서버 시작
npm run start
```

### 빌드 출력 구조

```
.next/
├── cache/                 # 빌드 캐시
├── server/                # 서버 사이드 번들
│   ├── app/              # App Router 페이지
│   └── chunks/           # 서버 청크
├── static/               # 정적 에셋
│   ├── chunks/           # 클라이언트 청크
│   └── css/              # CSS 파일
└── BUILD_ID              # 빌드 식별자
```

---

## 3. Node.js Server 배포

### 특징

- **모든 Next.js 기능 지원**
- 직접 서버 관리 필요
- 유연한 커스터마이징 가능

### 배포 단계

```bash
# 1. 의존성 설치
npm install

# 2. 프로덕션 빌드
npm run build

# 3. 서버 시작
npm run start
```

### 서버 설정 옵션

```ts
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // 서버 포트 설정 (환경 변수로 오버라이드 가능)
  // 기본값: 3000
};

export default config;
```

### 포트 및 호스트 설정

```bash
# 커스텀 포트로 시작
PORT=4000 npm run start

# 또는 package.json에서 설정
{
  "scripts": {
    "start": "next start -p 4000"
  }
}
```

### 호스팅 템플릿

| 플랫폼        | 템플릿 링크                                    |
| ------------- | ---------------------------------------------- |
| Flightcontrol | https://github.com/nextjs/deploy-flightcontrol |
| Railway       | https://github.com/nextjs/deploy-railway       |
| Replit        | https://github.com/nextjs/deploy-replit        |

---

## 4. Docker Container 배포

### 특징

- **모든 Next.js 기능 지원**
- Kubernetes, 클라우드 프로바이더 등 Docker 호환 환경에 배포 가능
- 일관된 배포 환경 보장

### 기본 Dockerfile

```dockerfile
# 1. 의존성 설치 단계
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. 빌드 단계
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. 프로덕션 단계
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 비루트 사용자로 실행
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Standalone 출력 설정

```ts
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
};

export default config;
```

### Docker 빌드 및 실행

```bash
# 이미지 빌드
docker build -t my-nextjs-app .

# 컨테이너 실행
docker run -p 3000:3000 my-nextjs-app
```

### 호스팅 템플릿

| 플랫폼           | 템플릿 링크                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| Docker           | https://github.com/vercel/next.js/tree/canary/examples/with-docker           |
| Docker Multi-Env | https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env |
| DigitalOcean     | https://github.com/nextjs/deploy-digitalocean                                |
| Fly.io           | https://github.com/nextjs/deploy-fly                                         |
| Google Cloud Run | https://github.com/nextjs/deploy-google-cloud-run                            |
| Render           | https://github.com/nextjs/deploy-render                                      |
| SST              | https://github.com/nextjs/deploy-sst                                         |

### 개발 환경 참고

Mac/Windows에서 개발 시 Docker 대신 `npm run dev`를 사용하면 더 나은 성능을 얻을 수 있습니다.

---

## 5. Static Export 배포

### 특징

- 정적 사이트 또는 SPA(Single-Page Application)로 배포
- HTML/CSS/JS를 제공하는 모든 웹 서버에서 호스팅 가능
- 서버 의존 기능 미지원

### 설정

```ts
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
};

export default config;
```

### 빌드 및 출력

```bash
# 빌드 실행
npm run build

# 출력 폴더: out/
```

### 출력 구조

```
out/
├── index.html
├── about.html
├── blog/
│   └── [slug].html
├── _next/
│   ├── static/
│   │   ├── chunks/
│   │   └── css/
│   └── data/
└── favicon.ico
```

### 지원되는 호스팅

| 호스팅           | 설명                 |
| ---------------- | -------------------- |
| AWS S3           | 정적 웹사이트 호스팅 |
| Nginx            | 정적 파일 서빙       |
| Apache           | 정적 파일 서빙       |
| GitHub Pages     | 무료 정적 호스팅     |
| Cloudflare Pages | 엣지 정적 호스팅     |

### 미지원 기능

Static Export에서 **지원되지 않는** 서버 의존 기능:

| 미지원 기능           | 대안                        |
| --------------------- | --------------------------- |
| Server Actions        | 외부 API 사용               |
| Route Handlers (동적) | 정적 데이터만 사용          |
| Middleware            | 클라이언트 측 로직          |
| ISR                   | 빌드 시 정적 생성           |
| Dynamic Routes (서버) | `generateStaticParams` 사용 |

### GitHub Pages 템플릿

https://github.com/nextjs/deploy-github-pages

---

## 6. Platform Adapters

### 개요

Platform Adapters는 특정 호스팅 플랫폼에 맞게 Next.js를 최적화합니다.

### 지원 플랫폼

| 플랫폼               | 문서 링크                                                   |
| -------------------- | ----------------------------------------------------------- |
| Appwrite Sites       | https://appwrite.io/docs/products/sites/quick-start/nextjs  |
| AWS Amplify Hosting  | https://docs.amplify.aws/nextjs/start/quickstart            |
| Cloudflare           | https://developers.cloudflare.com/workers/frameworks/nextjs |
| Deno Deploy          | https://docs.deno.com/examples/next_tutorial                |
| Firebase App Hosting | https://firebase.google.com/docs/app-hosting/get-started    |
| Netlify              | https://docs.netlify.com/frameworks/next-js/overview        |
| Vercel               | https://vercel.com/docs/frameworks/nextjs                   |

### Deployment Adapters API

표준화된 어댑터 지원을 위한 Deployment Adapters API가 개발 중입니다.

---

## 7. Vercel 배포

### 특징

- Next.js 제작사의 공식 호스팅 플랫폼
- 제로 설정 배포
- 모든 Next.js 기능 완벽 지원

### 배포 방법

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Git 연동 배포

1. GitHub/GitLab/Bitbucket에 저장소 연결
2. 푸시 시 자동 배포
3. PR별 미리보기 배포

### Vercel 최적화 기능

| 기능               | 설명                  |
| ------------------ | --------------------- |
| Edge Functions     | 전 세계 엣지에서 실행 |
| Image Optimization | 자동 이미지 최적화    |
| ISR                | 증분 정적 재생성      |
| Analytics          | 성능 분석             |
| Preview Deploys    | PR별 미리보기 환경    |

---

## 8. 환경 변수

### 환경 변수 파일

| 파일               | 용도                        |
| ------------------ | --------------------------- |
| `.env`             | 모든 환경 기본값            |
| `.env.local`       | 로컬 오버라이드 (gitignore) |
| `.env.development` | 개발 환경                   |
| `.env.production`  | 프로덕션 환경               |
| `.env.test`        | 테스트 환경                 |

### 클라이언트 노출

```bash
# 서버에서만 사용
DATABASE_URL=postgresql://...

# 클라이언트에서도 사용 (NEXT_PUBLIC_ 접두사)
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 런타임 환경 변수

```ts
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  env: {
    customKey: 'my-value',
  },
};

export default config;
```

### 프로덕션 환경 변수 주입

```bash
# 빌드 시 환경 변수
DATABASE_URL=... npm run build

# 런타임 환경 변수
DATABASE_URL=... npm run start
```

---

## Best Practices

| 모범 사례                        | 설명                        |
| -------------------------------- | --------------------------- |
| 서버 기능 필요 시 Node.js/Docker | 모든 기능 지원              |
| 정적 사이트는 Static Export      | 간단한 배포, CDN 활용       |
| 컨테이너 환경은 Docker           | 일관된 배포 환경            |
| `output: 'standalone'` 사용      | Docker 이미지 크기 최소화   |
| 환경 변수 분리                   | 환경별 `.env` 파일 사용     |
| `NEXT_PUBLIC_` 접두사 주의       | 클라이언트 노출 변수만 사용 |
| CI/CD 파이프라인 구축            | 자동화된 빌드 및 배포       |
| 미리보기 배포 활용               | PR별 테스트 환경            |

---

## 배포 체크리스트

```
□ package.json 스크립트 확인 (build, start)
□ 환경 변수 설정 (.env.production)
□ next.config.ts 프로덕션 설정 확인
□ 빌드 테스트 (npm run build)
□ 프로덕션 서버 테스트 (npm run start)
□ 보안 헤더 설정
□ 에러 페이지 구성 (error.tsx, not-found.tsx)
□ 메타데이터 및 OG 이미지 설정
□ 분석 도구 연동
□ 모니터링 설정
```

---

## output 옵션 비교

| output 값      | 설명                      | 빌드 결과           |
| -------------- | ------------------------- | ------------------- |
| (기본값)       | Node.js 서버 빌드         | `.next/`            |
| `'standalone'` | 최소 서버 빌드 (Docker용) | `.next/standalone/` |
| `'export'`     | 정적 HTML 내보내기        | `out/`              |
