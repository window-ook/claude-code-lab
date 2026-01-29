# Rendering Performance Guidelines

## 💡 Indicators

| 지표 | Good    | Needs Improvement | Poor     |
| ---- | ------- | ----------------- | -------- |
| TTFB | < 800ms | 800ms–1800ms      | > 1800ms |
| FCP  | < 1.8s  | 1.8s–3.0s         | > 3.0s   |
| LCP  | < 2.5s  | 2.5s–4.0s         | > 4.0s   |
| CLS  | < 0.1   | 0.1–0.25          | > 0.25   |
| INP  | < 200ms | 200ms–500ms       | > 500ms  |

### 📋 코드 패턴 체크리스트

#### LCP

- [ ] above-the-fold의 `<Image>`에 `priority` 속성이 있는가
- [ ] LCP 후보 요소가 서버 컴포넌트에서 렌더링되는가
- [ ] 히어로 이미지가 lazy loading되고 있지 않은가

#### CLS

- [ ] 모든 `<Image>`에 width/height 또는 fill이 명시되었는가
- [ ] 폰트에 next/font를 사용하는가
- [ ] 동적 콘텐츠 삽입 시 skeleton/placeholder가 있는가

#### FCP

- [ ] 초기 번들에 불필요한 라이브러리가 포함되지 않았는가
- [ ] 폰트 로딩이 렌더링을 차단하지 않는가 (display: swap)

#### INP

- [ ] 무거운 이벤트 핸들러에 startTransition 또는 debounce가 적용되었는가
- [ ] 긴 작업이 Web Worker 또는 requestIdleCallback으로 분리되었는가

## 🏍️ Optimizations during Development

### Memoization on React

#### 적용 기준

- `useMemo`: 비용이 큰 연산(정렬, 필터링, 변환 등)에만 사용
- `useCallback`: 자식 컴포넌트에 콜백을 props로 전달할 때만 사용
- `React.memo`: props가 자주 동일한 순수 컴포넌트에만 사용

#### 금지 패턴

- 원시값 계산에 `useMemo` 사용 금지
- 모든 컴포넌트에 `React.memo` 일괄 적용 금지
- deps 배열에 매 렌더마다 새로 생성되는 객체/배열 전달 금지

### CDN Optimization

### Image Optimization on Next.js

- `next/image`의 `<Image>` 컴포넌트 필수 사용
- above-the-fold 이미지에 `priority` 속성 필수
- `width`/`height` 또는 `fill` 속성 필수 명시
- `sizes` 속성으로 반응형 크기 힌트 제공
- 포맷 우선순위: avif > webp > png
- 초기 뷰포트 내 이미지에 `loading="lazy"` 금지

### Font Optimization on Next.js

- `next/font/local` 사용
- `display: 'swap'` 설정으로 FOIT 방지
- `preload: true` 설정

```typescript
import localFont from 'next/font/local';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  preload: true,
  variable: '--font-pretendard',
});
```

### Code Splitting on Next.js/React (Lazy Load)

#### dynamic import 적용 대상

- 모달, 드로어 등 초기에 보이지 않는 UI
- 초기 뷰포트 밖의 무거운 컴포넌트
- 조건부 렌더링 컴포넌트

#### `ssr: false` 허용 기준

- canvas, WebGL, Web Audio 등 브라우저 전용 API 의존 컴포넌트에만 허용
- `window`/`document` 직접 의존은 `ssr: false` 사유가 아님 (`useEffect`로 처리 가능)

```typescript
import dynamic from 'next/dynamic';

const HeavyModal = dynamic(() => import('@components/HeavyModal'));
const CanvasEditor = dynamic(() => import('@components/CanvasEditor'), {
  ssr: false,
});
```

### Use hidden(display: none;) className in-need

- 탭, 아코디언 등 이미 로드된 상태에서 빠른 토글이 필요한 요소

### Less CLS by CSS Optimization

### 데이터를 나누어 로드하기

- 목록형 데이터: pagination (SEO 필요 시) 또는 infinite scroll (피드형)
- React Suspense + 서버 컴포넌트로 스트리밍 렌더링 활용

### Debounce/Throttle

| 상황            | 기법     | 기준값 |
| --------------- | -------- | ------ |
| 검색 입력       | debounce | 300ms  |
| 윈도우 리사이즈 | throttle | 200ms  |
| 스크롤 이벤트   | throttle | 100ms  |
| API 호출 버튼   | debounce | 500ms  |

### Cache 전략 (Next.js 16+)

#### 기본 동작

- fetch의 기본 캐시: `"auto no cache"` (이전 버전의 force-cache에서 변경)
- 명시적으로 캐시가 필요한 경우에만 `force-cache` 또는 `revalidate` 설정

#### 적용 기준

- 자주 변하지 않는 공개 데이터: `next: { revalidate: 3600 }` (시간 기반)
- 사용자별 데이터: 캐시 없이 매 요청 fetch (기본값 활용)
- CMS/외부 콘텐츠: `next: { tags: ['tag'] }` + `revalidateTag`로 온디맨드 무효화

#### 무효화 전략

- `revalidatePath`: 경로 기반 무효화
- `revalidateTag`: 태그 기반 무효화 (Server Action 또는 Route Handler에서)
- 캐시 적용 시 반드시 무효화 시점과 방법을 주석으로 명시

## ⚠️ Cautions

- 측정 없이 최적화하지 않는다 (조기 최적화 금지)
- 최적화를 위해 무거운 라이브러리를 추가하지 않는다
- 모든 컴포넌트에 React.memo를 일괄 적용하지 않는다
- 캐시 적용 시 반드시 무효화 전략을 함께 명시한다
- 성능을 위해 접근성(a11y)이나 UX를 훼손하지 않는다
- SSG/ISR을 모든 페이지에 강제하지 않는다
